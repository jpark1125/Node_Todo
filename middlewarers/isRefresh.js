// jwt 모듈을 가져옵니다. 이 모듈은 토큰을 생성하고 검증하는데 사용됩니다.
const jwt = require("jsonwebtoken");

// 토큰 생성 함수를 가져옵니다.
const { createToken } = require("../utils/jwt");

// 환경 변수를 가져옵니다. 이 변수는 토큰을 생성하고 검증할 때 사용되는 비밀키입니다.
require("dotenv").config();
const secretKey = "" + process.env.ACCESS_KEY;

// User는 데이터베이스 모델입니다.
const { User } = require("../models");

// 토큰을 생성하는 함수입니다.
const createToken = (payload) => {
  // 생성된 토큰을 콘솔에 출력합니다.
  console.log(createToken);

  // 토큰을 생성합니다. 토큰에는 사용자 아이디가 담기며, HS256 알고리즘을 사용하고, 30분 후에 만료됩니다.
  const token = jwt.sign({ id: payload.toString() }, secretKey, {
    algorithm: "HS256",
    expiresIn: "30m",
  });

  // 생성된 토큰을 반환합니다.
  return token;
};

module.exports = async (req, res, next) => {
  try {
    // 클라이언트가 보낸 토큰을 가져옵니다.
    const token = req.get("x_auth");

    // 토큰을 검증하고, 토큰에 담긴 정보를 가져옵니다.
    const decodedToken = jwt.verify(token, secretKey);
    const { id } = decodedToken;

    // 토큰에 담긴 사용자 아이디에 해당하는 사용자 정보를 데이터베이스에서 가져옵니다.
    const rows = await User.findOne({ id: id });

    // 해당 사용자가 존재하면, 사용자 정보를 응답에 담아 보냅니다.
    if (rows) {
      return res.status(200).json({ result: rows });
    } else {
      // 해당 사용자가 존재하지 않는다면, false를 반환합니다.
      return false;
    }
  } catch (err) {
    // 오류가 발생하면, 오류 정보를 콘솔에 출력합니다.
    console.log(err);
  }
};

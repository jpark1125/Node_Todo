const jwt = require("jsonwebtoken");

require("dotenv").config();

const { ACCESS_KEY, REFRESH_KEY } = process.env;

module.exports = {
  // 토큰을 생성하는 함수입니다. 페이로드를 인자로 받아 해당 페이로드를 암호화하여 토큰 형태로 반환합니다.
  createToken: (payload) => {
    //const { id } = req.body;
    const token = jwt.sign(
      {
        user_id: payload.user_id,
        id: payload.id,
      },
      ACCESS_KEY,
      {
        algorithm: "HS256",
        expiresIn: "10m",
      }
    );
    return token;
  },
  // 토큰을 검증하는 함수입니다. 토큰을 인자로 받아 해당 토큰을 복호화하고 그 결과를 반환합니다.
  verifyToken: (token) => {
    if (!token) {
      return "";
    }
    let decoded = jwt.verify(token, ACCESS_KEY);
    return decoded;
  },
  // 리프레시 토큰을 생성하는 함수입니다. 페이로드를 인자로 받아 해당 페이로드를 암호화하여 리프레시 토큰 형태로 반환합니다.
  createRefreshToken: (payload) => {
    const retoken = jwt.sign({ user_id: payload.id }, REFRESH_KEY, {
      algorithm: "HS256",
      expiresIn: "7d", // 리프레시 토큰의 유효기간은 7일입니다.
    });
    return retoken;
  },
  // 리프레시 토큰을 검증하는 함수입니다. 토큰을 인자로 받아 해당 토큰을 복호화하고 그 결과를 반환합니다.
  verifyRefreshToken: (token) => {
    if (!token) {
      return "";
    }
    let decoded = jwt.verify(token, REFRESH_KEY);
    return decoded;
  },
};

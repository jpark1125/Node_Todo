// jwt 모듈을 가져옵니다. 이 모듈은 토큰을 생성하고 검증하는데 사용됩니다.
const jwt = require("jsonwebtoken");

// 환경 변수를 가져옵니다. 이 변수는 토큰을 생성하고 검증할 때 사용되는 비밀키입니다.
require("dotenv").config();
const secretKey = "" + process.env.ACCESS_KEY;

// Users는 데이터베이스 모델입니다.
const { Users } = require("../models");

module.exports = {
  // 클라이언트가 보낸 토큰을 검증하는 미들웨어 함수입니다.
  Check: async (req, res, next) => {
    try {
      // 클라이언트가 보낸 토큰을 가져옵니다. 토큰은 'Bearer ' 뒤에 위치합니다.
      const token = req.headers.authorization.split("Bearer ")[1];
      console.log(token);

      // 토큰을 검증하고, 토큰에 담긴 정보를 가져옵니다.
      const decodedToken = jwt.verify(token, secretKey);
      console.log(decodedToken);

      // 토큰에 담긴 사용자 아이디를 가져옵니다.
      const { id } = decodedToken;
      console.log(id);

      // 사용자 아이디에 해당하는 사용자 정보를 데이터베이스에서 가져옵니다.
      const rows = await Users.findOne({
        where: { id: id },
      });

      // 해당 사용자가 존재하면, 토큰에 담긴 정보를 응답에 담아 보냅니다.
      if (rows) {
        return res.status(200).json({ result: decodedToken });
      } else {
        // 해당 사용자가 존재하지 않는다면, 토큰이 만료되었다는 메시지를 보냅니다.
        res.send("expired");
      }

      // 다음 미들웨어 함수를 실행합니다.
      next();
    } catch (err) {
      // 오류가 발생하면, 오류 정보를 콘솔에 출력합니다.
      console.log(err);
    }
  },
};

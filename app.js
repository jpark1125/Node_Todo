const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const compression = require("compression");
const jwt = require("jsonwebtoken");
const helmet = require("helmet");
const { Users } = require("./models");
const { sequelize } = require("./models");
const Router = require("./routes");

// 데이터베이스 연결
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("연결");
  })
  .catch((err) => {
    console.log(err);
  });

// 미들웨어 설정
app.use(express.json()); // JSON 형태의 요청 본문을 파싱하는 미들웨어입니다.
app.use(cors()); // CORS를 처리하는 미들웨어입니다.
app.use(compression()); // HTTP 요청을 압축하는 미들웨어입니다.
app.use(helmet()); // 보안 관련 HTTP 헤더를 설정하는 미들웨어입니다.

// 각 라우터 설정
app.use("/user", Router.UserRoute);
app.use("/follow", Router.FollowRoute);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

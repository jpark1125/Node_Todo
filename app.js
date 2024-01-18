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

const db = require("./models");

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
app.use(compression());
app.use(helmet());

// 각 라우터 설정
app.use("/user", Router.UserRoute);
app.use("/signup", Router.SignupRoute);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

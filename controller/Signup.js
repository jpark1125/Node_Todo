// 필요한 모듈들을 가져옵니다.
const { Users, sequelize } = require("../models");
const jwt = require("../utils/jwt");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
require("dotenv").config();

module.exports = {
  // 회원가입을 처리하는 함수입니다.
  Signup: async (req, res) => {
    try {
      // 요청에서 필요한 정보들을 가져옵니다.
      let { name, email, id, passwd } = req.body;

      // 비밀번호를 해시 처리합니다.
      const hash = await bcrypt.hash(passwd, 10);

      // 고유한 사용자 아이디를 생성합니다.
      const beforeId = shortid.generate();

      // 토큰을 생성합니다.
      let token = jwt.createToken({
        user_id: id,
        id: beforeId,
      });
      let rtoken = jwt.createRefreshToken({
        id: beforeId,
      });

      // 트랜잭션을 시작합니다.
      const tx = await sequelize.transaction();

      // 사용자 정보를 데이터베이스에 저장합니다.
      const rows = await Users.create(
        {
          name: name,
          email: email,
          id: id,
          passwd: hash,
          refreshtoken: rtoken,
        },
        {
          transaction: tx,
        }
      );

      // 사용자 정보가 정상적으로 생성되지 않았다면 트랜잭션을 롤백합니다.
      if (!info_create) {
        await tx.rollback();
        throw {
          code: 7,
        };
      }

      // 트랜잭션을 커밋합니다.
      await tx.commit();

      // 성공적으로 처리되었다는 응답을 클라이언트에게 보냅니다.
      return res.status(200).json({
        result: "success",
        resuelt: rows,
        xauth: token,
        rxauth: rtoken,
      });
    } catch (err) {
      console.log(err);
    }
  },

  // 이메일 중복 확인을 처리하는 함수입니다.
  Checkemail: async (req, res) => {
    try {
      // 요청에서 필요한 정보를 가져옵니다.
      const data = await Users.findOne({ where: { email: req.body.email } });

      // 이미 존재하는 이메일이면 에러 메시지를 반환합니다.
      if (data) {
        res.status(400).json({
          result: false,
          message: "이미 존재하는 이메일입니다.",
        });
        if (rows) return res.status(200).json({ result: rows });
      } else {
        // 존재하지 않는 이메일이면 성공 코드를 반환합니다.
        res.send(200);
      }
    } catch (err) {
      console.log(err);
    }
  },

  // 아이디 중복 확인을 처리하는 함수입니다.
  Checkid: async (req, res) => {
    try {
      // 요청에서 필요한 정보를 가져옵니다.
      const data = await Users.findOne({ where: { id: req.body.id } });

      // 이미 존재하는 아이디면 에러 메시지를 반환합니다.
      if (data) {
        res.status(400).json({
          result: false,
          message: "이미 존재하는 아이디입니다.",
        });
        if (rows) return res.status(200).json({ result: rows });
      } else {
        // 존재하지 않는 아이디면 성공 코드를 반환합니다.
        res.send(200);
      }
    } catch (err) {
      console.log(err);
    }
  },
};

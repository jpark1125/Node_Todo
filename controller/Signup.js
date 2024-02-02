const { Users, sequelize } = require("../models");
const jwt = require("../utils/jwt");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
require("dotenv").config();

module.exports = {
  // 회원가입을 처리하는 함수입니다.
  Signup: async (req, res) => {
    try {
      let { name, email, id, passwd } = req.body;

      const hash = await bcrypt.hash(passwd, 10);

      // 고유한 사용자 아이디를 생성합니다.
      const beforeId = shortid.generate();

      // 토큰 생성
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

      await tx.commit();

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
      const data = await Users.findOne({ where: { email: req.body.email } });

      if (data) {
        res.status(400).json({
          result: false,
          message: "이미 존재하는 이메일입니다.",
        });
        if (rows) return res.status(200).json({ result: rows });
      } else {
        res.send(200);
      }
    } catch (err) {
      console.log(err);
    }
  },

  // 아이디 중복 확인을 처리하는 함수입니다.
  Checkid: async (req, res) => {
    try {
      const data = await Users.findOne({ where: { id: req.body.id } });

      if (data) {
        res.status(400).json({
          result: false,
          message: "이미 존재하는 아이디입니다.",
        });
        if (rows) return res.status(200).json({ result: rows });
      } else {
        res.send(200);
      }
    } catch (err) {
      console.log(err);
    }
  },
};

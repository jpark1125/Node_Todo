const { Board } = require("../models");
const { Op } = require("sequelize");
const { Users } = require("../models");
const jwt = require("../utils/jwt");
const { sequelize, QueryTypes } = require("../models");

module.exports = {
  // 게시글을 작성하는 기능
  Post: async (req, res) => {
    try {
      // 요청 본문에서 필요한 정보를 추출
      let { title } = req.body;
      //console.log(req.files);
      let { content } = req.body;
      let { xauth } = req.body;

      let decoded = jwt.verifyToken(xauth);

      // 게시글을 데이터베이스에 생성
      const rows = await Board.create({
        title: title,
        content: content,
        //image: image,
        id: decoded.id,
      });

      if (rows) return res.status(200).json({ result: rows });
    } catch (err) {
      console.log(err);
    }
  },

  // 게시글을 삭제하는 기능
  Delete: async (req, res) => {
    try {
      let { xauth } = req.body;

      let decoded = jwt.verifyToken(xauth);

      const rows = await Board.destroy({
        where: { id: decoded.id },
      });

      if (rows) return res.status(200).json({ result: rows });
      else {
        res.send(0);
      }
    } catch (err) {
      console.log(err);
    }
  },

  // 모든 게시글을 가져오는 기능
  Get: async (req, res) => {
    try {
      // 모든 게시글을 데이터베이스에서 가져옵니다.
      const rows = await Board.findAll();

      if (rows) return res.status(200).json({ result: rows });
    } catch (err) {
      console.log(err);
    }
  },

  // 게시글을 검색하는 기능입니다.
  Search: async (req, res) => {
    try {
      const rows = await Board.findAndCountAll({
        attribute: ["title", "content"],
        where: {
          title: {
            [Op.like]: "%" + req.body.title + "%",
          },
        },
        where: {
          content: {
            [Op.like]: "%" + req.body.content + "%",
          },
        },
      });

      if (rows) return res.status(200).json({ result: rows });
      else {
        res.send(0);
      }
    } catch (err) {
      console.log(err);
    }
  },

  // 게시글을 수정하는 기능
  Update: async (req, res) => {
    try {
      let { xauth } = req.body;

      let decoded = jwt.verifyToken(xauth);

      // 새로운 제목과 내용을 가져옵니다.
      let { n_title, n_content } = req.body;

      // 게시글을 새로운 제목과 내용으로 수정
      const rows = await Board.update(
        {
          title: n_title,
          content: n_content,
        },
        {
          where: {
            id: decoded.id,
          },
        }
      );

      if (rows) return res.status(200).json({ result: rows });
      else {
        res.send(0);
      }
    } catch (err) {
      console.log(err);
    }
  },
};

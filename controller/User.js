const { createRefreshToken } = require("../utils/jwt");
const secretKey = "" + process.env.ACCESS_KEY;

const signupController = require("./Signup");

module.exports = {
  Signup: signupController.Signup,
  // 로그인 처리
  Login: async (req, res) => {
    try {
      const { id, passwd } = req.body;
      let token;
      let rtoken;

      const rows = await Users.findOne({
        where: { id: id },
      });

      // 입력받은 비밀번호와 저장된 해시를 비교
      const compare = await bcrypt.compare(passwd, rows.passwd);

      // 비밀번호 일치시 토큰 생성
      if (compare == true) {
        token = jwt.createToken({
          user_id: rows.id,
          id: rows.id,
        });
        rtoken = createRefreshToken({ id: rows.id });

        // 생성한 토큰을 사용자 정보에 업데이트
        await Users.update(
          {
            refreshtoken: rtoken,
          },
          {
            where: {
              id: rows.id,
            },
          }
        );

        return res.status(200).json({ token: token, rtoken: rtoken });
      } else throw { code: 9 };
    } catch (err) {
      console.log(err);
    }
  },

  // 토큰을 발급
  IssueToken: async (req, res) => {
    try {
      let { rxauth } = req.headers;

      const issueId = jwt.verifyRefreshToken(rxauth);

      const isTrue = await Users.findOne({
        where: {
          id: issueId.user_id,
          refreshtoken: rxauth,
        },
      });

      if (isTrue) {
        let token = jwt.createToken({
          id: isTrue.id,
        });

        return res.status(200).json({ xauth: token });
      } else {
        res.status(200).json({ result: "failed" });
      }
    } catch (err) {
      console.log(err);
    }
  },

  // 사용자 목록 조회
  List: async (req, res) => {
    try {
      const rows = await Users.findAll();

      if (rows) return res.status(200).json({ result: rows });
      else throw console.log(error);
    } catch (err) {
      console.log(err);
    }
  },

  TokenCh: async (req, res) => {
    try {
      let auth = req.get("x_auth");

      const token = authorization(" ", " ")[1];
      jwt.verify(token, secretKey, (err, encode) => {
        if (err) console.error(err);
        else {
          console.log(encode);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};

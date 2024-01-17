const { createRefreshToken } = require("../utils/jwt");
const secretKey = "" + process.env.ACCESS_KEY;

const signupController = require("./controllers/Signup");

router.post("/register", signupController.Signup);

module.exports = {
  // 로그인을 처리하는 함수입니다.
  Login: async (req, res) => {
    try {
      // 요청에서 필요한 정보들을 가져옵니다.
      const { id, passwd } = req.body;
      let token;
      let rtoken;

      // 사용자 정보를 데이터베이스에서 가져옵니다.
      const rows = await Users.findOne({
        where: { id: id },
      });

      // 입력받은 비밀번호와 저장된 해시를 비교합니다.
      const compare = await bcrypt.compare(passwd, rows.passwd);

      // 비밀번호가 일치한다면
      if (compare == true) {
        // 토큰을 생성합니다.
        token = jwt.createToken({
          user_id: rows.id,
          id: rows.id,
        });
        rtoken = createRefreshToken({ id: rows.id });

        // 생성한 토큰을 사용자 정보에 업데이트 합니다.
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

        // 토큰을 응답에 담아 클라이언트에게 보냅니다.
        return res.status(200).json({ token: token, rtoken: rtoken });
      } else throw { code: 9 }; // 비밀번호가 일치하지 않는다면 에러 코드를 반환합니다.
    } catch (err) {
      console.log(err);
    }
  },

  // 토큰을 발급하는 함수입니다.
  IssueToken: async (req, res) => {
    try {
      // 요청 헤더에서 필요한 정보를 가져옵니다.
      let { rxauth } = req.headers;

      // 토큰을 검증합니다.
      const issueId = jwt.verifyRefreshToken(rxauth);

      // 토큰이 유효한지 검사합니다.
      const isTrue = await Users.findOne({
        where: {
          id: issueId.user_id,
          refreshtoken: rxauth,
        },
      });

      // 토큰이 유효하다면
      if (isTrue) {
        // 새로운 토큰을 생성합니다.
        let token = jwt.createToken({
          id: isTrue.id,
        });

        // 새로운 토큰을 응답에 담아 클라이언트에게 보냅니다.
        return res.status(200).json({ xauth: token });
      } else {
        // 토큰이 유효하지 않다면 실패 메시지를 반환합니다.
        res.status(200).json({ result: "failed" });
      }
    } catch (err) {
      console.log(err);
    }
  },

  // 사용자 목록을 조회하는 함수입니다.
  List: async (req, res) => {
    try {
      // 모든 사용자 정보를 가져옵니다.
      const rows = await Users.findAll();

      // 사용자 정보가 있으면 반환하고, 그렇지 않으면 에러를 반환합니다.
      if (rows) return res.status(200).json({ result: rows });
      else throw console.log(error);
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

  // 토큰을 검증하는 함수입니다.
  TokenCh: async (req, res) => {
    try {
      // 요청 헤더에서 필요한 정보를 가져옵니다.
      let auth = req.get("x_auth");

      // 토큰을 분리하여 검증합니다.
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

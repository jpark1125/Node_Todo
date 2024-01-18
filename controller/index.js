// 사용자 관련 로직을 처리하는 컨트롤러를 불러옵니다.
const UserController = require("./User");

// 불러온 컨트롤러들을 모듈로 내보내어 다른 파일에서 사용할 수 있도록 합니다.
module.exports = {
  UserController,
};

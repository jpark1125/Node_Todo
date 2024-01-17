"use strict";

// Node.js의 내장 모듈인 'fs'와 'path'를 가져옵니다.
// 'fs'는 파일 시스템에 접근하기 위한 모듈이고, 'path'는 파일과 디렉토리 경로를 작업하기 위한 모듈입니다.
const fs = require("fs");
const path = require("path");

// Sequelize를 사용하기 위해 필요한 모듈을 가져옵니다.
const { Sequelize, QueryTypes } = require("sequelize");

// 현재 실행 중인 파일의 이름을 가져옵니다.
const basename = path.basename(__filename);

// 환경 변수에서 NODE_ENV 값을 가져옵니다. 설정되어 있지 않다면 'development'를 기본값으로 사용합니다.
const env = process.env.NODE_ENV || "development";

// 설정 파일에서 해당 환경의 설정을 가져옵니다.
const config = require(__dirname + "/../config/config.json")[env];

// DB 연결과 모델을 관리하기 위한 객체를 생성합니다.
const db = {};

let sequelize;

// 환경 변수를 사용하여 데이터베이스에 접속하는 경우
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // 설정 파일을 사용하여 데이터베이스에 접속하는 경우
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// __dirname은 현재 실행 중인 파일의 디렉토리 경로를 가리킵니다.
// 따라서 fs.readdirSync(__dirname)는 현재 디렉토리에 있는 모든 파일과 디렉토리의 이름을 배열로 반환합니다.
fs.readdirSync(__dirname)
  .filter((file) => {
    // '.'으로 시작하지 않는 파일, 파일 이름이 index.js가 아닌 파일, 파일 확장자가 .js인 파일만 선택합니다.
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    // 각 모델 파일을 import하여 모델을 생성하고, db 객체에 추가합니다.
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// db 객체에 있는 모든 모델에 대해, 만약 associate 속성이 있다면 이를 호출하여 모델 간의 관계를 설정합니다.
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// db 객체에 sequelize 인스턴스와 Sequelize 생성자를 추가합니다.
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.QueryTypes = QueryTypes;

// db 객체를 내보냅니다.
module.exports = db;

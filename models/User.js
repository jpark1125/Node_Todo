module.exports = (sequelize, DataTypes) => {
  // 'Users'라는 이름의 테이블을 정의합니다.
  const Users = sequelize.define(
    "Users",
    {
      idx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(180),
        allowNull: false,
      },
      id: {
        type: DataTypes.STRING(11),
        allowNull: false,
      },
      passwd: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      refreshtoken: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
      paranoid: false,
    }
  );

  return Users;
};

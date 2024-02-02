module.exports = (sequelize, DataTypes) => {
  const Board = sequelize.define(
    "Board",
    {
      idx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },

      content: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      id: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
      paranoid: false,
    }
  );

  return Board;
};

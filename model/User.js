
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
    userid: {
      type: Sequelize.NUMBER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    designername: {
      type: Sequelize.STRING,
      allowNull: true
    },
    password: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    }
  },{
    createdAt: false,
    updatedAt: false
  });
  return User;
};

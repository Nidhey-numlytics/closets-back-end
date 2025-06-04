module.exports = (sequelize, Sequelize) => {
  const FormContent = sequelize.define("FormContent", {
    id: {
      type: Sequelize.NUMBER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userid: {
      type: Sequelize.NUMBER,
      allowNull: false,
    },
    jobid: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    jsoncontent: {
      type: Sequelize.STRING,
      allowNull: true,
    }
  },{
    createdAt: false,
    updatedAt: false
    });
  return FormContent;
};

module.exports = (sequelize, Sequelize) => {
  const Log = sequelize.define("Log", {
    logid: {
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
      type: Sequelize.NUMBER,
      allowNull: false,
    },
    logdate: {
      type: Sequelize.DATE,
      default: Sequelize.NOW,
    },
    jsoncontent: {
      type: Sequelize.STRING,
    },
    submissionid:{
      type: Sequelize.NUMBER,
      allowNull: true,
    },
    templateid:{
      type: Sequelize.NUMBER,
      allowNull: true,
    },
    webhookresponse:{
      type: Sequelize.STRING,
      allowNull: true
    }
  },{
    createdAt: false,
    updatedAt: false
    });
  return Log;
};

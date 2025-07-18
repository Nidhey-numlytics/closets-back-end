const { raw } = require("mysql2");
const db = require("../config/db");
const axios = require("axios");
const { where, Op, fn, col, literal } = require("sequelize");
require('dotenv').config();
const Log = db.log;
const FormContent = db.formContent;

class PDFService {
    static async SaveFilter(reqBody) {
      console.log(reqBody);
        const [form, created] = await Log.upsert({ logid: reqBody.logId, jobid: reqBody.jobId, userid: reqBody.designerId, jsoncontent: JSON.stringify(reqBody) });
        if(created) {
          const count = parseInt(reqBody.closetsFormCount);
          for(let i=1;i<=count;i++) {
            const response = await FormContent.create({ userid: reqBody.designerId, jobid: reqBody.jobId + "-" + i });
            if(response) console.log("Form created successfully " + reqBody.jobId + "-" + i);
        }
      } else {
           await FormContent.update({ userid: reqBody.designerId }, { where: { jobid: { [Op.like]: reqBody.jobId+'%' }, isdeleted: false } });
        }
      return form;
  }


    static async UploadTemplateToDocuSeal(documents) {

        const response = await axios.post(
          `https://api.docuseal.com/templates/pdf`,
          documents,
          {
            headers: {
              "X-Auth-Token": process.env.DOCUSEAL_API_KEY,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        return response;
    }
    
    static async SendRequestForSignDocument(signRequest) {
      const response = await axios.post(
          `https://api.docuseal.com/submissions`,
          signRequest,
          {
            headers: {
              "X-Auth-Token": process.env.DOCUSEAL_API_KEY,
              "Content-Type": "application/json",
            },
          }
        );
      return response;
    }

    static async GetAllJobID(userID, role) {
      if(role === "user") {
        const jobids = await Log.findAll({ attributes: ['jobid', [fn('JSON_UNQUOTE', fn('JSON_EXTRACT', col('jsoncontent'), literal("'$.clientName'"))),'clientName']], raw : true, order: [['logid', 'DESC']], where : { userId: userID } });
        return jobids;
      } else {
        const jobids = await Log.findAll({ attributes: ['jobid', [fn('JSON_UNQUOTE', fn('JSON_EXTRACT', col('jsoncontent'), literal("'$.clientName'"))),'clientName']], raw : true, order: [['logid', 'DESC']] });
        return jobids;
      }
    }

    static async GetJobDetailByID(jobID) {
      const jobDetails = await Log.findOne({ where: { jobid : jobID }, attributes: ['jsoncontent', 'logid'] });
      return jobDetails;
    }

    static async GetJobIDs(jobID) {
      const jobIds = await FormContent.findAll({ where: { jobid : { [Op.startsWith]: jobID }, isdeleted: false }, attributes: ['jobid', [fn('JSON_UNQUOTE', fn('JSON_EXTRACT', col('jsoncontent'), literal("'$.projectname'"))),'projectName'] ]});
      return jobIds;
    }

    static async updateJobIdContent(reqBody) {
      const jobIds = await FormContent.update({  jsoncontent: JSON.stringify(reqBody) }, { where: { jobid: reqBody.jobId, isdeleted: false } });
      return jobIds;
    }

    static async CheckIfJobContentExists(jobId) {
      const results = await FormContent.findAll({ where: { jobid: { [Op.like]: jobId+'%' }, jsoncontent: null, isdeleted: false } });
      return results;
    }

    static async UpdateParentJsonContent(reqBody) {
      const results = await Log.update({  jsoncontent: JSON.stringify(reqBody) }, { where: { jobid: reqBody.jobId } });
      return results;
    }

    static async GetChildJsonContent(jobId) {
      const results = await FormContent.findAll({ where: { jobid: { [Op.like]: jobId+'%' }, isdeleted: false } });
      return results;
    }

    static async GetChildJobDetailByID(jobID) {
      const jobDetails = await FormContent.findOne({ where: { jobid : jobID, isdeleted: false } });
      return jobDetails;
    }

     static async DeleteChildJobID(jobID) {
      const jobDetails = await FormContent.update({ isdeleted: true },{ where: { jobid : jobID } });
      if(jobDetails) {
        const parentJobId = jobID.split('-')[0];
        const parentJson = await Log.findAll({ where: { jobid: parentJobId }, attributes: ['jsoncontent'] });
        const count = JSON.parse(parentJson[0].jsoncontent).closetsFormCount;
        await Log.update({jsoncontent: fn('JSON_SET',col('jsoncontent'), literal("'$.closetsFormCount'"),count - 1)}, { where: { jobid: parentJobId } });
      }
      return jobDetails;
    }

    static async GetChildJobIdCount(jobId) {
      const jobDetails = await FormContent.count({ where: { jobid: { [Op.like]: jobId+'%' } } });
      return jobDetails;
    }
}

module.exports = PDFService;
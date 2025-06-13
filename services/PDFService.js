const { raw } = require("mysql2");
const db = require("../config/db");
const axios = require("axios");
const { where, Op } = require("sequelize");
require('dotenv').config();
const Log = db.log;
const FormContent = db.formContent;

class PDFService {
    static async SaveFilter(reqBody) {
        const [form, created] = await Log.upsert({ logid: reqBody.logId, jobid: reqBody.jobId, userid: reqBody.userId, jsoncontent: JSON.stringify(reqBody) });
        if(created) {
          const count = parseInt(reqBody.closetsFormCount);
          for(let i=1;i<=count;i++) {
            const response = await FormContent.create({ userid: reqBody.userId, jobid: reqBody.jobId + "-" + i });
            if(response) console.log("Form created successfully " + reqBody.jobId + "-" + i);
        }
        return form;
    }
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

    static async GetAllJobID() {
      const jobids = await Log.findAll({ attributes: ['jobid'], raw : true});
      return jobids;
    }

    static async GetJobDetailByID(jobID) {
      const jobDetails = await Log.findOne({ where: { jobid : jobID }, attributes: ['jsoncontent', 'logid'] });
      return jobDetails;
    }

    static async GetJobIDs(jobID) {
      const jobIds = await FormContent.findAll({ where: { jobid : { [Op.startsWith]: jobID } }, attributes: ['jobid']});
      return jobIds;
    }

    static async updateJobIdContent(reqBody) {
      const jobIds = await FormContent.update({  jsoncontent: JSON.stringify(reqBody) }, { where: { jobid: reqBody.jobId } });
      return jobIds;
    }

    static async CheckIfJobContentExists(jobId) {
      const results = await FormContent.findAll({ where: { jobid: { [Op.like]: jobId+'%' }, jsoncontent: null } });
      return results;
    }

    static async UpdateParentJsonContent(reqBody) {
      const results = await Log.update({  jsoncontent: JSON.stringify(reqBody) }, { where: { jobid: reqBody.jobId } });
      return results;
    }

    static async GetChildJsonContent(jobId) {
      const results = await FormContent.findAll({ where: { jobid: { [Op.like]: jobId+'%' } } });
      return results;
    }

    static async GetChildJobDetailByID(jobID) {
      const jobDetails = await FormContent.findOne({ where: { jobid : jobID } });
      return jobDetails;
    }
}

module.exports = PDFService;
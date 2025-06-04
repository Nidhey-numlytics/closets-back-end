const { raw } = require("mysql2");
const db = require("../config/db");
const axios = require("axios");
const { where, Op } = require("sequelize");
require('dotenv').config();
const Log = db.log;
const FormContent = db.formContent;

class PDFService {
    static async SaveFilter(reqBody) {
        const response = await Log.upsert({ logid: reqBody.logId, jobid: reqBody.jobId, userid: reqBody.userId, jsoncontent: JSON.stringify(reqBody) });
        return response.data;
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
      const jobDetails = await Log.findOne({ where: { jobid : jobID },attributes: ['jsoncontent', 'logid']});
      return jobDetails;
    }

    static async GetJobIDs(jobID) {
      const jobIds = await FormContent.findAll({ where: { jobid : { [Op.startsWith]: jobID } }, attributes: ['jobid']});
      return jobIds;
    }

    static async updateJobIdContent(reqBody) {
      console.log(reqBody.jobId);
      const jobIds = await FormContent.update({  jsoncontent: reqBody }, { where: { jobid: reqBody.jobId } });
      return jobIds;
    }

    static async CheckIfJobContentExists(jobId) {
      const results = await FormContent.findAll({ where: { jobid: { [Op.like]: jobId+'%' }, jsoncontent: null } });
      return results;
    }
}

module.exports = PDFService;
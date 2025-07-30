const { raw } = require("mysql2");
const db = require("../config/db");
const axios = require("axios");
const { where, Op, fn, col, literal } = require("sequelize");
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
      }
      return form;
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
      const jobDetails = await Log.findOne({ where: { jobid : jobID }, 
        attributes: ['jsoncontent', 'logid', 'templateid', 'submissionid', 
          [fn('JSON_UNQUOTE', fn('JSON_EXTRACT', col('webhookresponse'), literal("'$.event_type'"))), 'eventtype'],
          [fn('JSON_UNQUOTE', fn('JSON_EXTRACT', col('webhookresponse'), literal("'$.data.documents[0].url'"))), 'document_url']
        ] });
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

    static async UpdateSubmissionID(submissionId, templateId, jobId) {
      const results = await Log.update({ submissionid: submissionId, templateid: templateId }, { where: { jobid: jobId } });
      return results;
    }

    static async UpdateWebHookResponse(webHookResponse) {
      const submissionId = webHookResponse.data.submitters[0].submission_id;
      const templateId = webHookResponse.data.template.id;
      const results = await Log.update({ webhookresponse: JSON.stringify(webHookResponse) }, { where: { templateid: templateId, submissionid: submissionId } });
      return results;
    }
}

module.exports = PDFService;
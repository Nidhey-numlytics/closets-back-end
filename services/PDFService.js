const db = require("../config/db");
require('dotenv').config();
const Log = db.log;

class PDFService {
  static async SaveFilter(reqBody) {
    const response = await Log.upsert({
      logid: reqBody.logId,
      jobid: reqBody.jobId,
      userid: reqBody.userId,
      jsoncontent: JSON.stringify(reqBody),
    });
    return response.data;
  }

  static async GetAllJobID() {
    const jobids = await Log.findAll({ attributes: ["jobid"], raw: true });
    return jobids;
  }

  static async GetJobDetailByID(jobID) {
    const jobDetails = await Log.findOne({
      where: { jobid: jobID },
      attributes: ["jsoncontent", "logid"],
    });
    return jobDetails;
  }
}

module.exports = PDFService;
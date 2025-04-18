const db = require("../config/db");
const axios = require("axios");
require('dotenv').config();
const Log = db.log;

class PDFService {
    static async SaveFilter(reqBody) {
        const response = await Log.create({ jobid: reqBody.jobId, userid: reqBody.userId, jsoncontent: JSON.stringify(reqBody) });
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
}

module.exports = PDFService;
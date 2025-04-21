const express = require('express');
const GeneratePDFController = require('../controllers/GeneratePDFController');

const routes = express.Router();


/** POST: http://localhost:3001/api/savefilter
 * @param : {
  "jobId" : "example123",
  "clientName": "example123"
}
*/
routes.post('/savefilter', (req, res) => {
    GeneratePDFController.SaveFilter(req,res);
})

/** POST: http://localhost:3001/api/uploadtodocuseal
 * @param : {
}
*/
routes.post('/uploadtodocuseal', (req, res) => {
  GeneratePDFController.UploadTemplateToDocuSeal(req,res);
});

/** POST: http://localhost:3001/api/sendsignrequest
 * @param : {
}
*/
routes.post('/sendsignrequest', (req, res) => {
  GeneratePDFController.SendRequestForSignDocument(req,res);
})

module.exports = routes;
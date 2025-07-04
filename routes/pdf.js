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
});

/** Get: http://localhost:3001/api/getalljobid
 * @param : {
}
*/
routes.get('/getalljobid', (req, res) => {
  GeneratePDFController.GetAllJobId(req,res);
});

/** Get: http://localhost:3001/api/getjobdetailbyid
 * @param : {
}
*/
routes.get('/getjobdetailbyid', (req, res) => {
  GeneratePDFController.GetJobDetailById(req,res);
});

/** Get: http://localhost:3001/api/getjobids
 * @param : {
}
*/
routes.get('/getjobids', (req, res) => {
  GeneratePDFController.GetJobIds(req,res);
});

/** POST: http://localhost:3001/api/updatejobidcontent
 * @param : {
  "jobId" : "example123",
  "clientName": "example123"
}
*/
routes.post('/updatejobidcontent', (req, res) => {
    GeneratePDFController.UpdateJobIdContent(req,res);
});

/** Get: http://localhost:3001/api/getjobids
 * @param : {
}
*/
routes.get('/checkjobcontent', (req, res) => {
  GeneratePDFController.CheckIfJobContentExists(req,res);
});

/** Post: http://localhost:3001/api/updateparentjson
 * @param : {
}
*/
routes.post('/updateparentjson', (req, res) => {
  GeneratePDFController.UpdateParentJsonContent(req,res);
});

/** Get: http://localhost:3001/api/getchildjson
 * @param : {
}
*/
routes.get('/getchildjson', (req, res) => {
  GeneratePDFController.GetChildJsonContent(req,res);
});

/** Get: http://localhost:3001/api/getchildjobdetailbyid
 * @param : {
}
*/
routes.get('/getchildjobdetailbyid', (req, res) => {
  GeneratePDFController.GetChildJobDetailById(req,res);
});


/** Get: http://localhost:3001/api/deletechildjobid
 * @param : {
}
*/
routes.get('/deletechildjobid', (req, res) => {
  GeneratePDFController.DeleteChildJobID(req,res);
});



module.exports = routes;
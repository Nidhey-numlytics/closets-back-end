const DocuSealService = require('../services/DocuSealService');
const PDFService = require('../services/PDFService');

class DocuSealController {
    static async UploadTemplateToDocuSeal(req,res) {
        const docBody = req.body;
        const result = await DocuSealService.UploadTemplateToDocuSeal(docBody);
        res.send(result.data);
    }

    static async SendRequestForSignDocument(req,res) {
        const docBody = req.body.signRequest;
        const result = await DocuSealService.SendRequestForSignDocument(docBody);
        if(result) {
            const templateId = docBody.template_id;
            const jobId = req.body.jobId;
            const submissionID = result.data[0].submission_id;
            await PDFService.UpdateSubmissionID(submissionID, templateId, jobId);
        }
        res.send(safeStringify(result));
    }

    static async UpdateTemplateToDocuSeal(req,res) {
        const docBody = req.body;
        const result = await DocuSealService.UpdateTemplate(docBody);
        res.send(result.data);
    }

}

function safeStringify(obj, space = 2) {
    const seen = new WeakSet();
    return JSON.stringify(obj, function (key, value) {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) return "[Circular]";
        seen.add(value);
      }
      if (typeof value === "function") return "[Function]";
      return value;
    }, space);
}

module.exports = DocuSealController;
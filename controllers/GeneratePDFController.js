const PDFService = require('../services/PDFService');

class GeneratePDFController {
    /*
    static async GeneratePDF(req,res) {
        const htmlPDF = new PuppeteerHTMLPDF();

        htmlPDF.setOptions({ format: "A4", headless: true });
        const templateHtml = await htmlPDF.readFile(path.join(process.cwd() + "/views/agreement.html"), "utf8");

        var template = handlebars.compile(templateHtml);
        const data = {
            job_id: req.body.jobId,
            client_name: req.body.clientName
        };
        var html = template(data);
        // try {
        //     const pdfBuffer = await htmlPDF.create(html);
        //     const filePath = `./../temp/sample.pdf`;
        //     const file = await htmlPDF.writeFile(pdfBuffer, filePath);
        //     //res.send("https://research.google.com/pubs/archive/44678.pdf");
            

        //   } catch (error) {
        //     console.log("PuppeteerHTMLPDF error", error);
        //   }
        //res.send("https://research.google.com/pubs/archive/44678.pdf");
        return res.send(html);
      
    }
    */

    static async SaveFilter(req,res) {
        const body = req.body;
        const result = await PDFService.SaveFilter(body);
        res.send(result);
    }

    static async UploadTemplateToDocuSeal(req,res) {
        const docBody = req.body;
        const result = await PDFService.UploadTemplateToDocuSeal(docBody);
        res.send(result.data);
    }

    static async SendRequestForSignDocument(req,res) {
        const docBody = req.body;
        const result = await PDFService.SendRequestForSignDocument(docBody);
        res.send(safeStringify(result));
    }

    static async GetAllJobId(req, res) {
        const userId = req.query.userid;
        const role = req.query.role;
        const result = await PDFService.GetAllJobID(userId, role);
        res.send(result);
    }

    static async GetJobDetailById(req, res) {
        const result = await PDFService.GetJobDetailByID(req.query.jobid);
        res.send(result);
    }

    static async GetJobIds(req, res) {
        const result = await PDFService.GetJobIDs(req.query.jobid);
        res.send(result);
    }

    static async UpdateJobIdContent(req, res) {
        const result = await PDFService.updateJobIdContent(req.body);
        res.send(result);
    }

    static async CheckIfJobContentExists(req, res) {
        const result = await PDFService.CheckIfJobContentExists(req.query.jobid);
        res.send(result);
    }

    static async UpdateParentJsonContent(req, res) {
        const result = await PDFService.UpdateParentJsonContent(req.body);
        res.send(result);
    }

    static async GetChildJsonContent(req, res) {
        const result = await PDFService.GetChildJsonContent(req.query.jobid);
        res.send(result);
    }

    static async GetChildJobDetailById(req, res) {
        const result = await PDFService.GetChildJobDetailByID(req.query.jobid);
        res.send(result);
    }

    static async DeleteChildJobID(req, res) {
        const result = await PDFService.DeleteChildJobID(req.query.jobid);
        res.send(result);
    }

        static async GetDesignerNameByJobId(req, res) {
    try {
        const { jobid } = req.query;
        const designerName = await PDFService.GetDesignerNameByJobId(jobid);
        res.json({ designername: designerName });
    } catch (err) {
        console.error("Error fetching designer name:", err.message);
        res.status(500).json({ error: err.message });
    }
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

module.exports = GeneratePDFController
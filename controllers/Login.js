const LoginService = require('../services/LoginService');
class Login {
    static async SignIn(req, res) {
        const email = req.body.email;
        const pass = req.body.pass;

        const isUserExists = await LoginService.signIn(email,pass);
        return res.send(isUserExists);
    }

    static async PasswordEncrypt(req,res) {
        const pass = req.body.pass;
        const result = await LoginService.PasswordEncrypt(pass);
        return res.send(result);
    }
    static async createUser(req,res) {
        const email = req.body.email;
        const pass = req.body.pass;
        const result = await LoginService.CreateUser(email, pass);
        res.send(result);
    }

    static async BulkInsert(req,res) {
        const emails = req.body.emails;
        const result = await LoginService.CreateMultipleUser(emails);
        res.send(result);
    }

    static async ResetPassword(req,res) {
        const pass = req.body.pass;
        const userId = req.body.userid;
        const result = await LoginService.ResetPasword(userId,pass);
        res.send(result);
    }

}

module.exports = Login;
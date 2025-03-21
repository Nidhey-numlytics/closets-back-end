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

}

module.exports = Login;
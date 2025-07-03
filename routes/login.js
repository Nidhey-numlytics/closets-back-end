const express = require('express');
const Login = require('../controllers/Login');

const routes = express.Router();

/** POST: http://localhost:3001/api/signin 
 * @body : {
  "email" : "example123",
  "password": "example123"
}
*/
routes.post('/signin',(req,res) => {
    Login.SignIn(req, res);
});

/** POST: http://localhost:3001/api/create
 * @body : {
  "email" : "example123",
  "pass": "example123"
}
*/
routes.post('/createuser', (req, res) =>{
    Login.createUser(req,res);
});

/** POST: http://localhost:3001/api/encryptpassword
 * @body : {
  "pass" : "example123",
}
*/
routes.post('/encryptpass', (req, res) => {
    Login.PassowordEncrypt(req,res);
});

/** POST: http://localhost:3001/api/bulkuser
 * @body : {
  "emails" : ["example123", "example345"]
}
*/
routes.post('/bulkuser', (req, res) => {
  Login.BulkInsert(req,res);
});

/** POST: http://localhost:3001/api/resetpassword
 * @body : {
  "userid" : "1",
  "pass": "example123"
}
*/
routes.post('/resetpassword', (req, res) => {
  Login.ResetPassword(req,res);
});

 /** POST: http://localhost:3001/api/bulkuser
  * @body : {
   "emails" : ["example123", "example345"]
 }
 */
 routes.post('/bulkuser', (req, res) => {
  Login.BulkInsert(req,res);
});

/** POST: http://localhost:3001/api/resetpassword
 * @body : {
  "userid" : "1",
  "pass": "example123"
}
*/
routes.post('/resetpassword', (req, res) => {
  Login.ResetPassword(req,res);
});


/** GET: http://localhost:3001/api/checkemail
 * @query : {
  "email" : "abc@xyz.com"
}
*/
routes.get('/checkemail', (req, res) => {
  Login.CheckEmailIfExistsOrNot(req,res);
});




module.exports = routes;

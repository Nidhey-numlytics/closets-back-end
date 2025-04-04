const { Logger } = require("sequelize/lib/utils/logger");
const db = require("../config/db");
const User = db.user;
const brcypt = require("bcryptjs");
require("dotenv").config();

class LoginService {
  static async signIn(email, password) {
    const user = await User.findOne({ where: { email: email } });

    if (!user || !user.password) {
      console.error("User not found or password is null");
      return false;
    }
    const encPass = await brcypt.compare(password, user.password);
    if (user != null && encPass) {
      return { userid: user.userid, email: user.email };
    } else {
      return false;
    }
  }

  static async PasswordEncrypt(password) {
    const encPass = await brcypt.hash(password, 5);
    return encPass;
  }

  static async CreateUser(email, pass) {
    try {
      const encPass = await brcypt.hash(pass, 10);
      const user = await User.create({ email: email, password: encPass });
      if (user !== null) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      Logger.warn("Unable to create a user");
      return false;
    }
  }

  static async CreateMultipleUser(emails) {
    try {
      //const DEFAULT_PASS = process.env.DEFAULT_PASS;
      const encPass = await brcypt.hash("Abcd@1234", 5);
      //const emailArr = emails.split(",");
      const bulkInsert = [];
      for (let i = 0; i < emails.length; i++) {
        bulkInsert.push({
          email: emails[i],
          password: encPass,
          isnewlogin: true,
        });
      }
      const result = await User.bulkCreate(bulkInsert);
      console.log(result.length);
      if (result.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
        console.log(e);
      return false;
    }
  }

  static async ResetPasword(userId, pass) {
    try {
      const encPass = await brcypt.hash(pass, 5);
      const result = await User.update({
        password: encPass,
        where: { userid: userId },
      });

      if (result !== null) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}

module.exports = LoginService;

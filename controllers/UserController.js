const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { sendEmail } = require("../config/mailer");
const UserModel = require('../model/UserModel');
const { UserSchema } = require('../validator/UserSchema');

const captchapng = require("captchapng");
var CAPTCHA_NUM = null;

const nodeCache = require("node-cache");
const myCache = new nodeCache({ stdTTL: 2 * 60 * 60, checkperiod: 5 * 60 })

var Kavenegar = require('kavenegar');
var api = Kavenegar.KavenegarApi({
  apikey: '74514A506C33626E584D4B6F4862794A34445764525549616574576F547342615758486E31374F4D6472633D'
});





class UserController {

  async register(req, res) {
    try {
      await UserSchema.validate(req.body)
      const { fullname, email, password } = req.body

      let userEmail = await UserModel.findOne({ email });
      if (userEmail)
        return res.status(400).send(" ایمیل موجود هست")

      let userFullname = await UserModel.findOne({ fullname });
      if (userFullname)
        return res.status(400).send(" نام کاربری موجود هست")

      const user = await UserModel.create({ fullname, email, password });

      // sendEmail(email, fullname, "خوش آمدی به وبلاگ ما", "خیلی خوشحالیم که به جمع ما ملحق شدی");
      res.status(201).send({ user })
    } catch (err) {
      res.status(400).send(err)
      console.log(err)
    }
  }


  async login(req, res) {

    try {
      let user = await UserModel.findOne({ email: req.body.email });
      if (!user) return res.status(400).send('کاربری با این ایمیل یافت نشد');
      const pass = await bcrypt.compare(req.body.password, user.password);
      if (!pass) return res.status(400).send('کاربری با این پسورد یافت نشد');
      const users = {
        isAdmin: user.isAdmin,
        userId: user._id.toString(),
        email: user.email,
        fullname: user.fullname,
      }
      const token = await jwt.sign(users, "secret", { expiresIn: req.body.remember });
      console.log(CAPTCHA_NUM);
      console.log("req.body.captcha", req.body.captcha);
      if (parseInt(req.body.captcha) == CAPTCHA_NUM)
        res.header(token).json({ token, userId: user._id.toString(), message: 'موفق آمیز بود' });
    } catch (err) {
      res.status(400).send(err)
      console.log(err)
    }
  }


  async forgetPassword(req, res) {
    try {
      const { email } = req.body;
      console.log(email);
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "ایمیل موجود نیست" })
      }
      const resetLink = `http://192.168.42.34/reset-password/${user._id}`;
      // sendEmail(user.email, user.fullname, "فراموشی رمز عبور", `جهت تغییر رمز عبور فعلی رو لینک زیر کلیک کنید
      // <a href="${resetLink}">لینک تغییر رمز عبور</a>`);
      res.status(200).send("good");
    }
    catch (err) {
      console.log(err)
      res.status(400).send("error")
    }
  }



  async resetPassword(req, res) {
    try {
      const { password, confirmPassword } = req.body;
      if (password === confirmPassword) {
        const user = await UserModel.findOne({ _id: req.params.id });
        if (!user) return res.ststus(400).send("/404")
        user.password = password;
        await user.save();
        console.log("پسورد شما با موفقیت بروزرسانی شد")
        res.status(200).send("موفقیت بروزرسانی شد");
      }
    }
    catch (err) {
      console.log(err)
      res.status(400).send("error")
    }
  }


  async captcha(req, res) {
    try {
      CAPTCHA_NUM = req.params.id
      var p = new captchapng(80, 30, CAPTCHA_NUM);
      p.color(0, 0, 0, 0);
      p.color(80, 80, 80, 255);
      var img = p.getBase64();
      var imgbase64 = Buffer.from(img, 'base64');
      res.send(imgbase64);
    }
    catch (err) {
      console.log(err)
      res.status(400).send("error")
    }
  }







  async sendcode(req, res) {
    try {
      console.log(req.body.phone);
      const num = Math.floor(Math.random() * 90000 + 10000)
      myCache.set("code", num)

      api.Send({
        message: `ارسال کد از رستوران 
        Code: ${num}`,
        sender: "10008663",
        receptor: req.body.phone, //"09123456789,09387891011, 09367891239"
      },
        function (response, status) {
          console.log(response);
          console.log(status);
          res.status(status).send(response)
        });

    }
    catch (err) {
      console.log(err)
      res.status(400).send("error")
    }
  }





  async verifycode(req, res) {
    try {
      let myCode = req.body.code;
      let myCd = myCache.get("code");
      console.log(myCode, myCd);

      if (myCode != myCd) res.status(400).send("اشتباه")
      else res.status(200).send('ورود موفق')
    }
    catch (err) { console.log(err); }

  }





  // async verifycode(req, res) {
  //   try {
  //     api.VerifyLookup({
  //       receptor: req.body.phone,
  //       token: req.body.code,
  //       template: "registerverify"
  //     },
  //       function (response, status) {
  //         console.log(response);
  //         console.log(status);
  //         res.status(status).send(response)
  //       });
  //   } catch (err) { console.log(err); }

  // }


}


module.exports = new UserController();

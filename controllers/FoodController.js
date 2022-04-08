var fs = require('fs');
const sharp = require("sharp");
const shortId = require("shortid");
const appRoot = require("app-root-path");
const { FoodModel, ChildFoodModel } = require('../model/FoodModel');
const { FoodSchema, ChildFoodSchema } = require('../validator/FoodSchema');
const nodeGeocoder = require('node-geocoder');
const PaymentModel = require('../model/PaymentModel');
const ZarinpalCheckout = require('zarinpal-checkout');
const zarinpal = ZarinpalCheckout.create('00000000-0000-0000-0000-000000000000', true);






class FoodController {


  async createFood(req, res) {
    try {
      await FoodSchema.validate(req.body)
      const image = req.files ? req.files.imageUrl : {};
      const fileName = `${shortId.generate()}_${image.name}`;
      await sharp(image.data).toFile(`${appRoot}/public/upload/${fileName}`)
      const food = await new FoodModel({ title: req.body.title, imageUrl: fileName }).save();
      res.status(200).send({ food })
    } catch (err) {

      console.log(err);
    }
  }







  async getFoods(req, res) {
    try {
      let food = await FoodModel.find()
      res.status(200).send(food);
    } catch (err) {

    }
  }







  async editFood(req, res) {
    try {
      const food = await FoodModel.findById(req.params.id);
      const { title } = req.body

      let fileName = ""
      if (req.files.imageUrl) {
        const image = req.files.imageUrl;
        fileName = `${shortId.generate()}_${image.name}`;
        await sharp(image.data).toFile(`${appRoot}/public/upload/${fileName}`)
        fs.unlinkSync(`${appRoot}/public/upload/${food.imageUrl}`)
      } else fileName = food.imageUrl

      food.title = title;
      food.imageUrl = fileName;
      await food.save();
      res.status(200).json({ food })
    }
    catch (err) { console.log(err) }
  }




  async deleteFood(req, res) {
    try {
      const food = await FoodModel.findById(req.params.id);
      const del = await FoodModel.findByIdAndRemove(req.params.id)
      fs.unlinkSync(`${appRoot}/public/upload/${food.imageUrl}`)
      res.status(200).send({ food });
    } catch (err) {

    }
  }




  // ! ChildFood
  // ! ChildFood




  async createChildFood(req, res) {
    try {
      await ChildFoodSchema.validate(req.body)
      const food = await FoodModel.findById({ _id: req.params.id })
      const { title, price, info } = req.body
      const image = req.files ? req.files.imageUrl : {};
      const fileName = `${shortId.generate()}_${image.name}`;
      await sharp(image.data).toFile(`${appRoot}/public/upload/${fileName}`)
      food.childFood.push({ title, price, info, imageUrl: fileName, commentId: req.params.id });
      food.save()
      res.status(200).send(food.childFood)
    } catch (err) {

      console.log(err);
    }
  }



  async getAllChildFood(req, res) {
    try {
      const food = await FoodModel.findById({ _id: req.params.id })
      const child = food.childFood
      res.status(200).send({ child })
    } catch (err) {

      console.log(err);
    }
  }



  async getSingleChildFood(req, res) {
    try {
      const food = await FoodModel.findById({ _id: req.params.id })
      const child = food.childFood.find((f) => f._id == req.query.id)
      res.status(200).send({ child })
    } catch (err) {

      console.log(err);
    }
  }





  async editChildFood(req, res) {
    try {
      const food = await FoodModel.findById({ _id: req.params.id })
      const child = food.childFood.find((f) => f._id == req.query.id)
      const { title, price, info } = req.body
      let fileName = ""
      if (req.files.imageUrl) {
        const image = req.files.imageUrl;
        fileName = `${shortId.generate()}_${image.name}`;
        await sharp(image.data).toFile(`${appRoot}/public/upload/${fileName}`)
        fs.unlinkSync(`${appRoot}/public/upload/${child.imageUrl}`)
      } else fileName = child.imageUrl
      child.title = title;
      child.price = price;
      child.info = info;
      child.imageUrl = fileName;
      await food.save();
      res.status(200).json({ childFood: child })
    }
    catch (err) { console.log(err) }
  }




  async deleteChildFood(req, res) {
    try {
      const food = await FoodModel.findById({ _id: req.params.id })
      const child = food.childFood.find((f) => f._id == req.query.id)
      const delChild = food.childFood.filter((f) => f._id != req.query.id)
      food.childFood = delChild
      food.save()
      fs.unlinkSync(`${appRoot}/public/upload/${child.imageUrl}`)
      res.status(200).send({ childFood });
    } catch (err) {

    }
  }




  async createCommentChildFood(req, res) {
    try {
      const { fullname, email, message } = req.body;
      const food = await FoodModel.findById({ _id: req.params.id })
      const child = food.childFood.find((f) => f._id == req.query.id)
      child.comment.push({ fullname, email, message });
      food.save()
      res.status(200).send({ ...child.comment })
    } catch (err) {

    }
  }




  async getCommentChildFood(req, res) {
    try {
      const food = await FoodModel.findById({ _id: req.params.id })
      const child = food.childFood.find((f) => f._id == req.query.id)
      res.status(200).json({ comment: child.comment })
    } catch (err) {

    }
  }





  // ! ChildFood
  // ! ChildFood



  async confirmPayment(req, res) {
    try {

      const response = await zarinpal.PaymentRequest({
        Amount: req.query.allprice,
        CallbackURL: 'http://192.168.42.34/verifyPayment',
        Description: 'زستوران',
        Email: req.user.email,
      });
      await new PaymentModel({
        user: req.user._id,
        fullname: req.user.fullname,
        email: req.user.email,
        title: 'زستوران',
        price: req.query.allprice,
        paymentCode: response.authority
      }).save();
      res.status(200).send(response.url);
    }
    catch (err) {
      console.log(err)
      res.status(400).send("error")
    }
  }




  async verifyPayment(req, res) {
    try {
      const paymentCode = req.query.Authority;
      const status = req.query.Status;
      const payment = await PaymentModel.findOne({ paymentCode });
      const response = await zarinpal.PaymentVerification({
        Amount: payment.price, Authority: paymentCode
      });
      if (status === "OK") {
        payment.refId = response.RefID;
        payment.success = true;
        await payment.save();
        res.render("./paymant", {
          pageTitle: "Pardakht",
          path: "/Pardakht",
          fullname: payment.fullname,
          email: payment.email,
          title: payment.title,
          price: payment.price,
          refId: response.RefID,
          paymentCode: paymentCode
        })
      } else {
        res.send(`
        <div style="padding:3px 0 2rem;width:30%;border:1px solid silver;margin:5rem auto;text-align:center">
         <h1 style="margin:1rem 0 2rem;" >خطا پرداخت انجام نشد</h1>
         <button onclick="window.history.back()" style=" padding:6px; border:1px solid silver; border-radius:3%;background:yellow; text-decoration:none;">برگشت به صفحه اصلی</button>
         </div>
          `)
      }
    }
    catch (err) {
      console.log(err)
      res.status(400).send("error")
    }
  }




  async notification(req, res) {
    try {
      const n = {
        channelId: "1",
        title: 'title',
        message: "hnhnhn",
        date: new Date(Date.now() + 1 * 1),
        allowWhileIdle: false,
      }

      res.send(n)
    }
    catch (er) {
      console.log(er)
      res.status(400).send("error")
    }

  }




  async reverse(req, res) {
    let options = { provider: 'openstreetmap' };
    let geoCoder = nodeGeocoder(options);

    geoCoder.reverse({ lat: req.body.latitude, lon: req.body.longitude })
      .then((re) => {
        res.send(re)
        console.log(re)
      })
      .catch((err) => console.log(err));
  }




  async geocode(req, res) {
    let options = { provider: 'openstreetmap' };
    let geoCoder = nodeGeocoder(options);

    geoCoder.geocode(req.body.loc)
      .then((re) => {
        res.send(re)
        console.log('re')
      })
      .catch((err) => console.log(err));
  }




}

exports.FoodController = new FoodController()

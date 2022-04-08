const mongoose = require('mongoose');
const bcrypt = require('bcrypt');



const UserModel = new mongoose.Schema({
  fullname: { type: String, required: true , trim: true },
  email: { type: String, required: true, unique: true, },
  password: { type: String, required: true, minlength: 4, maxlength: 255 },
  admin: { type: Boolean, default: true }
});



UserModel.pre("save",  function (next) {
if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();

  })});


module.exports = mongoose.model("User", UserModel);



const mongoose = require('mongoose');




const Payment = new mongoose.Schema({
  user: { type : mongoose.Schema.Types.ObjectId, ref : "user" },
  email : String ,
  fullname: String,
  price : Number,
  title: String,
  paymentCode : String,
  refId : String,
  success: { type: Boolean, default: false }
});



module.exports = mongoose.model('payment', Payment);;


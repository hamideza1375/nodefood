const mongoose = require('mongoose');


const CommenteModel = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: "food" }

});



const ChildFoodModel = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    info: { type: String, required: true },
    imageUrl: { type: String, required: true },
    num: { type: Number, default:0 },
    total: { type: Number, default:0 },
    comment: [CommenteModel],
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: "food" }

});




const FoodModel = new mongoose.Schema({
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    num: { type: Number },
    price: { type: Number, default:0 },
    childFood: [ChildFoodModel],
});


exports.FoodModel = mongoose.model("Food", FoodModel);

















// const DrinkModel = new mongoose.Schema({
//     title: { type: String, required: true },
//     price: { type: Number, required: true },
//     info: { type: String, required: true },
//     imageUrl: { type: String, required: true },
//     num: { type: Number },
//     comment: [CommenteModel],
//     commentId: { type: mongoose.Schema.Types.ObjectId, ref: "food3" }

// });

// exports.DrinkModel = mongoose.model("drink", DrinkModel);




// const SandwichModel = new mongoose.Schema({
//     title: { type: String, required: true },
//     price: { type: Number, required: true },
//     info: { type: String, required: true },
//     imageUrl: { type: String, required: true },
//     num: { type: Number },
//     comment: [CommenteModel],
//     commentId: { type: mongoose.Schema.Types.ObjectId, ref: "food2" }

// });

// exports.SandwichModel = mongoose.model("sandwich", SandwichModel);
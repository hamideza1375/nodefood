const router = require('express').Router();
const {FoodController: Food} = require('../controllers/FoodController');
const Auth = require('../middleware/Auth');

// getallchildfood 

// getpayplus delpayplus plus, minus, payplus 


// Food 
router.post('/createfood', Food.createFood);
router.get('/getfoods', Food.getFoods);
router.put('/editfood/:id', Food.editFood);
router.delete('/deletefood/:id', Food.deleteFood);
// Food
// Piza
router.post('/createchildfood/:id', Food.createChildFood);
router.get('/getallchildfood/:id', Food.getAllChildFood);
router.get('/getsinglechildfood/:id', Food.getSingleChildFood);
router.put('/editchildfood/:id', Food.editChildFood);
router.delete('/deletechildfood/:id', Food.deleteChildFood);
router.post('/createcommentchildfood/:id', Food.createCommentChildFood);
router.get('/getcommentchildfood/:id', Food.getCommentChildFood);
// Piza
// Payment
router.get('/confirmpayment', Auth, Food.confirmPayment);
router.get('/verifypayment', Food.verifyPayment);
// Payment
// Geocode
router.post('/reverse', Food.reverse);
router.post('/geocode', Food.geocode);
// Geocode
// notification
router.get('/notification', Food.notification);




module.exports = router















/*
// Sandwich
router.post('/createsandwich/:id', Food.createSandwich);
router.get('/getallsandwich', Food.getAllSandwich);
router.get('/getsinglesandwich/:id', Food.getSingleSandwich);
router.put('/editsandwich/:id', Food.editSandwich);
router.delete('/deletesandwich/:id', Food.deleteSandwich);
router.post('/createcommentsandwich/:id', Food.createCommentSandwich);
router.get('/getcommentsandwich/:id', Food.getCommentSandwich);
// Sandwich
// Drink
router.post('/createdrink/:id', Food.createDrink);
router.get('/getalldrink', Food.getAllDrink);
router.get('/getsingledrink/:id', Food.getSingleDrink);
router.put('/editdrink/:id', Food.editDrink);
router.delete('/deletedrink/:id', Food.deleteDrink);
router.post('/createcommentdrink/:id', Food.createCommentDrink);
router.get('/getcommentdrink/:id', Food.getCommentDrink);
// Drink
*/
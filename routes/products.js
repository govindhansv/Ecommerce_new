const express = require('express');
const router = express.Router();
var fun = require('../functions')
var db = require('../connection')


const requiredlogin = (req,res,next)=>{
      if (req.session.user) {
          next()
      }else{
          res.redirect('/users/login')
      }
    }

router.get('/', async (req, res) => {
    // let product = await db.get().collection('products').find({}).toArray()
    let pro = [
        {
        name: "google",
        price: 545
    },
        {
        name: "google2",
        price: 545
    },
        {
        name: "google3",
        price: 545
    },
        {
        name: "google",
        price: 545
    },
        {
        name: "google2",
        price: 545
    },
        {
        name: "google3",
        price: 545
    },
        {
        name: "google",
        price: 545
    },
        {
        name: "google2",
        price: 545
    },
        {
        name: "google3",
        price: 545
    },
]
    res.render('index', { pro });
})

router.get('/add-product', async (req, res) => {
    res.render('add-product.hbs');
})

router.post('/add-product', (req, res) => {
    let product = req.body
    console.log(product);
    db.get().collection('products').insertOne(product)
    res.render('view-product', { product });
})


router.get('/cart',requiredlogin, async (req, res) => {

    var cart = await db.get().collection('carts').find({ "id": req.session.user._id }).toArray()
    console.log(cart);
    res.render('cart',{cart});
})

router.get('/address', requiredlogin,async (req, res) => {
    var cart = await db.get().collection('carts').find({ "id": req.session.user._id }).toArray()
    var price = 0;
    cart.forEach(element => {
        console.log(element);
        return price = price + element.price
    });
    console.log(price);
    res.render('adress',price);
})

router.get('/checkout',requiredlogin, async (req, res) => {
    var cart = await db.get().collection('carts').find({ "id": req.session.user._id }).toArray()
    var price = 0;
    cart.forEach(element => {
        console.log(element);
        return price = price + element.price
    });
    console.log(price);
    res.render('buy',price);
})

router.post('/add-to-cart',requiredlogin, async (req, res, next) => {
    //var usercart = await db.get().collection('carts').find({ "id": req.session.user._id }).toArray()

    let cart = req.body
    cart.id = req.session.user._id
    console.log(cart);
    // duplicate(usercart,cart)
    db.get().collection('carts').insertOne(cart)
    next();
})

router.delete('/:id', requiredlogin, async (req, res) => {
    db.get().collection('carts').removeOne({ _id: req.params.id }).then((response) => {
        res.redirect('/products/');
    })
})



module.exports = router;
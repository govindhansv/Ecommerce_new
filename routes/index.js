var express = require('express');
var router = express.Router();
var db = require('../connection')
var ObjectId = require('mongodb').ObjectId

const requiredlogin = (req,res,next)=>{
  if (req.session.user) {
      next()
  }else{
      res.redirect('/users/login')
  }
}


/* GET home page. */
router.post('/search', async function (req, res) {
  let query = req.body.query
  db.get().collection('products').createIndex( { name: "text", des: "text" } )
  let products = await db.get().collection('products').find( { $text: { $search: query } }).toArray()
  res.render('index',{products})
});

router.get('/adress', async function (req, res) {
  let id = req.session.user
  let user = await db.get().collection('users').findOne({ _id: ObjectId(id) })
 
  res.render('adress', {user });
});
router.get('/done', async function (req, res) {
  let id = req.session.user
  let user = await db.get().collection('users').findOne({ _id: ObjectId(id) })
 
  res.render('done', {user });
});
router.get('/view-product', async function (req, res) {
  let id = req.session.user
  let user = await db.get().collection('users').findOne({ _id: ObjectId(id) })
 
  res.render('view-product', {user });
});

router.get('/buy', async function (req, res) {
  let id = req.session.user
  let user = await db.get().collection('users').findOne({ _id: ObjectId(id) })
 
  res.render('buy', {user });
});

router.get('/', async function (req, res) {
  let id = req.session.user
  let user = await db.get().collection('users').findOne({ _id: ObjectId(id) })
  let products = await db.get().collection('products').find().sort({title:1}).toArray()
  // let newblog = blogs[0]
  if (user) {
    res.render('index', { products, user });
  }
  res.render('index', { products });
});


router.post('/upload', function (req, res) {  
  let data = req.body
  console.log(data);
  db.get().collection('images').insertOne(data).then((response) => {
    let id = response.insertedId
    let userid = req.body.userid
    let image = req.files.image
    image.mv('./public/images/' + userid + '.jpg', (err, done) => {
      if (!err) {
        res.redirect('/users/myprofile/')
      } else {
        console.log(err);
      }
    })
  })



});

// router.get('/admin', async function (req, res) {
//   let blogs = await db.get().collection('blogs').find().toArray()
//   let users = await db.get().collection('users').find().toArray()
//   res.render('admin', { blogs, users });
// });

router.get('/delete/:id', (req, res) => {
  id = req.params.id
  db.get().collection('blogs').deleteOne({ _id: ObjectId(id) })
  res.redirect('/admin')
})

router.get('/deleteuser/:id', (req, res) => {
  id = req.params.id
  db.get().collection('users').deleteOne({ _id: ObjectId(id) })
  res.redirect('/admin')
})

router.get('/section/:section', async function (req, res) {
  var section = req.params.section
  if (req.session.loggedIN) {
    let id = req.session.user
    let user = await db.get().collection('users').findOne({ _id: ObjectId(id) })
    let blogs = await db.get().collection('blogs').find({ "section": section }).toArray()
    let newblog = blogs[0]
    res.render('index', { blogs, user,newblog });
  } else {
    let blogs = await db.get().collection('blogs').find({ "section": section }).toArray()
    let newblog = blogs[0]
    res.render('index', { blogs,newblog });
  }

});



module.exports = router;

var express = require('express');
var router = express.Router();
var db = require('../connection')
var ObjectId = require('mongodb').ObjectId

const requiredAdmin = (req, res, next) => {
    if (req.session.admin) {
        next()
    } else {
        res.redirect('/')
    }
}


router.get('/',requiredAdmin, async function (req, res) {
    let users = await db.get().collection('users').find({}).toArray();
    let products = await db.get().collection('products').find({}).toArray();

    res.render('adminpanel', { users,products });
});

router.delete('/:id', requiredAdmin, async (req, res) => {
    db.get().collection('products').removeOne({ _id: req.params.id }).then((response) => {
        res.redirect('/admin/');
    })
})


module.exports = router;

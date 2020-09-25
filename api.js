//modules
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

var app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())

// variable global
const saltRounds = 10;
const yourPassword = "someRandomPasswordHere";

var db = require('./db');
// app.get('/db', function(req,res){
//     res.send('Allo')

// })

const connection = require("./db")
connection.connect()

// Ajouter un utilisateur ==> /sign-up
app.post('/sing-up', function (req, res) {
    // hash password
    bcrypt.genSalt(saltRounds, (err, salt) => {
        console.log(salt)
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            // requete mysql
            var sql = `INSERT INTO mydb (name, email, password) VALUES ('${req.body.name}','${req.body.email}','${hash}')`
            db.query(sql, function (err, result) {
                if (err) res.send(err)
                else res.send(result)
            })
        })
    })
})

// Controle si l'utilisateur est enregistré ==> /Sign-in
app.post('/sing-in', function (req, res) {
    // requete
    var sql = `SELECT * FROM mydb where email ="${req.body.email}"`
    db.query(sql, function (err, result) {
        console.log(result)
        if (err) console.log(err)
        // compare les password
        bcrypt.compare(req.body.password, result[0].password, function (err, response) {
            // genere le token
            var token = jwt.sign({ id: result[0].id }, 'aj_kneun34890shyéééççunhs8891111');
            if (response) {
                res.send(token)
            }
            else {
                res.status(500).send("PAS CONECTE")
            }
        });
    })
})

app.listen(3000);

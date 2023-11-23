// importing packages
const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const path = require('path');

//declare static path
let staticPath = path.join(__dirname, "public");

//intializing express.js
const app = express();

//middlewares
app.use(express.static(staticPath));

app.listen(3000, () => {
    console.log('listening on port 3000.......');
})


//routes
//home route
app.get("/", (req, res) => {
      res.sendFile(path.join(staticPath, "index.html"));
})

//signup route
app.get('/signup', (req, res) => {
      res.sendFile(path.join(staticPath, "signup.html"));
})

// 404 route
app.get('/404', (req, res) => {
      res.sendFile(path.join(staticPath, "404.html"));
})
  
  app.use((req, res) => {
      res.redirect('/404');
})


app.use(express.json());

app.post('/signup', (req, res) => {
      let { name, email, password, number, tac, notification } = req.body;
  
      // form validations
      if(name.length < 3){
          return res.json({'alert': 'name must be 3 letters long'});
      } else if(!email.length){
          return res.json({'alert': 'enter your email'});
      } else if(password.length < 8){
          return res.json({'alert': 'password should be 8 letters long'});
      } else if(!number.length){
          return res.json({'alert': 'enter your phone number'});
      } else if(!Number(number) || number.length < 10){
          return res.json({'alert': 'invalid number, please enter valid one'});
      } else if(!tac){
          return res.json({'alert': 'you must agree to our terms and conditions'});
      }       
})

const processData = (data) => {
      loader.style.display = null;
      if(data.alert){
          showAlert(data.alert);
      } else if(data.name){
            // create authToken
            data.authToken = generateToken(data.email);
            sessionStorage.user = JSON.stringify(data);
            location.replace('/');
      }
  }

  // firebase admin setup
let serviceAccount = require("path of key file");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

// store user in db
db.collection('users').doc(email).get()
.then(user => {
    if(user.exists){
        return res.json({'alert': 'email already exists'});
    } else{
        // encrypt the password before storing it.
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                req.body.password = hash;
                db.collection('users').doc(email).set(req.body)
                .then(data => {
                    res.json({
                        name: req.body.name,
                        email: req.body.email,
                        seller: req.body.seller,
                    })
                })
            })
        })
    }
})

// add product
app.get('/add-product', (req, res) => {
    res.sendFile(path.join(staticPath, "addProduct.html"));
})


const aws = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

// aws parameters
const region = "ap-south-1";
const bucketName = "ecom-website-tutorial-2";
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

aws.config.update({
    region, 
    accessKeyId, 
    secretAccessKey
})

// init s3
const s3 = new aws.S3();

// generate image upload link
async function generateUrl(){
    let date = new Date();
    let id = parseInt(Math.random() * 10000000000);

    const imageName = `${id}${date.getTime()}.jpg`;

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 300, //300 ms
        ContentType: 'image/jpeg'
    })
    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
    return uploadUrl;
}

// get the upload link
app.get('/s3url', (req, res) => {
    generateUrl().then(url => res.json(url));
})



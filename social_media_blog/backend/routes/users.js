const router = require('express').Router();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
let User = require('../modules/user-schema');

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth : {
    user: "aminaisnotepic@gmail.com",
    pass: "qqgowvhftxiqcssw"
  },
  tls : {
    rejectUnauthorized: false
  }
})

async function hashPassword(password){
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}


router.route("/").get((req, res) => {
    User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post(async (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    const username = req.body.username;
    var password = req.body.password;
    password = await hashPassword(password);
    const newUser = new User({'username':username, 'email': email, 'password' : password});
    newUser.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route("/getUser").post(async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
  
    User.findOne({ username: username, email: email })
      .then((data) => {
        if (data) {
          const hashedPassword = data.password;
          if (bcrypt.compareSync(password, hashedPassword)) {
            res.json("Account found!");
          } else {
            res.json("Incorrect password");
          }
        } else {
          res.json("User not found");
        }
      })
      .catch((error) => {
        res.json("Error: " + error);
      });
  });


router.route("/login").post(async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
      .then((data) => {
          if(data){
            if (bcrypt.compareSync(password, data.password)) {
                res.json("Account found!");
              } else {
                res.json("Incorrect password");
              }
          } else{
              res.json("Account does not exist!")
          }
      })
      .catch((err) => res.json("Error: " + err));
  });

  router.route("/resetPassword").post(async (req, res) => {
    const email = req.body.email;
    const password = req.body.oldPassword;
    const newPassword = req.body.newPassword;
  
    User.findOne({email: email })
      .then((data) => {
        if (data) {
          const hashedPassword = data.password;
          if (bcrypt.compareSync(password, hashedPassword)) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(newPassword, salt);
            User.findOneAndUpdate({email: email }, { password: hash }, { new: true })
              .then(() => {
                res.json("Password updated successfully");
              })
              .catch((error) => {
                res.json("Error updating password: " + error);
              });
          } else {
            res.json("Incorrect password");
          }
        } else {
          res.json("User not found");
        }
      })
      .catch((error) => {
        res.json("Error: " + error);
      });
  });

  router.route("/forgotPassword").post(async (req, res) => {
    const email = req.body.email;
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await hashPassword(password);
    let mailOptions = {
      from: "aminaisnotepic@gmail.com",
      to: `${email}`, 
      subject: "Forgot your password - Social Media Blog",
      text: `Hello,
      This is an email sent from the Social Media Blog. Please login to the account with this new password: ${password}`
    }
    User.findOne({email: email })
      .then((data) => {
        if (data) {
            User.findOneAndUpdate({email: email }, { password: hashedPassword }, { new: true })
              .then(() => {
                transporter.sendMail(mailOptions, function(err, success){
                  if(err){
                    console.log(err);
                  }else{
                    res.json("Email sent successfully!");
                  }
                })
              })
              .catch((error) => {
                res.json("Error updating password: " + error);
              });

        } else {
          res.json("User not found");
        }
      })
      .catch((error) => {
        res.json("Error: " + error);
      });
  });

module.exports = router;
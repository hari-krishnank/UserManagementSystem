const User = require('../models/userModel')
const bcrypt = require('bcrypt')


const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10)
    return passwordHash
  } catch (error) {
    console.log(error.message)
  }

}


const loadRegister = async (req, res) => {

  try {
    res.render('registration')

  } catch (error) {
    console.log(error.message)
  }
}
const insertUser = async (req, res) => {

  try {
    const existUser = await User.findOne({ email: req.body.email })
    if (existUser) {
      return res.render('registration', { message: 'email already exist' })
    }else{


      const sPassword = await securePassword(req.body.password);

      const user = User({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobileNumber,
        image: req.file.filename,
        password: sPassword,
        is_Admin: 0,



      })
      const userData = await user.save()
      if (userData) {
        return res.render('registration', { message: 'Your registration Successfull' })
      } else {
        return res.render('registration', { message: 'Your registration Failed' })
      }
    }
  } catch (error) {
    console.log(error.message)
  }
}

//login user methods
const loadlogin = async (req, res) => {

  try {
    res.render('login')

  } catch (error) {
    console.log(error.message)
  }
}
//-----------------------------------------------------------------------------------------------
//verify Login-----------------------------------------------------------------------------
const verifyLogin = async (req, res) => {
  try {
    const { email } = req.body
    const password = req.body.password

    const userData = await User.findOne({ email: email, is_Admin: 0 });
    console.log(userData);
    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password)
      if (passwordMatch) {
        req.session.user_id = userData._id;
        res.redirect('/home');
      } else {
        res.render('login', { message: 'Email and password is incorrect' })
      }
    } else {
      res.render('login', { message: 'You are not registered' })
    }


  } catch (error) {
    console.log(error.message)
  }
}
//-----------------------------------------------------------------------------------------
//load home---------------------------------------------------------------------------------

const loadHome = async (req, res) => {
  try {
    const userData = await User.findOne({ _id: req.session.user_id});

    if(userData.is_Admin === 1){
      return res.status(401).render('login', { message: 'You are Admin Dude!'});
    }
    console.log(userData);
    res.render('home', { user: userData });
  } catch (error) {
    console.log(error.message);
  }
};




//------------------------------------------------------------------------------------------
//logout
const loadLogout = async (req, res) => {
  try {
    req.session.destroy()
    res.redirect('/')
  } catch (error) {
    console.log(error.message)
  }
}
//user profile edit--and update-----------------------------------------------------------------
const loadEdit = async (req, res) => {
  try {

    const id = req.query.id
    const userData = await User.findById({ _id: id })

    if (userData) {
      res.render('edit', { user: userData })
    } else {
      res.redirect('/home')
    }

  } catch (error) {
    console.log(error.message)
  }
}
//-----------------------------load update profile-----------------------------------
const loadUpdateProfile = async (req, res) => {
  try {
    if (req.file) {
      const userData = await User.findByIdAndUpdate({ _id: req.body.userId }, { $set: { name: req.body.name, email: req.body.email, mobile: req.body.mobile, image: req.file.filename } })
    } else {
      const userData = await User.findByIdAndUpdate({ _id: req.body.userId }, { $set: { name: req.body.name, email: req.body.email, mobile: req.body.mobile } })

    }
    res.redirect('/home')
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = {
  loadRegister,
  insertUser,
  loadlogin,
  verifyLogin,
  loadHome,
  loadLogout,
  loadEdit,
  loadUpdateProfile

}
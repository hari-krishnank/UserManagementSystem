const User= require('../models/userModel')
const bcrypt=require('bcrypt')

const loadLogin=async(req,res)=>{

    try {
        res.render('login')
    } catch (error) {
        console.log(error.message)
    }
}



const verifyLogin=async(req,res)=>{
    try {
        const email= req.body.email
        const password= req.body.password
     const userData =  await User.findOne({email:email})
     if (userData){
     const passwordMatch= await bcrypt.compare(password,userData.password)
     if(passwordMatch){
       if(userData.is_Admin===0){
        res.render('login',{message:'Email and password is incorrect'})
       }else{
       
        req.session.user_id=userData._id
      
        res.redirect('/admin/dashboard')

       }
     }else{
        res.render('login',{message:'Email and password is incorrect'})
     }
     }else{
        res.render('login',{message:'Email and password is incorrect'})

     }
    } catch (error) {
        console.log(error.message)
    }
}


const loadHome=async(req,res)=>{
    try {
       const userData = await User.findById({_id:req.session.user_id})
        res.render('home',{admin:userData})
    } catch (error) {
        console.log(error.message)
    }
}
const logout=async(req,res)=>{
    try {
        req.session.user_id = null;
        res.redirect('/admin')
    } catch (error) {
        console.log(error.message)
    }
}

const adminDashboard=async(req,res)=>{
      try {
        console.log('search')
        var search=''
        if(req.query.Search){
            search=req.query.Search
        }
     const usersData= await User.find({
        is_Admin:0, 
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {email:{$regex:'.*'+search+'.*',$options:'i'}},
            {mobile:{$regex:'.*'+search+'.*',$options:'i'}}
        ]
    })
     res.render('dashboard',{users:usersData})

      } catch (error) {
        console.log(error.message)
      }
}

const loadNewUser=async(req,res)=>{
        try {
              res.render('new-user')
        } catch (error) {
            console.log(error.message)
        }
}
const securePassword= async(password)=>{
    try {
      const passwordHash= await bcrypt.hash(password,10)
      return passwordHash
    } catch (error) {
        console.log(error.message)
    }
    
}

const addUser=async(req,res)=>{
     try {
   
    const name=req.body.name
    const email=req.body.email
    const mobile=req.body.mobile
    const image=req.file.filename
    const sPassword = await securePassword(req.body.password);    
  


    const user= new User({
        name:name,
        email:email,
        mobile:mobile,
        image:image,
        is_Admin:0,
        password:sPassword
        

    })
    const userData=await user.save()
    if(userData){
       res.redirect('/admin/dashboard')
    }else{
     res.render('new-user',{message:'Something Wrong'})
    }


     } catch (error) {
        console.log(error.message)
     }
}

const loadEditUser=async(req,res)=>{
        try {
            const id=req.query.id
          const userData=await  User.findById({_id:id})
          if(userData){
            res.render('edit-user',{user:userData})
          }else{
            res.redirect('/admin/dashboard')
          }
           
        } catch (error) {
            console.log(error.message)
        }
}
const updateUsers=async(req,res)=>{
       try {
      const userData= await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno}})
      res.redirect('/admin/dashboard')
       } catch (error) {
        console.log(error.message)
       }
}
const loadDeleteUser=async(req,res)=>{
       try {
       
       await User.deleteOne({_id:req.query.id})
       res.redirect('/admin/dashboard')
       } catch (error) {
        console.log(error.message)
       }
}


module.exports={
    loadLogin,
    verifyLogin,
    loadHome,
    logout,
    adminDashboard,
    loadNewUser,
    addUser,
    loadEditUser,
    updateUsers,
    loadDeleteUser

}
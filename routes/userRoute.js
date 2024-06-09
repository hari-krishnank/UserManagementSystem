const express=require('express')
const userRouter=express() 


const bodyParser=require('body-parser')
const session=require('express-session')
const config=require('../config/config')
const auth=require('../middlewares/auth')
const path=require('path')


userRouter.use(express.static(path.join(__dirname,'..','public','userImages')))
userRouter.set('view engine','ejs')
userRouter.set('views',path.join(__dirname,'..','views','users'))


userRouter.use(session({
secret:config.sessionSecret,
resave:false,
saveUninitialized:true
 }))




userRouter.use(bodyParser.json())
userRouter.use(bodyParser.urlencoded({extended:true}))
const multer=require('multer')

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'..','public','userImages'))

    },
    filename:(req,file,cb)=>{
   const name=Date.now()+'-'+file.originalname;
   cb(null,name)

    }
})
const upload=multer({storage:storage})

const userController=require('../controllers/userController')

userRouter.get('/register',auth.isLogout,userController.loadRegister)
userRouter.post('/register',upload.single('image'),userController.insertUser)

//login router---------------------------------------------------------------------------

userRouter.get('/',auth.isLogout,userController.loadlogin)
userRouter.get('/login',auth.isLogout,userController.loadlogin)
userRouter.post('/login',userController.verifyLogin)
userRouter.get('/home',auth.isLogin,userController.loadHome)
userRouter.get('/logout',auth.isLogin,userController.loadLogout)
userRouter.get('/edit',auth.isLogin,userController.loadEdit)
userRouter.post('/edit',upload.single('image'),userController.loadUpdateProfile)

//-----------------------------------------------------------------------------------------

module.exports=userRouter


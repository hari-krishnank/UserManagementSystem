const express= require('express')
const adminRoute= express();
const config=require('../config/config')
const session=require('express-session')
const path=require('path');
const nocache= require('nocache')

adminRoute.use(nocache())
adminRoute.set('view engine','ejs')
adminRoute.set('views',path.join(__dirname,'..','views','admin'))
adminRoute.use(session({secret:config.sessionSecret}))

const bodyParser=require('body-parser')
const auth=require('../middlewares/adminAuth')
const adminController = require('../controllers/adminController');
adminRoute.use(bodyParser.json())
adminRoute.use(bodyParser.urlencoded({extended:true}))
adminRoute.use(express.static(path.join(__dirname,'..','public','userImages')))
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






adminRoute.get('/',auth.isLogout, adminController.loadLogin);
adminRoute.post('/',adminController.verifyLogin)
// adminRoute.get('/home',auth.isLogin,adminController.loadHome)
adminRoute.get('/adminLogout',auth.isLogin,adminController.logout)
//---------------------------------------------islogin
adminRoute.get('/dashboard',auth.isLogin,adminController.adminDashboard)
adminRoute.get('/new-user',auth.isLogin,adminController.loadNewUser)
adminRoute.post('/new-user',upload.single('image'),adminController.addUser)
adminRoute.get('/edit-user',auth.isLogin,adminController.loadEditUser)
adminRoute.post('/edit-user' ,adminController.updateUsers)
adminRoute.get('/delete-user',adminController.loadDeleteUser)

adminRoute.get('*',(req,res)=>{
   res.redirect('/admin')
})
module.exports=adminRoute;
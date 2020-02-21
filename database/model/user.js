const mongoose=require('../connect');

const user={
    nick:String,
    password:String
}

const userModel=mongoose.model('user',user);

module.exports=userModel;

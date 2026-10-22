import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadResult} from "../utils/cloudnary.js"
import {ApiResponse} from "../utils/ApiResponse.js"


const generateAccessAndRefereshTokens = async(userId) => {

    try{

       const user =  await User.findById(userId)
       const accessToken = user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()
       user.refreshToken = refreshToken
      await user.save({validateBeforeSave:false})

       return {accessToken, refreshToken}

    }
    catch (error){
        throw new ApiError (500, 
            "something went wrong while generating and access token")

    }
}

export {generateAccessAndRefereshTokens}

const registerUser = asyncHandler(async (req, res) =>{

    // get user details from frontend
    // validation - not empty
    // check if user alredy exists : uerName, email
    // check for images, check for avatar
    // upload them to cloudinary
    //create user object- create entry in db
    //remove password and refresh roken field from response
    // check for user creation
    // retun response


    const {username, email, fullName, password} = req.body
    console.log("email :" , email)

    if([username, email, fullName, password].some((field)=>{
    field?.trim() === ""
    })){
  throw new ApiError(400,"fullname is required");
    }

  const existedUser = await User.findOne({
    // console.log(existedUser, "existedUser")
    $or:[{ username },{email}]
   })

   if(existedUser){
    throw new ApiError(408, "user With email or username alredy exists")
   }

 const avatarLocalPath = req.files?.avatar[0]?.path
  
//  const  coverImageLocalPath = req.files?.coverImage[0]?.path;

let coverImageLocalPath;
if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0 ){
    coverImageLocalPath = req.files.coverImage[0].path

}

 if(!avatarLocalPath){
    throw new ApiError( 400,"Avatar file is required")
 }

//   if(!coverImageLocalPath){
//     throw new ApiError( 400,"coverImage file is required")
//  }
const avatar =  await  uploadResult(avatarLocalPath)

const coverImage  =  await  uploadResult(coverImageLocalPath)

if(!avatar){
    throw new ApiError( 400,"Avatar file is required")
}

// if(!coverImage){
//  throw new ApiError( 400,"Avatar file is required")
// }

const user = await User.create({
    fullName,
    avatar : avatar.uploadResult,
    coverImage : coverImage?.uploadResult || " ",
    email,
    password,
    username: username.toLowerCase()

})

const createdUser =  await User.findById(user._id).select(
    "-password -refreshtoken"
)

if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering the user")
}


return res.status(201).json(
    new ApiResponse(200, createdUser, "User register Successfuly")
)





    // console.log(req.files, "req.files")
    
   
   
   
    // if(fullName === ""){
    //     throw new ApiError(400,"fullname is required");
        
    // }



    // res.status(200).json({
    //     message:"ok"
    // })




})

const loginUser = asyncHandler(async (req, res) => {
    //req body -> data
    // username or email
    //find the user
    //password check
    // access and refresh roken
    // send cookie
    // return res
 const  {username, email, password } = req.body
 if (!username || !email){
    throw new ApiError (400, "username or email is required")
 }

 const user = await User.findOne({
    $or:[{username},{email}]
 })

  if(!user){
    throw new ApiError(404, "User does not exists")
  }

const isPasswordValid = await user.isPasswordCorrect(password)

 if(!isPasswordValid){
    throw new ApiError(401, "Invalid user credentials")
  }

 const {accessToken, refreshToken} =  await generateAccessAndRefereshTokens(user._id)

 const lggginUser = await User.findById(user._id).select("-password -refreshToken")


 const options = {
    httpOnly :true,
    secure:true
 }

 return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(200,
    {
        user: lggginUser, accessToken,refreshToken
    },
    "user logged in successfully"

 ))


 
})


const logoutUser = asyncHandler(async(req, res)=>{
   User.findByIdAndUpdate(
  await  req.user._id,{
        $set:{
            refreshToken : undefined
        }
    },{
        new:true
    }
   )

    const options = {
    httpOnly :true,
    secure:true
 }

 return res.status(200).ClearCookie("accessToken", options).ClearCookie("refreshToken", options).json (new ApiResponse (200, {}, "User logouted "))

 })


export {registerUser,loginUser, logoutUser}
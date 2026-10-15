import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadResult} from "../utils/cloudnary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
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

  const existedUser =  User.findOne({
    // console.log(existedUser, "existedUser")
    $or:[{ username },{email}]
   })

   if(existedUser){
    throw new ApiError(408, "user With email or username alredy exists")
   }

 const avatarLocalPath = req.files?.avatar[0]?.path
  
 const  coverImageLocalPath = req.files?.coverImage[0]?.path;

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


export {registerUser}
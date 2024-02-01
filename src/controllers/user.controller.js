import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.models.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'


const registerUser = asyncHandler (async (req,res) => {
    //  res.status(200).json({
    //     message: "ok"
    // })


    // get user details from frontend
    // validation -not empty
    // check if user already exist-email,username
    // check for images and check for avatar
    // upload them to cloudinary,avatar
    // create user object - create entrypoint in db
    // remove password and refresh token from response
    // check for user creation
    // return res

    const {username,email,fullName,password} = req.body
    console.log("Email : ",email)

    // if(fullName == ""){
    //     throw new ApiError(400, "full name is required")
    // }
    
    if(
        [username,email,fullName,password].some((field) => field?.trim() === "")
        ){
           throw new ApiError(400,"All fields are required")
    }

    const existedUser = User.findOne({
        $or: [{ username },{ email }]
    })

    if(existedUser){
        throw new ApiError(409,"User with email and username already exist")
    }

    const avatarLocatPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocatPath){
        throw new ApiError(400,"Avatar file required")
    }

    const avatar = await uploadOnCloudinary(avatarLocatPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400,"Avatar file required") 
    }
const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
})

const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)

if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user")
}

return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered successfully")
)

})

export {registerUser}
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'
          
cloudinary.config({ 
  cloud_name: process.env.COLODINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async(lolalFilePath) =>{
    try {
        if(!lolalFilePath) return null

        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(lolalFilePath,{
            resource_type: "auto"
        })

        //file has been uploded
        console.log("file is uploded on cloudinary",response.url)
        return response

    } catch (error) {
        fs.unlinkSync(lolalFilePath); //removed the locally saved temporary file as the upload operation got failed
        return null
    }
}

export {uploadOnCloudinary}
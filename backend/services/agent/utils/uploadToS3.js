import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getS3Client } from "../config/s3.js"

export const uploadToS3=async (filename,buffer,contentType)=>{
 await getS3Client().send(
    new PutObjectCommand({
        Bucket:process.env.AWS_BUCKET_NAME,
        Body:buffer,
        Key:filename,
        ContentType:contentType
    })

 )

 return filename
}
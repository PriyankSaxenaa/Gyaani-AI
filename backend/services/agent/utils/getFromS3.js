import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client } from "../config/s3.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export const getFromS3=async (filename,expiresIn=600)=>{
  return await getSignedUrl(
    getS3Client(),
    new GetObjectCommand({
        Bucket:process.env.AWS_BUCKET_NAME,
        Key:filename
    }
    ),
    {expiresIn}
  )
}
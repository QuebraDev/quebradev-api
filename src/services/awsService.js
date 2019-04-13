const S3 = require('aws-s3');

const config = {
    bucketName: process.env.BUCKET_NAME,
    dirName: process.env.DIR_NAME,
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
}
 
const S3Client = new S3(config);

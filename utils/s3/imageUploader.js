const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { fromEnv } = require("@aws-sdk/credential-provider-env");
const multer = require("multer");
const path = require("path");
const CustomException = require("../handler/customException");

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: fromEnv(),
});

const generateS3Url = (bucketName, key) => {
  const region = process.env.AWS_S3_REGION;
  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
};

const allowedExtensions = [".png", ".jpg", ".jpeg", ".bmp"];

const storage = multer.memoryStorage(); // 이미지를 메모리에 저장하고 AWS S3로 전송

const imageUploader = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      return cb(new Error("wrong extensions"));
    }
    cb(null, true);
  },
}).array("imageUrl");

const uploadToS3 = async (req, res, next) => {
  if (!req.files) {
    return next();
  }

  let uploadedFileUrls = [];

  for (let file of req.files) {
    const filename = `post/${Date.now()}-${crypto.randomUUID()}`;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      // 1. 이미지를 S3에 업로드
      await s3Client.send(new PutObjectCommand(params));

      // 2. S3 URL 생성
      const fileUrl = generateS3Url(process.env.AWS_S3_BUCKET_NAME, filename);
      uploadedFileUrls.push(fileUrl);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Error uploading to S3 or saving to DB");
    }
  }

  req.uploadedFileUrls = uploadedFileUrls;
  next();
};

const deleteImageFromS3 = async (imageUrl) => {
  const baseUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/`;
  const key = imageUrl.slice(baseUrl.length); // 키 추출

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(params));
  } catch (error) {
    console.log(error);
    throw new Error("Error deleting image from S3");
  }
};

module.exports = {
  imageUploader,
  uploadToS3,
  deleteImageFromS3,
};

import aws from 'aws-sdk'

export async function POST(req){
    aws.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
      region: 'ap-northeast-2',
      signatureVersion: 'v4',
    })

    const s3 = new aws.S3();
    const url = await s3.createPresignedPost({
        Bucket: process.env.AWS_BUCKET_NAME,
        Fields: { key : req.query.file },
        Expires: 60, // seconds
        Conditions: [
            ['content-length-range', 0, 1048576], //파일용량 1MB 까지 제한
        ],
    })

    응답.status(200).json(url)
}  
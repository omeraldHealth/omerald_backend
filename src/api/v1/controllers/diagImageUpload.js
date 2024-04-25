const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_SECRET_REGION,
});

exports.uploadDiagImages = expressAsyncHandler(async (req, res) => {
    console.log(req)
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const params = {
        Bucket: 'omerald-diagnostic', // Set your bucket name
        Key: `uploads/${req.file.originalname}`, // File name you want to save as
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'public-read' // Adjust ACL according to your requirements
    };

    try {
        const data = await s3.upload(params).promise();
        res.send({ url: data.Location });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

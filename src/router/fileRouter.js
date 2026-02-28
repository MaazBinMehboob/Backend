import express from 'express'
import { uploadtocloudinary } from '../lib/utils.js'
import {upload} from '../lib/multer.js'


const fileRouter = express.Router()

fileRouter.post("/upload", upload.single("image"), async (req, res) => {

    const user =req.user

    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const result = await uploadtocloudinary(req.file.buffer);

        res.status(200).json({
            message: "Upload successful",
            imageUrl: result.secure_url,
            publicId: result.public_id
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export {
    fileRouter
}
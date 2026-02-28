import validator from 'validator';
import { cloudinary } from '../config/cloudinary.js';
import streamifier from 'streamifier'
import { connectdb } from '../config/db.js';


function validateSignup(req) {
    const { name, email, password } = req.body;

    if (!name) {
        throw new Error("Name is required");
    } else if (!validator.isEmail(email)) {
        throw new Error("Invalid Email Address!");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong enough");
    }
}

function validateLogin(req) {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
        throw new Error("Invalid Email Address!");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong enough");
    }
}


const uploadtocloudinary = (buffer) => {
    if (!buffer) {
        throw new Error("No file buffer provided");
    }

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "uploads" },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
};

const seedData = async (seed) => {
    await connectdb();
    try {
        const insertedProducts = await Product.insertMany(seed);
        console.log(`Successfully added ${seed.length} seeds.`);

        process.exit();
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};


export {
    validateLogin,
    validateSignup,
    uploadtocloudinary,
    seedData
}

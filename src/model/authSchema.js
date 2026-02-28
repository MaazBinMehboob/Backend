import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const { Schema } = mongoose

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email Address")
            }
        }

    },

    password: {
        type: String,
        required: true,

        // 8 characters
        // 1 uppercase letter
        // 1 lowercase letter
        // 1 Number
        // 1 special character

        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Password is not strong enough")
            }
        }


    },
}, {
    collection: 'users',
    timestamps: true
})

userSchema.methods.getJwt = function () {
    const user = this;
    return jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '7d' });
}


userSchema.methods.validatePassword = async function (password) {
    const user = this;
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    return isPasswordMatch;
}

const User = mongoose.model("User", userSchema)

export { User }
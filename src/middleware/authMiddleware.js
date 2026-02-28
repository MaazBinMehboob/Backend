import jwt from 'jsonwebtoken'
import {User} from '../model/authSchema.js'

const AuthMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized"});
        }

        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

export default AuthMiddleware;
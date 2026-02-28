import express from 'express'
import {connectdb} from './config/db.js'
import dotenv from 'dotenv'
import { authRouter } from './router/authRouter.js'
import { fileRouter } from './router/fileRouter.js'
import cookieParser from 'cookie-parser'
import AuthMiddleware from './middleware/authMiddleware.js'
import cors from 'cors';
// import helmet from 'helmet';


dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
// app.use(helmet());

app.use("/auth", authRouter)
app.use('/files', AuthMiddleware, fileRouter);

const startServer = async () => {
  try {
    await connectdb()
    console.log("Database connected successfully")

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })

  } catch (error) {
    console.error("Database connection failed:", error.message)
    process.exit(1)
  }
}
startServer()
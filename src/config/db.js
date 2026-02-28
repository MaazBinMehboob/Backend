import mongoose from "mongoose"

const connectdb = async () => {
  await mongoose.connect(
    `mongodb+srv://${process.env.DbUserName}:${process.env.DbPassword}@cluster0.x4mulgd.mongodb.net/${process.env.DbName}`
  )
}

export { connectdb}
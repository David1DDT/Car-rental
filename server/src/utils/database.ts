import mongoose from "mongoose";

const URI  = process.env.DB_URI || "mongodb://127.0.0.1:27017/pr-review?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.10"

export const connectToDatabase =  async () => {
    await mongoose.connect(URI)
}

export const disconnectDB = async () => {
    await mongoose.disconnect()
}
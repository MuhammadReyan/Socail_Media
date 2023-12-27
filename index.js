import express from 'express'
import mongoose from "mongoose";
import helmet from 'helmet'
import dotenv from 'dotenv'
import morgan from "morgan";
import connectDb from './db/connect.js';
import authRoute from './route/authRoute.js';
import userRoute from './route/users.js';
import postRoute from './route/post.js';
dotenv.config()


const app = express()
const PORT = 8000

// MIDDLEWARE
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))




// Get

app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/posts', postRoute)

const start = async () => {
    try {
        await connectDb(process.env.MONGO_URL)
        app.listen(PORT, () => {
            console.log("Server is working")
        })
    } catch (error) {
        console.log(error)
    }
}
start()





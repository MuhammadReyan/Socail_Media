import mongoose from "mongoose";




const connectDb = (uri) => {
    console.log("Connect Database")
    return mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}
export default connectDb
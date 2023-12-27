import express from "express";
import User from '../models/mUsers.js'
import bcrypt from 'bcrypt'

const authRoute = express.Router()

// Register

authRoute.post('/register', async (req, res) => {

    try {
        // Generate Password
        const salt = await bcrypt.genSalt(10)
        const hashedPasword = await bcrypt.hash(req.body.password, salt)

        // Create New User
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPasword
        })

        // Save User And Response
        const user = await newUser.save()
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }

})


// LOGIN 

authRoute.post('/login', async (req, res) => {

    try {

        const user = await User.findOne({ email: req.body.email })
        !user && res.status(404).json("User Not Found")

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(404).json("Wrong Password")
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }

})







export default authRoute
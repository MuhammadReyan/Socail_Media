import express from "express";
import Users from "../models/mUsers.js";
import bcrypt from 'bcrypt'

const usersRoute = express.Router()

// Update Your User
usersRoute.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {

        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (error) {
                return res.status(500).json(error)
            }
        }

        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { $set: req.body })
            res.status(200).json("Account has been updated successfully")
        } catch (error) {
            return res.status(500).json(error)
        }
    } else {
        return res.status(403).json("You can update only your account")
    }
})


// Delete User

usersRoute.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await Users.findByIdAndDelete(req.params.id)
            res.status(200).json("Account has been deleted successfully")
        } catch (error) {
            return res.status(500).json(error)
        }
    } else {
        return res.status(403).json("You can delete only your account")
    }
})


// Get User 
usersRoute.get('/:id', async (req, res) => {

    try {
        const user = await Users.findById(req.params.id)
        const { password, updatedAt, ...other } = user._doc
        res.status(200).json(other)
    } catch (error) {
        return res.status(500).json(error)
    }
})

// follow a user

usersRoute.put('/:id/follow', async (req, res) => {

    if (req.body.userId !== req.params.id) {
        try {
            const user = await Users.findById(req.params.id)
            const currentUser = await Users.findById(req.body.userId)
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } })
                await currentUser.updateOne({ $push: { followings: req.params.id } })
                res.status(200).json("User has been followed")
            } else {
                res.status(403).json("You Already follow this user")
            }

        } catch (error) {
            return res.status(500).json(error)
        }
    } else {
        res.status(403).json("You Can not follow yourself")
    }

})




// Unfollow a user

usersRoute.put('/:id/unfollow', async (req, res) => {

    if (req.body.userId !== req.params.id) {
        try {
            const user = await Users.findById(req.params.id)
            const currentUser = await Users.findById(req.body.userId)
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } })
                await currentUser.updateOne({ $pull: { followings: req.params.id } })
                res.status(200).json("User has been Unfollowed")
            } else {
                res.status(403).json("You Already unfollow this user")
            }

        } catch (error) {
            return res.status(500).json(error)
        }
    }else {
        res.status(403).json("You Can not Unfollow yourself")
    }

})






export default usersRoute
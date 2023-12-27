import express from "express";
import Post from "../models/post.js"
import User from "../models/mUsers.js"



const postRoute = express.Router()



// Create a Post

postRoute.post('/', async (req, res) => {

    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)

    } catch (error) {
        res.status(500).json(error)
    }

})
// Update a post
postRoute.put('/:id', async (req, res) => {

    try {
        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body })
            res.status(200).json("This post has been updated")
        } else {
            res.status(403).json("You can update only your post")
        }
    } catch (error) {
        res.status(500).json(error)
    }

})
// delete a post


postRoute.delete('/:id', async (req, res) => {

    try {
        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.deleteOne()
            res.status(200).json("This post has been deleted")
        } else {
            res.status(403).json("You can delete only your post")
        }
    } catch (error) {
        res.status(500).json(error)
    }

})
// like /dislike a post



postRoute.put('/:id/like', async (req, res) => {

    try {
        const post = await Post.findById(req.params.id)
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } })
            res.status(200).json("This post has been liked")
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } })
            res.status(403).json("You  post has been disliked")
        }
    } catch (error) {
        res.status(500).json(error)
    }

})








// get a post

postRoute.get('/:id', async (req, res) => {

    try {
        const post = await Post.findById(req.params.id)

        res.status(200).json(post)

    } catch (error) {
        res.status(500).json(error)
    }

})

//  get timeline posts 


postRoute.get('/timeline/all', async (req, res) => {

    let postArray = []
    try {
        const currentUser = await User.findById(req.body.userId)
        const userPosts = await Post.find({ userId: currentUser._id })
        const friendPost = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId })
            })
        )

        res.json(userPosts.concat(...friendPost))

    } catch (error) {
        res.status(500).json(error)
    }

})








export default postRoute
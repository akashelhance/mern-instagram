const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const requiredLoggin = require("../middleware/requiredLogin")
const { check, validationResult } = require("express-validator");

router.get('/allpost',requiredLoggin, async(req,res)=>{
    let allpost = await Post.find().populate("postedBy","_id name")
    res.send(allpost)
    
})



router.post(
    "/createpost",requiredLoggin,
    check("title", "Title is required").notEmpty(),
    check("body", "Body is required").notEmpty(),
    // check("Pic", "Pic is required").notEmpty(),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {title,body} = req.body 
      req.user.password = undefined
      const post = new Post({
        title,
        body,
        // photo:pic,
        postedBy:req.user
        
        })

        await post.save();
        res.send(post)
    }
  );


  
  router.get('/mypost',requiredLoggin,async(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("PostedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})


module.exports = router
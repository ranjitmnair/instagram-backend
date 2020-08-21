const router = require ('express').Router ();
const Post = require ('../models/Post');
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');
const verifyToken = require ('../middleware/verifyToken');
const {postValidation} = require ('../validation');

router.get ('/getposts', verifyToken, async (req, res) => {
  try {
    const posts = await Post.find ().populate ('postedBy', '_id name');

    return res.status (200).json ({posts});
  } catch (error) {
    return res.status (400).json ({error});
  }
});

router.post ('/createpost', verifyToken, async (req, res) => {
  // validation
  const {error} = postValidation (req.body);
  if (error) return res.status (400).json (error.details[0].message);

  req.user.password = null;
  const post = new Post ({
    title: req.body.title,
    body: req.body.body,
    postedBy: req.user,
  });
  try {
    const savedPost = await post.save ();
    return res.status (200).json (post);
  } catch (err) {
    return res.status (400).json ({err});
  }
});

router.get ('/myposts', verifyToken, async (req, res) => {
  try {
    const posts = await Post.find ({postedBy: req.user._id}).populate (
      'postedBy',
      '_id name'
    );
    return res.status (200).json ({posts});
  } catch (error) {
    return res.status (401).send ({error});
  }
});

//delete post
router.delete('/deletepost/:postId',verifyToken,async(req,res)=>{
    const post= await Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id");
    try {
       if(String(post.postedBy._id)==String(req.user._id)){
            const deletePost=post.remove();
            return res.status(200).json("post deleted successfully.");
       }
    } catch (error) {
        return res.status(401).json({error});
    }
})





//like dislike  route
router.put ('/like', verifyToken, async (req, res) => {
  const currentPost = await Post.findById (req.body.postId);
  for(var i=0;i<currentPost.likes.length;i++){
      if(String(currentPost.likes[i])==String(req.user._id)){
  
       //  console.log(currentPost.likes[i]);
     const post = await Post.findByIdAndUpdate (
        req.body.postId,
        {
          $pull: {likes: req.user._id},
          $inc: {likeCount: -1},
        },
        {
          new: true,
        }
      );
      try {
        return res.status (200).json (post);
      } catch (error) {
        return res.status (400).json ({error});
      }
    }
}   

  const post = await Post.findByIdAndUpdate (
    req.body.postId,
    {
      $push: {likes: req.user._id},
      $inc: {likeCount: 1},
    },
    {
      new: true,
    }
  );

  try {
    return res.status (200).json (post);
  } catch (error) {
    return res.status (400).json ({error});
  }
});

//comment feature
router.put('/comment',verifyToken,async(req,res)=>{
    const comment ={
        text: req.body.text , //text of comment
        postedBy:req.user._id
    }
    const post=await Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment},
        $inc: { commentCount: 1 }
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    try {
        return res.status(200).json(post)
    } catch (error) {
        return res.status(400).json({error});
    }
})

module.exports = router;

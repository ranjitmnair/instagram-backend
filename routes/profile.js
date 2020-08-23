const router = require ('express').Router ();
const Post = require ('../models/Post');
const User = require ('../models/User');
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');
const verifyToken = require ('../middleware/verifyToken');

router.get ('/profile/:id', verifyToken, async (req, res) => {
  const user = await User.findOne ({_id: req.params.id}).select (
    '-password -email'
  );
  const posts = await Post.find ({postedBy: req.params.id}).populate (
    'postedBy',
    '_id name'
  );
  try {
    return res.status (200).json ({user, posts});
  } catch (error) {
    return res.status (400).json (error);
  }
});

//follow unfollow

router.put ('/profile/follow', verifyToken, async (req, res) => {
  const userFollowed = await User.findById (req.body.followId);
  for (var i = 0; i < userFollowed.followers.length; i++) {
    if (userFollowed.followers[i].toString () == req.user._id.toString ()) {
      const tofollow = await User.findByIdAndUpdate (
        req.body.followId,
        {
          $pull: {followers: req.user._id},
          $inc: {followerCount: -1},
        },
        {new: true}
      );
      const byfollow = await User.findByIdAndUpdate (
        req.user._id,
        {
          $pull: {following: req.body.followId},
          $inc: {followingCount: -1},
        },
        {new: true}
      );
      try {
        return res.status (200).json ({tofollow, byfollow});
      } catch (error) {
        return res.status(400).json (error);
      }
    }
  }

  const tofollow = await User.findByIdAndUpdate (
    req.body.followId,
    {
      $push: {followers: req.user._id},
      $inc: {followerCount: 1},
    },
    {new: true}
  );
  const byfollow = await User.findByIdAndUpdate (
    req.user._id,
    {
      $push: {following: req.body.followId},
      $inc: {followingCount: 1},
    },
    {new: true}
  );

  try {
    return res.status(200).json({tofollow, byfollow});
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;

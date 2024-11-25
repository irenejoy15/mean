const Post = require('../models/post')

exports.createPost =   (req,res,next)=>{
    const url = req.protocol + '://' + req.get("host");
    const post= new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
    post.save().then(createdPost=>{
        res.status(201).json({
            message: 'POST ADD SUCCESSFULLY',
            post:{
                id: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imagePath:createdPost.imagePath
            }
        });
    })
    .catch(error=>{
        return res.status(401).json({
            message: error.toString()
        });
    });
};

exports.updatePost =  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    });
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
      .then(result => {
        console.log(result);
        if (result.acknowledged == true) {
          res.status(200).json({ message: "Update successful!" });
        } else {
          res.status(401).json({ message: "Not authorized!" });
        }
      })
      .catch(error => {
        res.status(500).json({
          message: "Couldn't udpate post!"
        });
      });
  };

  exports.getPosts = (req,res,next)=>{
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page; 
    const postQuery = Post.find();
    let fetchedPosts;
    if(pageSize && currentPage){
        postQuery
        .skip(pageSize * (currentPage-1))
        .limit(pageSize);
    }
    postQuery
    .then(documents => {
        fetchedPosts = documents;
        return Post.countDocuments();
    })
    .then(count=>{
        res.status(200).json({
            message: 'Post fetched sucessfully',
            posts: fetchedPosts,
            maxPosts: count
        });
    }).catch(error=>{
        res.status(500).json({
            message:"Fetching posts Failed!"
        });
    });
};

exports.getPost = (req,res,next)=>{
    Post.findById(req.params.id).then(post =>{
        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json({message: 'Post Not Found'});
        }
    }).catch(error=>{
        res.status(500).json({
            message:"Fetching posts Failed!"
        });
    });
};

exports.deletePost = (req,res,next)=>{
    Post.deleteOne({_id:req.params.id,creator:req.userData.userId})
    .then(result=>{
        // if(result.n > 0){
            res.status(200).json({message: 'Post Deleted'});
        // }else{
        //     res.status(401).json({ message: "Not Authorize!" });
        // }
    }).catch(error=>{
        res.status(500).json({
            message:"Fetching posts Failed!"
        });
    });
};
const router = require('express').Router();
let Post = require('../modules/post-schema');

//get all posts
router.route('/').get((req,res) => {
    Post.find()
    .then(posts => res.json(posts))
    .catch(err => res.status(400).json('Error: ' +err));
});

//get post by id
router.route('/:id').get((req,res) => {
    Post.findById(req.params.id)
    .then(posts => res.json(posts))
    .catch(err => res.status(400).json('Error: '+err));
});
//create post 
router.route('/add').post(async (req, res) => {
    const title = req.body.title;
    const username = req.body.username;
    var data = req.body.data;
    var img = req.body.img
    var text = req.body.text;
    var comments = req.body.comments;

    const newPost = new Post({'title': title, 'username':username, 'data': data, 'img' : img, 'text' : text, 'comments': comments});
    newPost.save()
    .then(() => res.json(newPost))
    .catch(err => res.status(400).json('Error: ' + err));
});

//delete post by id
router.route('/:id').delete((req,res) => {
    Post.findByIdAndDelete(req.params.id)
    .then(posts => res.json('Post deleted'))
    .catch(err => res.status(400).json('Error: '+err));
});
//update post by id
router.route('/update/:id').post((req,res) => {
    Post.findById(req.params.id)
    .then(posts => {
        posts.title = req.body.title;
        posts.username = req.body.username;
        posts.data = req.body.data;
        posts.img = req.body.img
        posts.text = req.body.text;
        posts.comments = req.body.comments;
    posts.save()
    .then(() => res.json('Posts updated !'))
    .catch(err => res.status(400).json('Error: '+err));
    })
    .catch(err => res.status(400).json('Error: '+err));
});


module.exports = router;
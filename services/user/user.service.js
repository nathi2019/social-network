const
    path = require('path'),
    { User, Post, Ad } = require(path.join(__dirname, '..', '..', 'models'));

const multer = require('multer');
const upload = multer({ dest: '/uploads/' });


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});
// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 10244 * 1024 * 5
//     },
//     filefilter: filefilter

// });
const filefilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false)
    }

    function createPost(userId, data) {
        const post = new Post({
            postedBy: userId,
            title: data.title,
            description: data.description,
        });

    }

    function updatePost() {

    }

    function deletePost() {

    }

    function createComment() {

    }

    function updateComment(params) {

    }

    function deleteComment(params) {

    }

    function followUser(params) {

    }

    function getUserById(id) {
        return User.findOne({ _id: id });
    }

    module.exports = {
        createPost,
        updatePost,
        deletePost,
        createComment,
        updateComment,
        deleteComment,
        followUser
    }
}
const router = require('express').Router();

const{
    getUsers,
    getSingleUser,
    createUser,
    deleteUser,
    updateUser,
    addFriend,
    removeFriend,
} = require('../../controllers/userController')

//initial route
router.route('/').get(getUsers).post(createUser);

//routes for single user
router
    .route('/:userId')
    .get(getSingleUser)
    .put(updateUser)
    .delete(deleteUser)

//routes for friends
router.route('/:userId/friends/:friendId')
    .post(addFriend)
    .delete(removeFriend)



module.exports = router
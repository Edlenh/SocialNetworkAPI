const router = require('express').Router();
// const thoughtsRoute=require('./thought-routes');
const userRoute=require('./user-routes');

// router.use('/thoughts',thoughtsRoute)
router.use('/users', userRoute)

module.exports = router
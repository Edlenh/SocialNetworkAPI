const router = require('express').Router();

const{
    getThoughts,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction,
} = require('../../controllers/thoughtController')

//initial route for thoughts
router.route('/').get(getThoughts).post(createThought)

//routes for single thought
router
    .route('/:id')
    .get(getSingleThought)
    .put(updateThought)
    .delete(deleteThought)

//routes for reactions (inside thought schema)
router.route("/:thoughtId/reactions").post(addReaction)

router.route("/:thoughtId/reactions/:reactionId").delete(deleteReaction)

module.exports = router
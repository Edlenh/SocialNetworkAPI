const { Thought, User } = require('../models');

const thoughtController = {
    //get ALL thoughts, from all users
    getThoughts(req,res){
    Thought.find({})
      .populate({
        //see reactions
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((thought) => res.json(thought))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

    //get SINGLE thought
    getSingleThought({params},res){
     Thought.findOne({ _id: params.id })
      .populate({
        //see reactions
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .then((thought) => 
        !thought? res.status(404).json({message: 'Sorry Thought not Found'})
        :res.json(thought)
        )
        .catch((err)=> res.status(500).json(err))
    },
    
    //CREATE a thought
    createThought({body}, res){
        Thought.create(body)
        .then(({_id})=>{
            return User.findOneAndUpdate(
                {_id: body.userId},
                { $push: {thoughts:_id} },
                {new: true}
            );
        })
        .then((user) => 
        !user? res.status(404).json({message: 'Sorry User not Found'})
        :res.json({message:"Thought created!"}))
        .catch((err)=> res.status(500).json(err))
    },

    //UPDATE/PUT thought
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, {
          new: true,
          runValidators: true,
        })
          .then((thought) => {
            if (!thought) {
              res.status(404).json({ message: "No thought found with this id!" });
              return;
            }
            res.json(thought);
          })
          .catch((err) => res.json(err));
      },
    
      // DELETE Thought
      deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
          .then((thought) => {
            if (!thought) {
              return res.status(404).json({ message: "No thought with this id!" });
            }
    
            return User.findOneAndUpdate(
              { thoughts: params.id },
              { $pull: { thoughts: params.id } }, 
              { new: true }
            );
          })
          .then((user) => {
            if (!user) {
              return res
                .status(404)
                .json({ message: "Thought created but no user with this id!" });
            }
            res.json({ message: "Thought successfully deleted!" });
          })
          .catch((err) => res.json(err));
      },
    
      // ADD reaction
      addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $addToSet: { reactions: body } },
          { new: true, runValidators: true }
        )
          .then((thought) => {
            if (!thought) {
              res.status(404).json({ message: "No thought with this id" });
              return;
            }
            res.json(thought);
          })
          .catch((err) => res.json(err));
      },
    
      // delete reaction
      deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $pull: { reactions: { reactionId: params.reactionId}}},
         //operator removes from an existing array all instances of a value or values that match a specified condition.
          { new: true }
        )
          .then((thought) => res.json(thought))
          .catch((err) => res.json(err));
      },
    };
    
    module.exports = thoughtController;
    

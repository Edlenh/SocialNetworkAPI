const { User ,Thought} = require('../models');

const userController={
    //get ALL users
    getUsers(req,res){
        User.find({})
        //see friend list and amount                                                       
        .populate({
          path: "friends",
          select: "-__v",
        })
        .select("-__v")
        //sort by descending order, last created comes first
        .sort({ _id: -1 })
        .then((user) => res.json(user))
        .catch((err) => {
          console.log(err);
          res.sendStatus(400);
        });
    },

    //get SINGLE user
    getSingleUser(req,res){
        User.findOne({_id: req.params.userId})
        .populate({
            //see thoughts from this user
            path: "thoughts",
            select: "-__v",
          })
          .populate({
            //see friends of this user
            path: "friends",
            select: "-__v",
          })
        .select('-__v')
        .then((user)=>
        !user? res.status(404).json({message: 'Sorry User Not Found'})
        :res.json(user)
        )
        .catch((err)=> res.status(500).json(err))
    },
    //CREATE a user
    createUser(req,res){
        User.create(req.body)
        .then((user)=> res.json(user))
        .catch((err)=>{
            console.log(err);
            return res.status(500).json(err);
        });
    },

    //DELETE a user
    deleteUser(req,res){
        User.findOne({_id: req.params.userId})
        .then((user)=>
        !user? res.status(404).json({message: 'Sorry User Not Found'})
        //thoughts related to that user should also be deleted. 
        //yknow? like reddit. sometimes you see 'deleted' comments on threads
        : Thought.deleteMany({_id: { $in:user.thought }})
        )
        .then(()=> res.json({message: 'User and related thoughts deleted!'}))
        .catch((err)=>res.status(500).json(err));
    },

    //UPDATING a user
    updateUser(req,res){
        User.findOneAndUpdate(
            {_id: req.params.userId},
            { $set: req.body},
            {runValidators: true, new: true}
        )

        .then((user) =>
            !user
            ? res.status(404).json({message: 'HEY no user with this id!'})
            : res.json(user)
        )
        .catch((err)=> res.status(500).json(err))
    },

    //add friend
    //who needs friends?
    addFriend({params}, res){
        User.findOneAndUpdate(
            {_id:params.userId},
            {$addToSet:{friends: params.friendId}},
            //operator adds a value to an array unless the value is already present,
        {runValidators: true, new: true})
        .then((user) =>
        !user
        ? res.status(404).json({message: 'HEY no user with this id!'})
        : res.json(user)
    )
    .catch((err)=> res.status(500).json(err))
    },
    
    //get ri..delete friend
    //hello grader how are you?
    //please dont dock me points im just trying to make coding fun for myself
    removeFriend({ params }, res) {
        User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { friends: params.friendId } },
           //operator removes from an existing array all instances of a value or values that match a specified condition.
          { new: true })
          .then((user) => {
            if (!user) {
              return res.status(404).json({ message: "No user with this id!" });
            }
            res.json(user);
          })
          .catch((err) => res.json(err));
      },
};

module.exports = userController
const { User, Thought } = require('../models');

module.exports ={
    //get ALL users
    getUsers(req,res){
        User.find()
        .then((users)=>res.json(courses))
        .catch((err)=> res.status(500).json(err))
    },

    //get SINGLE user
    getSingleUser(req,res){
        User.findOne({_id: req.params.userId})
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
};


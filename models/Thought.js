const { Schema, Types, model} = require('mongoose');

//reaction will be used as a subdocument schema
const reactionSchema = new Schema(
    {
        reactionId:{
            type:Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody:{
            required: true,
            type: String,
            maxlength: 280,
        },
        username:{
            type: String,
            required: true,
        },
        createdAt:{
            type: Date,
            default: Date.now,
            get:(timestamp)=> dateFormat(timestamp),
        },
    },
    {
        toJSON:{
            getters: true,
        },
        id: false,
    }
);

const thoughtSchema = new Schema(
    {
        thoughtText:{
            type:String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt:{
            type: Date,
            default: Date.now,
            get:(timestamp) => dateFormat(timestamp),
        },
        username:{
            type: String,
            required: true,
        },
        //refer to nested documents from the reaction subdocument
        reactions: [reactionSchema],
    },
    {
        toJSON:{
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);

//include virtuals from reaction to return the number of reactions.
//similar to like count.  
thoughtSchema.virtual("reaction count").get(function(){
    return this.reactions.length;
});

const Thought = model("Thought", thoughtSchema);
module.exports = Thought;
const {Schema, model } = require('mongoose');


const userSchema = new Schema(
    {
        username:{
            type:String,
            unique:true,
            required:true,
            trim:true
        },
        email:{
            type: String,
            unique: true,
            required: true,
            match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        thought: [],
        friends: [this]
    },
    {
        toJSON:{
            getters: true,
            virtuals: true
        }
    }
);

userSchema.virtual('friends').get(function(){
    return this.friends.length;
})

const User = model('User', UserSchema)

module.exports = User
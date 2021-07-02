const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

const UserSchema = new mongoose.Schema({
    username: String,
    lastName: String,
    firstName: String,
    address: String,
    email: {type: String, required: true},
    password: { type: String, required: true},
    admin: { type: Boolean, default: false},
    photo: String,
    date: Date
})

UserSchema.pre('save', function(next){
    if (this.isModified('password') || this.isNew){
        bcrypt.genSalt(10, function(error, salt){
            if(error){
                return next(error)
            }

            bcrypt.hash(this.password, salt, null, function(error, hash){
                if(error){
                    return next(error)
                }

                this.password = hash
                next()
            })
        })
    }else{
        return next()
    }
})

UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User', UserSchema)

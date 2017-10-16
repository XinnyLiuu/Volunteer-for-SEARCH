const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
  email: {type: String, unique: true },
  password: String,
  name: String,
  google: String,
  points: Number, //
  badge: String,
  tokens: Array,
  isStaff: {type: Boolean, default: false },

  profile: {
    name: String,
    gender: String,
    picture: String
  }
}, { timestamps: true });



//password hasher
userSchema.pre('save', function save(next) {
  const user = this;
  if(!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(); }
      user.password = hash;
      next();
    });
  });
});

//password validator
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};


const User = mongoose.model('User', userSchema);

module.exports = User;

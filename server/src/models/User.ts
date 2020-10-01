import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10;

interface IUser extends Document {
  username: string;
  password: string;
}
 
const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  test: String,
  contacts: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  profile: {
    image: {
      name: String
    }
  },
  chats: [{ type: Schema.Types.ObjectId, ref: 'Chat' }]
});

userSchema.pre<IUser>('save', function(next) {
  const user = this;

  // only hash password if it has been modified or is new
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);

    // hash the password along with the new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword) {
  const user = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) return reject(err);

      if (!isMatch) return reject(false);

      resolve(true);
    });
  });
};

mongoose.model<IUser>('User', userSchema);
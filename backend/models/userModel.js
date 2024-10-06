import mongoose from 'mongoose';

// Creating user model
const userModel = mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, trim: true, unique: true },
    password: { type: String, trim: true },
    pic: {
      type: String,
      required: true,
      default:
        // OK
        'https://cdn.discordapp.com/attachments/439533593430196236/1292369607113310219/ok-rammus.png?ex=67037c7d&is=67022afd&hm=4c5986823ec7e90d6185038f710a5beead64d686b59ec9c16b0214b961880a3c&',
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userModel);

export default User;

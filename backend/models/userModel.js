import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// Creating user model
const userModel = mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, trim: true, unique: true },
    clerkId: { type: String, trim: true, unique: true },
    pic: {
      type: String,
      default:
        // OK
        'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/eba2e93e-e25f-4528-8235-27eb869406ab/dcde5qi-1143cbac-e833-45a9-b78e-5e63cddc88f6.png/v1/fill/w_970,h_823/rammus__okay__by_ieket_dcde5qi-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODY5IiwicGF0aCI6IlwvZlwvZWJhMmU5M2UtZTI1Zi00NTI4LTgyMzUtMjdlYjg2OTQwNmFiXC9kY2RlNXFpLTExNDNjYmFjLWU4MzMtNDVhOS1iNzhlLTVlNjNjZGRjODhmNi5wbmciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.dPQhEEH2B3SNkLasPCmWhYDfGeqZ6ybDNlssOVMiNRc',
    },
    // TODO: implement friends features
    // friendList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // requestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // requestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userModel);

export default User;

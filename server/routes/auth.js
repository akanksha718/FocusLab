import express from "express";
import firebaseAuth from "../middleware/auth.js";
import User from "../models/User.js";

const userrouter = express.Router();

userrouter.post("/data", firebaseAuth, async (req, res) => {
  const fbUser = req.firebaseUser;
  let user = await User.findOne({ firebaseUid: fbUser.uid });
  if (!user) {
    // 🆕 Create user
    user = await User.create({
      firebaseUid: fbUser.uid,
      email: fbUser.email,
      name: fbUser.name || fbUser.email.split("@")[0],
      photo: fbUser.picture,
      provider: fbUser.firebase.sign_in_provider,
      emailVerified: fbUser.email_verified,
    });
  } else {
    // 🔁 Update user info
    user.emailVerified = fbUser.email_verified;
    user.photo = fbUser.picture;
    await user.save();
  }
  res.status(200).json({ user });
});

export default userrouter;

const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

router.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
});

router.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const { isValid, notAllowedField } = validateEditProfileData(req);
    if (!isValid) {
      throw new Error(`Field ${notAllowedField} is not allowed to edit`);
    }

    const loginedUser = req.user;
    Object.keys(req.body).forEach((key) => (loginedUser[key] = req.body[key]));
    const updatedProfile = await loginedUser.save();
    const { password, ...userWithoutPassword } = updatedProfile._doc;

    res.status(200).json({
      message: "Profile updated successfully",
      data: userWithoutPassword,
    });
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
});

module.exports = router;

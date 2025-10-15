const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/request");
const User = require("../models/user");

router.post("/request/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const fromUserId = user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const ALLOWED_STATUS = ["ignored", "interested"];

    if (ALLOWED_STATUS.indexOf(status) === -1) {
      throw new Error(`Status '${status}' is not allowed`);
    }
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      throw new Error("User not Found");
    }

    if (fromUserId.toString() === toUserId.toString()) {
      throw new Error("User can not send request to itself");
    }

    const isConnectionExist = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    console.log(isConnectionExist);
    if (isConnectionExist) {
      throw new Error("Connection request already exists! ");
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    const data = await connectionRequest.save();
    res.json({ message: "Connection request sent successfully", data });
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

module.exports = router;

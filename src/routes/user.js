const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/request");
const User = require("../models/user");

const SAFE_USER_FIELDS = ["firstName", "lastName", "age", "about", "skills"];

router.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const recievedConnections = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", SAFE_USER_FIELDS);
    ///instead of array we can use space seperated field names or we can use object approach to populate the data
    res.json({ message: "success", data: recievedConnections });
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

router.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
      $and: [{ status: "accepted" }],
    })
      .populate("fromUserId", SAFE_USER_FIELDS)
      .populate("toUserId", SAFE_USER_FIELDS);

    const data = connectionRequest.map((item) => {
      if (item.toUserId._id.toString() === loggedInUser._id.toString()) {
        return item.fromUserId;
      }
      return item.toUserId;
    });
    res.json({
      message: "success",
      data,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

router.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    limit = limit > 50 ? 50 : limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select(["fromUserId", "toUserId"]);

    const hideUserFromFeed = new Set();
    connectionRequest.forEach((row) => {
      hideUserFromFeed.add(row.fromUserId.toString());
      hideUserFromFeed.add(row.toUserId.toString());
    });

    const data = await User.find({
      $and: [
        {
          _id: {
            $nin: Array.from(hideUserFromFeed),
          },
        },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(SAFE_USER_FIELDS)
      .skip(skip)
      .limit(limit);

    res.json({ message: "success", data });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = router;

//packages
import express from "express";
import passport from "passport"

//middleware-limiter
import {
  followLimiter,
  signupSigninLimiter,
} from "../middleware/limiter/limiter.mjs";

//middleware-validator
import {
  addUserValidationHandler,
  addUserValidator,
} from "../middleware/users/usersValidator.mjs";

//controller
import {
  createUser,
  getFollowingUsers,
  getUserLogs,
  logout,
  signin,
} from "../controllers/userController.mjs";

//middleware
import requestIp from "request-ip";
import useragent from "express-useragent";
// import saveLogInfo from "../middleware/logger/saveLogInfo.mjs";
import { followUser, unFollowUser } from "../controllers/profileController.mjs";

const router = express.Router();

const requireAuth = passport.authenticate("jwt", { session: false }, null);
//When a request comes to a protected route, this middleware will be called first, 
//and it will attempt to authenticate the request using the JWT strategy. 
//If the JWT is valid, the request will proceed; otherwise, it will be rejected.

//for get routes
router.get("/following", getFollowingUsers)

//for post routes
router.post(
  "/signup",
  signupSigninLimiter,
  addUserValidator,
  addUserValidationHandler,
  createUser
);
//added client ip address to request object as req.clientIp
//added useragent to keep track of browsers and device
router.post(
  "/signin",
  signupSigninLimiter,
  requestIp.mw(),
  useragent.express(),
  signin
);
router.post("/logout", logout);

//patch routes
router.patch("/:id/follow", requireAuth, followLimiter, followUser);
router.patch("/:id/unfollow", requireAuth, followLimiter, unFollowUser);

//get routes
router.get("/getlogs", getUserLogs);

export default router;


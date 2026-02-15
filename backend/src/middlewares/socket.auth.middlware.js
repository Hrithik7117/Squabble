import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const socketAuthMiddleware = async (socket, next) => {
 


  try {
    // token sent from frontend in auth object
    const token = socket.handshake.headers.cookie
  ?.split("; ")
  .find((row) => row.startsWith("token="))
  ?.split("=")[1];


    if (!token) {
      console.log("Socket connection rejected: No token provided");
      return next(new Error("Unauthorized - No Token Provided"));
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      console.log("Socket connection rejected: Invalid token");
      return next(new Error("Unauthorized - Invalid Token"));
    }

    // fetch user from DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.log("Socket connection rejected: User not found");
      return next(new Error("User not found"));
    }

    // attach user to socket
    socket.user = user;
    socket.id = user._id.toString();

    console.log(`Socket authenticated for user: ${user.fullName} (${user._id})`);

    next();
  } catch (error) {
    console.log("Error in socket authentication:", error.message);
    next(new Error("Unauthorized - Authentication failed"));
  }
};

export { socketAuthMiddleware };

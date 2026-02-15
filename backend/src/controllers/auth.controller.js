import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import { generateToken } from "../services/auth.service.js";
import cloudinary from "../lib/cloudinary.js";





const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be atleast 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const isUserAlreadyExists = await User.findOne({ email: normalizedEmail });

    if (isUserAlreadyExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      message: "User created Successfully",
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName
      }
    });

  } catch (error) {
    console.log("Error in signup controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const login=async(req,res)=>{
  const {email, password}=req.body

  try {
  // email = email.toLowerCase()

    const user=await User.findOne({email})

    if (!user) {
      return res.status(401).json({message: "Invalid email or password"})
    }

    const isPasswordValid=await bcrypt.compare(password,user.password)

   if(!isPasswordValid) return  res.status(401).json({message: "Invalid email or password"})

    const token=generateToken(user)

    res.cookie("token",token,{
      httpOnly:true,
      secure:process.env.NODE_ENV === "production",
      sameSite: "strict",
       maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
      message: "User logged In",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email:user.email,
        profilePic:user.profilePic,
      }
    })
  } catch (error) {
    console.log("Error in Login controller".error)
    res.status(500).json({message: "Internal server error"})
  }
}

const logout=async(req,res)=> {
res.clearCookie("token")

res.status(200).json({message: "Logged Out Sucessfully"})
}

const updateProfile=async (req,res) => {

  try {
    
  
  const{profilePic}=req.body;

  if(!profilePic) 
    {
      return res.status(400).json({message : "Profile pic is required"})
    }

    const userId=req.user._id

    

   const uploadResponse= await cloudinary.uploader.upload(profilePic, {
    folder: "profile_pics"})

   const updatedUser=await User.findByIdAndUpdate(
    userId,
    {profilePic:uploadResponse.secure_url},
     {new:true}
    ).select("-password");

    res.status(200).json(updatedUser)

    } catch (error) {
    console.log("Error in update profile",error);
    res.status(500).json({message: 'internal server error'})
    
  }


}

export {signup, login,logout, updateProfile}

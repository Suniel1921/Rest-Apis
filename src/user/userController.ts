import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  //validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
    // return res.json({message: "All fields are required !"})
  }

  //database call ()check user exit or not
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const error = createHttpError(400, "user already exit with this email");
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "Error while getting user"));
  }

  //password hash
  const hashedPassword = await bcrypt.hash(password, 10);
  let newUser: User;
  try {
    newUser = await userModel.create({ name, email, password: hashedPassword });
  } catch (error) {
    return next(createHttpError(500, "Error while creating user"));
  }

  try {
    //token genertion jwt
    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });

    //response
    res.status(201).json({ accessToken: token });
  } catch (error) {
    return next(createHttpError(500, "Error while singing the jwt token"));
  }
};

// user login route

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }

  //   try {
  //     const user = await userModel.findOne({email});
  //     if(!user){
  //         return next(createHttpError(404, 'User not found !'))
  //     }

  //   } catch (error) {
  //     return next(createHttpError(500, 'Error while logging'))

  //   }
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(createHttpError(404, "User not found !"));
  }

  //check password match or not
  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch){
    return next(createHttpError(400, 'Invalid Creadentials'))
  }

  //create access token
  const token = sign({ sub: user._id }, config.jwtSecret as string, {
    expiresIn: "7d",
    algorithm: "HS256",
  });


  res.status(200).json({message: 'Login successfully',accessToken : token});
};

export { createUser, loginUser };

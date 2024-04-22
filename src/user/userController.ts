import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from 'bcrypt';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  //validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
    // return res.json({message: "All fields are required !"})
  }

  //database call ()check user exit or not
  const user = await userModel.findOne({email});
  if(user){
    const error = createHttpError(400, 'user already exit with this email');
    return next(error)
  }

  //password hash
  const hashedPassword = bcrypt.hash(password, 10);

  //prorcess
  //response
  res.json({ message: "user created" });
};

export { createUser };

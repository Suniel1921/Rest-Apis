import { NextFunction, Request, Response } from "express";

const createUser = async (req: Request, res: Response, next: NextFunction)=>{
    res.json({message: "user registerd by sunil"})

}


export {createUser}
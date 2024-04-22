// import express from 'express';
// import { createBook } from './bookController';
// import multer from 'multer';
// import path from 'node:path';
// const bookRouter = express.Router();

// // file uplaod
// const upload = multer({
//     dest: path.resolve(__dirname, '../../public/data/uploads'),
//     limits: {fileSize: 3e7} //3e7 means 30mb

// })

// bookRouter.post('/', upload.fields([
//     {name : "coverImage", maxCount: 1},
//     {name: "file", maxCount: 1}
// ]) , createBook);


// export default bookRouter;


import express, { Request, Response, NextFunction } from 'express';
import { createBook } from './bookController';
import multer from 'multer';
import path from 'path';
import authenticates from '../middlewares/authenticates';

const bookRouter = express.Router();

// File upload configuration
const upload = multer({
    dest: path.resolve(__dirname, '../../public/data/uploads'),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware to check file size
const fileSizeLimit = (req: Request, res: Response, next: NextFunction) => {
    // Check if any of the uploaded files exceed the size limit
    if (Array.isArray(req.files) && req.files.some((file: Express.Multer.File) => file.size > 5 * 1024 * 1024)) {
        return res.status(400).send('File size exceeds the limit of 5MB.');
    }
    next();
};

// Route for uploading books
bookRouter.post('/', authenticates, upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 }
]), fileSizeLimit, createBook);

export default bookRouter;

import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";
import { AuthRequest } from "../middlewares/authenticates";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  try {
    // Log the uploaded files
    console.log("Uploaded files:", req.files);

    // Extract cover image information
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1); // Get the file extension

    // Prepare file paths
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      fileName
    );

    // Upload cover image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName, // Use the original filename
      folder: "book-cover", // Save in the "book-cover" folder
      format: coverImageMimeType, // Specify the file format
    });

    // Extract PDF file information
    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );

    // Upload PDF file to Cloudinary
    const bookPdfFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw", // Treat as raw file
        filename_override: bookFileName, // Use the original filename
        folder: "book-pdfs", // Save in the "book-pdfs" folder
        format: "pdf", // Specify the file format (PDF)
      }
    );

    // Log upload results
    console.log("Cover image upload result:", uploadResult);
    console.log("PDF file upload result:", bookPdfFileUploadResult);

    const _req = req as AuthRequest;

    const newBook = await bookModel.create({
      title,
      genre,
      author: _req.userId,
      coverImage: uploadResult.secure_url,
      file: bookPdfFileUploadResult.secure_url,
    });

    //Delete temp file (public/data/upload file)
    await fs.promises.unlink(filePath);
    await fs.promises.unlink(bookFilePath);

    res.status(201).json({
      id: newBook._id,
      messag: "file uplaoded successfully",
      success: true,
    });
  } catch (error) {
    // If an error occurs during any step, catch it here
    console.error("Error while processing book creation:", error);
    // Respond with an error message
    return next(
      createHttpError(500, "An error occurred while uploading the files")
    );
  }
};

//update books

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const bookId = req.params.bookId;

  const book = await bookModel.findOne({ _id: bookId });
  if (!book) {
    return next(createHttpError(404, "Book not found"));
  }

  const _req = req as AuthRequest;

  if (book.author.toString() !== _req.userId) {
    return next(
      createHttpError(
        403,
        "Unauthorized access! you cannot update others book."
      )
    );
  }

  //check if iamge filed is exits
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  let completeCoverImage = "";
  if (files.coverImage) {
    const filename = files.coverImage[0].filename;
    const coverMimeType = files.coverImage[0].mimetype.split("/").at(-1);

    //send files to cloudinary
    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads/" + filename
    );
    completeCoverImage = filename;
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: completeCoverImage,
      folder: "book-covers",
    });

    completeCoverImage = uploadResult.secure_url;
    await fs.promises.unlink(filePath);
  }

  //check if file filed is exits
  let completeFileName = "";
  if (files.file) {
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads/" + files.file[0].filename
    );

    const bookFileName = files.file[0].filename;
    completeFileName = bookFileName;

    const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: completeFileName,
      folder: "book-covers",
      format: "pdf",
    });

    completeFileName = uploadResultPdf.secure_url;
    await fs.promises.unlink(bookFilePath);
  }

  const updatedBook = await bookModel.findByIdAndUpdate(
    // bookId,
    { _id: bookId },
    {
      title: title,
      genre: genre,
      coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
      file: completeFileName ? completeFileName : book.file,
    },
    { new: true }
  );
  res.json({ message: "book updated successfull", updatedBook });
};



//get book
const getListBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await bookModel.find();
        res.json(book)
        
        res.json({})
    } catch (error) {
        return next(createHttpError(500, 'Error while getting the book list'))
        
    }


}


//get single book
const getSingleBook = async (req: Request, res: Response, next: NextFunction) => {

    const bookId = req.params.bookId;
    try {
        const book = await bookModel.findOne({_id: bookId});
        if(!book){
            return next(createHttpError(404, 'Book not found'));
        }
        return res.json(book)
    } catch (error) {
        return next(createHttpError(500, 'Error while getting the single book'))

        
    }


}


export { createBook, updateBook , getListBook, getSingleBook};

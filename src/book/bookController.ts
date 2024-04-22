import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from 'node:fs';

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    const {title, genre} = req.body;
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

    const newBook = await bookModel.create({
      title,
      genre,
      author: "6626144ba8455da99704061b",
      coverImage: uploadResult.secure_url,
      file: bookPdfFileUploadResult.secure_url,
    });


    //Delete temp file (public/data/upload file)
    await fs.promises.unlink(filePath);
    await fs.promises.unlink(bookFilePath)
   

    res.status(201).json({id: newBook._id, messag: "file uplaoded successfully", success: true });

  } catch (error) {
    // If an error occurs during any step, catch it here
    console.error("Error while processing book creation:", error);
    // Respond with an error message
    return next(
      createHttpError(500, "An error occurred while uploading the files")
    );
  }
};

export { createBook };

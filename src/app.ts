import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import createHttpError from "http-errors";

const app = express();

//routes
//https methods -- GET, POST, PUT, PATCH, DELETE

app.get("/", (req, res, next) => {
  res.json({ message: "welcome to the ebook api" });
});

//Global error handler --- make sure global erro handler sab se last me ho
app.use(globalErrorHandler);

export default app;

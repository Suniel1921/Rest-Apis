import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import createHttpError from "http-errors";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";

const app = express();
app.use(express.json());

//routes
//https methods -- GET, POST, PUT, PATCH, DELETE

app.get("/", (req, res, next) => {
  res.json({ message: "welcome to the ebook api" });
});

app.use('/api/users',userRouter);
app.use('/api/books', bookRouter);

//Global error handler --- make sure global erro handler sab se last me ho
app.use(globalErrorHandler);

export default app;

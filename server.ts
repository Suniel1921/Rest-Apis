import app from "./src/app";
import { config } from "./src/config/config";
import connectDB from "./src/config/db";

const startServer = async () => {
       await connectDB(); //connect database
  // const port = process.env.PORT || 3000;
  const port = config.port || 3000;

  app.listen(port, () => {
    console.log(`Server is running on port no : ${port}`);
  });
};

startServer();

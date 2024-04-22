import app from './src/app';

const startServer = ()=>{
       try {
              const port = process.env.PORT || 3000;

              app.listen(port, ()=>{
                     console.log(`Server is running on port no : ${port}`);
              })
              
       } catch (error) {
              console.log("Something went wrong");
              
       }
}

startServer();
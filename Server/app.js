import express from 'express';
import  googleRouter from './dist/routes/googleAuth.js';
import emailRouter from './dist/routes/emailAuth.js'
import quizeRouter from './dist/routes/quiz.js'
import cors from 'cors'
import connect from './dist/config/database.js'
import {auth} from './dist/middleware/auth.js'
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import cloudinaryConnect from './dist/config/cloudinary.js'
import { createServer } from "http";
import { Server } from "socket.io";
import {initializeSocket} from './dist/services/socketService.js'
import userRouter from './dist/routes/user.js'

const app = express();
const server = createServer(app);
const port = process.env.PORT || 4000;
connect();
cloudinaryConnect();

app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );

app.use(express.json());
app.use(cookieParser())
app.use(
  fileUpload({
      useTempFiles:true,
      tempFileDir:"/tmp",
  })
)
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ success: false, error: "Internal Server Error" });
});


app.use("/",googleRouter);
app.use("/",emailRouter);
app.use('/',userRouter)
app.use(auth);
app.use('/',quizeRouter);



const io = new Server(server,{
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    reconnectionAttempts: 1
  },
});
initializeSocket(io);

server.listen(port ,()=>{
    console.log(`Server is running on port ${port}`)
})
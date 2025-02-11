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
import { config } from 'dotenv';
config();

const app = express();
const server = createServer(app);
const port = process.env.PORT || 4000;
connect();
cloudinaryConnect();
app.set('trust proxy',1)
app.use(
    cors({
      origin: process.env.FRONTEND_URL,
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

app.get('/',(req,res) =>{
  console.log("Welcome to Quiz App");
  return res.send('Welcome to Quiz App');
})

app.use("/",googleRouter);
app.use("/",emailRouter);
app.use('/',userRouter)


const io = new Server(server,{
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    reconnectionAttempts: 1,
    credentials:true
  },
});
initializeSocket(io);


app.use(auth);
app.use('/',quizeRouter);


server.listen(port ,()=>{
    console.log(`Server is running on port ${port}`)
})
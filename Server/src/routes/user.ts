import { Router } from "express";
import isEmpty from "../utils/isEmpty.js";
import * as userController from '../controller/user.js'

const userRouter = Router();


userRouter.post("/checkValidPin",async (req, res)=>{
    const {pin} = req.body;
    if(isEmpty(pin)){
        res.status(400).json({
            success:false,
            message:"pin is required"
        })
    }
    else{
        const data = await userController.checkValidPin(pin);
        data.success ? res.json(data) : res.status(404).json(data);
    }
})

userRouter.get('/getScore', async( req, res) =>{
    const questionId: string = typeof req.query.questionId === "string" ? req.query.questionId : "";
    const time: string = typeof req.query.time === "string" ? req.query.time : "";
    let ids: string[] = 
  typeof req.query.ids === "string"
    ? [req.query.ids] 
    : Array.isArray(req.query.ids) && req.query.ids.every(id => typeof id === "string")
      ? req.query.ids
      : [];
  if (isEmpty(questionId,time,ids)) {
     res.status(400).json({ error: "No IDs provided" });
  }else{
    const selectedIds: string[] = Array.isArray(ids) ? ids : [ids];
    const data = await userController.userScore(questionId,time,selectedIds);
    data.success ? res.json(data):res.status(404).json(data);
  }
})


export default userRouter;
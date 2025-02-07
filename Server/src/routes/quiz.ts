import * as quizController from "../controller/quiz.js";
import { Router } from "express";
import isEmpty from "../utils/isEmpty.js";
import { AuthRequest } from "../middleware/auth.js";
import { UploadedFile } from "express-fileupload";
const quizRouter = Router();

quizRouter.post("/createQuiz", async (req: AuthRequest, res) => {
  const { id } = req.user!;
  if (isEmpty(id)) {
    res.status(400).json({
      success: false,
      message: "All field are require",
    });
  } else {
    const data = await quizController.createQuiz(id);
    data.success ? res.json(data) : res.status(404).json(data);
  }
});

quizRouter.delete("/deleteQuiz", async (req: AuthRequest, res) => {
  const { id } = req.user!;
  const quizId: string = req.query.quizId as string;
  if (isEmpty(id, quizId)) {
    res.status(400).json({
      success: false,
      message: "All field are require",
    });
  } else {
    const data = await quizController.deleteQuiz(id, quizId);
    data.success ? res.json(data) : res.status(404).json(data);
  }
});

quizRouter.get("/allQuiz", async (req: AuthRequest, res) => {
  const { id } = req.user!;
  if (isEmpty(id)) {
    res.status(400).json({
      success: false,
      message: "All field are require",
    });
  } else {
    const data = await quizController.allQuiz(id);
    data.success ? res.json(data) : res.status(404).json(data);
  }
});

quizRouter.post("/updateTitle", async (req: AuthRequest, res) => {
  const { id } = req?.user!;
  const { title, quizId } = req.body;

  if (isEmpty(id, title, quizId)) {
    res.status(400).json({
      success: false,
      message: "All fields are require",
    });
  } else {
    const data = await quizController.updateTitle(id,quizId,title);
    data.success ? res.json(data) : res.status(404).json(data);
  }
});

quizRouter.post("/questionsData", async (req: AuthRequest, res) => {
  const { id } = req.user!;
  const { quizId } = req.body;
  if (isEmpty(id, quizId)) {
    res.status(400).json({
      success: false,
      message: "All field are require",
    });
  } else {
    const data = await quizController.questionData(id, quizId);
    data.success ? res.json(data) : res.status(404).json(data);
  }
});

quizRouter.post("/updateQuestion", async (req: AuthRequest, res) => {
  
  const { id: questionId,quizId } = req.body;
  if (isEmpty(questionId, quizId)) {
    res.status(400).json({
      success: false,
      message: "questionId not found",
    });
  } else {
    if (questionId.substring(0, questionId.length - 1) == "dummy") {
      const { question, selectedType, questionTime, options } = req.body;
      const parseOptions = JSON.parse(options);
      let questionImg=null;
      let optionImgs=null;
      if (req.files) {
        questionImg = req.files.questionImg as UploadedFile;
        optionImgs = req.files.optionImgs;
      }

      if (isEmpty(question, selectedType, questionTime, parseOptions)) {
        res.status(400).json({
          success: false,
          message: "All field are required",
        });
      } else {
        const data = await quizController.createQuestion(
          quizId,
          question,
          selectedType,
          questionTime,
          parseOptions,
          questionImg,
          optionImgs
        );
        data.success ? res.json(data) : res.status(404).json(data);
      }
    } else {
      console.log("pending..")
      
    }
  }
});

quizRouter.get("/allQuestionIds", async (req: AuthRequest, res) => {
  const { id } = req.user!;
  const quizId: string = typeof req.query.quizId === "string" ? req.query.quizId : "";
  if (isEmpty(id)) {
    res.status(400).json({
      success: false,
      message: "All field are require",
    });
  } else {
    const data = await quizController.questionsIds(id,quizId);
    data.success ? res.json(data) : res.status(404).json(data);
  }
});

quizRouter.post("/playQuiz", async (req: AuthRequest, res) => {

  const {quizId} = req.body;

  if(isEmpty(quizId)){
    res.status(400).json({
      success:false,
      message:"All fields are require"
    })
  }
  else{

    const data = await quizController.playQuiz(quizId);
    data.success ? res.json(data):res.status(404).json(data);
  }
})

quizRouter.get("/quizPinAndTitle", async (req: AuthRequest, res) =>{
  const quizId: string = typeof req.query.quizId === "string" ? req.query.quizId : "";
  if(isEmpty(quizId)){
    res.status(400).json({
      success:false,
      message:"All fields are require"
    })
  }
  else{
    const data = await quizController.quizPinAndTitle(quizId);
    data.success ? res.json(data):res.status(404).json(data);
  }
})

quizRouter.get("/questionDetails", async (req:AuthRequest, res) =>{
    const questionId: string = typeof req.query.questionId === "string" ? req.query.questionId : "";
  if(isEmpty(questionId)){
    res.status(400).json({
      success:false,
      message:"All fields are require"
    })
  }
  else{
    const data = await quizController.questionDetails(questionId);
    data.success ? res.json(data):res.status(404).json(data);
  }
})

export default quizRouter;














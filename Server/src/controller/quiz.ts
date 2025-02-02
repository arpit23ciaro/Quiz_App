import assert, { AssertionError } from "assert";
import { Quiz, QuizDocument } from "../models/Quiz.js";
import { Host } from "../models/Host.js";
import mongoose, { mongo } from "mongoose";
import { QuizItem, QuizItemDocument } from "../models/QuizItem.js";
import { Option } from "../models/Option.js";
import { UploadedFile } from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";

const isPopulated = (
  questions: mongoose.Types.ObjectId | QuizDocument
): questions is QuizDocument =>
  (questions as QuizDocument).questions !== undefined;

async function uploadFileToCloudinary(
  file: UploadedFile,
  folder: string,
  quality: number
) {
  const resourceType: "auto" | "image" | "video" | "raw" = "auto";

  const options = quality
    ? { folder, quality, resource_type: resourceType }
    : { folder, resource_type: resourceType };

  const data = await cloudinary.uploader.upload(file.tempFilePath, options);
  return data;
}

const createQuiz = async (userId: string) => {
  try {
    const newQuiz = await Quiz.create({ title: "Untitled Quiz" });

    assert(newQuiz, "Something went wrong for creating quiz");

    await Host.findByIdAndUpdate(
      { _id: userId },
      {
        $push: {
          quizes: newQuiz._id,
        },
      }
    );
    return {
      success: true,
      message: "Quiz created successfully",
      data: newQuiz,
      title: newQuiz.title,
    };
  } catch (error) {
    if (error instanceof AssertionError)
      return {
        status: false,
        msg: error.message,
      };
    return {
      status: false,
      msg: "Error",
    };
  }
};

const allQuiz = async (userId: string) => {
  try {
    const host = await Host.findById(userId).populate("quizes").exec();
    return {
      success: true,
      message: "All quiz fetched successfully",
      data: host?.quizes,
    };
  } catch (error) {
    if (error instanceof AssertionError)
      return {
        success: false,
        msg: error.message,
      };
    return {
      success: false,
      msg: "Error",
    };
  }
};

const deleteQuiz = async (userId: string, quizId: string) => {
  try {
    const host = await Host.findByIdAndUpdate(userId, {
      $pull: {
        quizes: quizId,
      },
    });

    assert(host, "Something wrong while updating the quiz details");

    await Quiz.deleteOne({ _id: quizId });

    return {
      success: true,
      message: "Quiz deleted successfully",
    };
  } catch (error) {
    console.log(error);
    if (error instanceof AssertionError)
      return {
        success: false,
        msg: error.message,
      };
    return {
      success: false,
      msg: "Error",
    };
  }
};

const questionData = async (userId: string, quizId: string) => {
  try {
    const data = await Host.findById(userId)
      .populate({
        path: "quizes",
        populate: {
          path: "questions",
          match: {
            $or: [
              { options: { $exists: true, $ne: [] } },
              { options: { $exists: false } },
            ],
          },
          populate: {
            path: "options",
          },
        },
      })
      .exec();
    assert(data, "User not found");

    const existQuiz = data.quizes?.some(
      (quiz) => quiz?._id.toString() === quizId
    );

    assert(existQuiz, "quizId is not valid");

    const quiz = data.quizes?.filter((quiz) => quiz?._id.toString() === quizId);
    let que;
    let title;

    if (quiz && isPopulated(quiz[0])) {
      que = quiz[0].questions;
      title = quiz[0].title;
    }

    return {
      success: true,
      message: "Data fetched successfully",
      questions: que,
      title: title,
    };
  } catch (error) {
    console.log(error);
    if (error instanceof AssertionError)
      return {
        status: false,
        message: error.message,
      };
    return {
      status: false,
      message: "Error",
    };
  }
};

const updateQuestion = async (userId: string, quizId: string) => {
  try {
  } catch (error) {
    console.log(error);
    if (error instanceof AssertionError)
      return {
        success: false,
        message: error.message,
      };
    return {
      success: false,
      message: "Error",
    };
  }
};

const createQuestion = async (
  quizId: string,
  question: string,
  selectedType: string,
  questionTime: string,
  parseOptions: {
    id: string;
    text: string;
    isSelect: boolean;
    optionImg: string;
  }[],
  questionImg: UploadedFile | null,
  optionImgs: UploadedFile | UploadedFile[] | null
) => {
  try {
    const optionImagesArray: UploadedFile[] = optionImgs
      ? Array.isArray(optionImgs)
        ? optionImgs
        : [optionImgs]
      : [];

    let questionImageData = null;
    if (questionImg != null)
      questionImageData = await uploadFileToCloudinary(
        questionImg,
        "Quiz_App",
        30
      );

    const optionPromises = parseOptions.map(async (option) => {
      let optionImageData = null;

      if (optionImagesArray) {
        const matchingImg = optionImagesArray.find(
          (img) => img.name.substring(img.name.length - 6) == option.id
        );
     
        if (matchingImg) {
          optionImageData = await uploadFileToCloudinary(
            matchingImg,
            "Quiz_App",
            30
          );
        }
      }
    

      const ans = await Option.create({
        text: option.text,
        isSelect: option.isSelect,
        optionImgId: optionImageData?.public_id || null,
        optionImg: optionImageData?.secure_url || null,
      });

      return ans._id;
    });

    const optionIds = await Promise.all(optionPromises);

    const questionData = await QuizItem.create({
      question: question,
      questionType: selectedType,
      duration: questionTime,
      options: optionIds,
      questionImg: questionImageData?.secure_url,
      questionImgId: questionImageData?.public_id,
    });

    const quiz = await Quiz.findByIdAndUpdate(quizId, {
      $push: {
        questions: questionData._id,
      },
    });

    return {
      success: true,
      message: "successfully",
    };
  } catch (error) {
    console.log(error);
    if (error instanceof AssertionError)
      return {
        success: false,
        message: error.message,
      };
    return {
      success: false,
      message: "Error",
    };
  }
};


const updateTitle = async (userId: string, quizId: string, title: string) => {
  try {
    const hostData = await Host.findById(userId);

    assert(hostData, "Host not found");

    const quizData = await Quiz.findByIdAndUpdate(
      quizId,
      { title: title },
      { new: true }
    );

    assert(quizData, "Quiz not found");

    return {
      success: true,
      message: "Title updated successfully",
      title: quizData.title,
    };
  } catch (error) {
    console.log(error);
    if (error instanceof AssertionError)
      return {
        success: false,
        message: error.message,
      };
    return {
      success: false,
      message: "Error",
    };
  }
};

const playQuiz = async (quizId: string) => {
  try {
    let pin;
    do {
      pin = Math.floor(100000 + Math.random() * 900000);
    } while (await Quiz.findOne({ pin }));
    const quiz = await Quiz.findByIdAndUpdate(quizId, { pin: pin });
    assert(quiz, "Something went wrong while creating the pin of quiz");

    return {
      success: true,
      message: "Quiz pin created successfully",
      pin: quiz.pin,
    };
  } catch (error) {
    console.log(error);
    if (error instanceof AssertionError)
      return {
        success: false,
        message: error.message,
      };
    return {
      success: false,
      message: "Error",
    };
  }
};

const quizPinAndTitle = async (quizId: string) => {
  try {
    const quiz = await Quiz.findById(quizId, "title pin");
    assert(quiz, "Something went wrong while creating the pin of quiz");

    return {
      success: true,
      message: "Quiz pin created successfully",
      pin: quiz.pin,
      title: quiz.title,
    };
  } catch (error) {
    console.log(error);
    if (error instanceof AssertionError)
      return {
        success: false,
        message: error.message,
      };
    return {
      success: false,
      message: "Error",
    };
  }
};

const questionsIds = async (userId: string, quizId: string) => {
  try {
    const user = await Host.findById(userId);
    assert(user,"user not found");

    const quiz = await Quiz.findById(quizId);
    assert(quiz, "Quiz not found");

    const questionIds = quiz.questions?.map((id) => id.toString());
   

    return {
      success:true,
      message:"Question Id fetched successfully",
      questionIds:questionIds
    }
  } catch (error) {
    console.log(error);
    if (error instanceof AssertionError)
      return {
        success: false,
        message: error.message,
      };
    return {
      success: false,
      message: "Error",
    };
  }
};

const questionDetails = async (questionId:string)=>{
  try{
      const question = await QuizItem.findById(new mongoose.Types.ObjectId(questionId)).populate("options");

      assert(question,"Question not found");

      return{
        success:true,
        message:"Question data fetched successfully",
        questionData:question
      }

  }
  catch(error){
    console.log(error);
    if (error instanceof AssertionError)
      return {
        success: false,
        message: error.message,
      };
    return {
      success: false,
      message: "Error",
    };
  }
}

export {
  createQuiz,
  allQuiz,
  deleteQuiz,
  questionData,
  updateQuestion,
  createQuestion,
  playQuiz,
  quizPinAndTitle,
  updateTitle,
  questionsIds,
  questionDetails,
};

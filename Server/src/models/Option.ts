import mongoose, { Schema } from "mongoose";

export interface OptionDocument extends mongoose.Document {
  text: string;
  optionImgId?:string | null;
  optionImg?: string | null;
  isSelect:string;
}

const optionSchema = new Schema({
  text: {
    type: String,
    require: true,
  },
  isSelect:{
    type:String,
  },
  optionImgId:{
    type:String || null,
  },
  optionImg: {
    type: String || null,
  },
});

export const Option = mongoose.model<OptionDocument>(
  "Option",
  optionSchema
);

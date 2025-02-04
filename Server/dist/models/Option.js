import mongoose, { Schema } from "mongoose";
const optionSchema = new Schema({
    text: {
        type: String,
        require: true,
    },
    isSelect: {
        type: String,
    },
    optionImgId: {
        type: String || null,
    },
    optionImg: {
        type: String || null,
    },
});
export const Option = mongoose.model("Option", optionSchema);

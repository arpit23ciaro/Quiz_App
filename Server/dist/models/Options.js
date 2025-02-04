import mongoose, { Schema } from "mongoose";
const optionSchema = new Schema({
    text: {
        type: String,
        require: true,
    },
    optionImg: {
        type: String,
    },
});
export const Option = mongoose.model("Option", optionSchema);

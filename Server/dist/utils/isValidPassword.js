import { regex } from "../constants/regex.js";
const isValidPassword = (password) => {
    if (password.length < 12)
        return "Password must be at least 12 characters long";
    else if (password.length > 64)
        return "Password must be at most 64 characters long";
    else if (!regex.lowercase.test(password))
        return "Password must be at least one lowercase";
    else if (!regex.uppercase.test(password))
        return "Password must be at least one uppercase";
    else if (!regex.number.test(password))
        return "Passwor must be at least one number";
    else if (!regex.specialCharacter.test(password))
        return "Password must be at least one special character";
    else
        return "";
};
export default isValidPassword;

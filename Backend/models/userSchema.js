import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "member",
    },
    teams: {
        type: [String],
        default: ["default"],
    },
    skills: {
        type: [String],
        default: ["general"],
    },
    phone: {
        type: String,
        default: "-",
    },
    profilePicture: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/10337/10337609.png",
    },
}, {timestamps: true});

userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        } catch (error) {
            return next(error);
        }
    }
    next();
});

const User = mongoose.model("User", userSchema);
export default User;
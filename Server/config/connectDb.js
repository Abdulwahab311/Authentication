import mongoose from "mongoose";

export const connect = async (DATABASE_URL) => {
    try {
        await mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to the database!");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1); // Exit process with failure
    }
};

import mongoose from "mongoose";
import chalk from "chalk";

const MONGODB_URI = "mongodb://localhost:27017/cli_app";

const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(chalk.green("📙 MongoDB connected successfully"));
  } catch (error) {
    console.error(chalk.red("MongoDB connection error:\n"), error.message);
    process.exit(1);
  }
};

export default connectDatabase;

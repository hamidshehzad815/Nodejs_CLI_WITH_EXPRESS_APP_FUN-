import chalk from "chalk";

const loginPrompt = [
  {
    type: "input",
    name: "email",
    message: chalk.cyan("Enter your email: "),
    validate: (input) => {
      if (!input) return chalk.red(`email is required`);
      return true;
    },
  },
  {
    type: "password",
    name: "password",
    message: chalk.cyan("Enter your Password"),
    mask: "*",
    validate: (input) => {
      if (!input) return chalk.red(`password is required`);
      return true;
    },
  },
];

const signupPrompt = [
  {
    type: "input",
    name: "username",
    message: chalk.cyan("Enter your username: "),
    validate: (input) => {
      if (!input) {
        return "username is required";
      } else if (input.length < 3) {
        return "username must be greater than 3 characters";
      }
      return true;
    },
  },
  {
    type: "input",
    name: "email",
    message: chalk.cyan("Enter your email: "),
    validate: (input) => {
      if (!input) {
        return "Email is required";
      }
      return true;
    },
  },
  {
    type: "password",
    name: "password",
    message: chalk.cyan("Enter your password: "),
    mask: "*",
    validate: (input) => {
      if (!input) {
        return "Password is required";
      } else if (input.length < 5) {
        return "Password must be 5 character long";
      }
      return true;
    },
  },
];

const mainMenuPrompt = [
  {
    type: "list",
    name: "choice",
    message: chalk.cyan("What u want to do"),
    choices: ["Login", "Signup", "Exit"],
  },
];

const userActionPrompt = [
  {
    type: "list",
    name: "action",
    message: "What action u want to perform",
    choices: ["Profile", "Logout", "Exit"],
    validate: (input) => {
      if (!input) {
        return `Select atleast one`;
      }
      return true;
    },
  },
];

const continuePrompt = [
  {
    type: "input",
    message: chalk.blue("Press enter to continue"),
  },
];

export {
  loginPrompt,
  signupPrompt,
  mainMenuPrompt,
  userActionPrompt,
  continuePrompt,
};

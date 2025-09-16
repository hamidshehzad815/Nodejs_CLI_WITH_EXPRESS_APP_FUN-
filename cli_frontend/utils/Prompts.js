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
    name: "firstName",
    message: chalk.cyan("Enter your firstname: "),
    validate: (input) => {
      if (!input) {
        return "firstname is required";
      } else if (input.length <= 2) {
        return "firstname must be greater than 2 characters";
      }
      return true;
    },
  },
  {
    type: "input",
    name: "lastName",
    message: chalk.cyan("Enter your lastname: "),
    validate: (input) => {
      if (!input) {
        return "lastname is required";
      } else if (input.length <= 2) {
        return "lastname must be greater than 2 characters";
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
      } else if (input.length < 8) {
        return "Password must be 8 character long";
      }
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (passwordRegex.test(input)) {
        return true; // ✅ valid
      } else {
        return "Password must be at least 8 characters with uppercase, lowercase, number and special character";
      }
    },
  },
  {
    type: "input",
    name: "phone",
    message: chalk.cyan("Enter your phone number (type ? for help): "),
    validate: (input) => {
      if (!input) {
        return "phone number is required";
      }
      if (input === "?") {
        return 'Format: Optional "+" sign, followed by 1–16 digits, no leading zero (e.g. +1234567890)';
      }
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (phoneRegex.test(input)) {
        return true; // ✅ valid
      } else {
        return "Please enter a valid phone number";
      }
    },
  },
  {
    type: "input",
    name: "dateOfBirth",
    message: chalk.cyan("Enter your DOB(dd/mm/yyyy): "),
    validator: (input) => {
      if (!input) {
        return "DOB is required";
      }
      const [day, month, year] = input.split("/").map(Number);
      if (!day) return "Day is required";
      if (!month) return "Month is required";
      if (!year) return "Year is required";
      return true;
    },
  },
  {
    type: "input",
    name: "address",
    message: chalk.cyan("Enter your address (type ? for help): "),
    validate: (input) => {
      if (!input) {
        return "address is required";
      }
      if (input === "?") {
        return "Format: street city state country zipcode";
      }
      const fields = ["street", "city", "state", "country", "zipCode"];
      const values = input.split(" ");
      const missing = fields.find((_, i) => !values[i]);

      if (missing) {
        return `${missing} is required`;
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
    choices: ["Login", "Signup", "Forget Password", "Exit"],
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

const profilePrompt = [
  {
    type: "list",
    name: "choice",
    message: chalk.cyan("What u want to do"),
    choices: ["View Profile", "Update Profile", "Verify Email", "Back"],
  },
];

const updateProfile = [
  {
    type: "input",
    name: "firstName",
    message: chalk.cyan("Enter new firstname: "),
    validate: (input) => {
      if (input) {
        if (input.length <= 2)
          return "firstname must be greater than 2 characters";
      }

      return true;
    },
  },
  {
    type: "input",
    name: "lastName",
    message: chalk.cyan("Enter new lastname: "),
    validate: (input) => {
      if (input) {
        if (input.length <= 2) {
          return "lastname must be greater than 2 characters";
        }
      }
      return true;
    },
  },
  {
    type: "input",
    name: "phone",
    message: chalk.cyan("Enter new phone number (type ? for help): "),
    validate: (input) => {
      if (input) {
        if (input === "?") {
          return 'Format: Optional "+" sign, followed by 1–16 digits, no leading zero (e.g. +1234567890)';
        }
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (phoneRegex.test(input)) {
          return true; // ✅ valid
        } else {
          return "Please enter a valid phone number";
        }
      }
      return true;
    },
  },
  {
    type: "input",
    name: "address",
    message: chalk.cyan("Enter new address (type ? for help): "),
    validate: (input) => {
      if (input) {
        if (input === "?") {
          return "Format: street city state country zipcode";
        }
        const fields = ["street", "city", "state", "country", "zipCode"];
        const values = input.split(" ");
        const missing = fields.find((_, i) => !values[i]);

        if (missing) {
          return `${missing} is required`;
        }
      }
      return true;
    },
  },
];

const emailPrompt = [
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
];

const newPassword = [
  {
    type: "input",
    name: "newPassword",
    message: chalk.cyan("Enter your new password"),
    mask: "*",
    validate: (input) => {
      if (!input) {
        return "Password is required";
      } else if (input.length < 8) {
        return "Password must be 8 character long";
      }
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (passwordRegex.test(input)) {
        return true; // ✅ valid
      } else {
        return "Password must be at least 8 characters with uppercase, lowercase, number and special character";
      }
    },
  },
  {
    type: "input",
    name: "confirmedPassword",
    message: chalk.cyan("Confirm your new password"),
    mask: "*",
    validate: (input) => {
      if (!input) {
        return "Password is required";
      }
      return true;
    },
  },
];

const TokenPrompt = [
  {
    type: "input",
    name: "token",
    message: chalk.cyan("Enter token received through email: "),
    validate: (input) => {
      if (!input) return "Token is required";
      return true;
    },
  },
];
export const Prompts = {
  loginPrompt,
  signupPrompt,
  mainMenuPrompt,
  userActionPrompt,
  continuePrompt,
  profilePrompt,
  updateProfile,
  emailPrompt,
  newPassword,
  TokenPrompt,
};

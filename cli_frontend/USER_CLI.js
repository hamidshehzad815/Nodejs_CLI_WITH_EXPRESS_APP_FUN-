import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import figlet from "figlet";
import axios from "axios";
import {
  delay,
  clearScreen,
  runProgressBar,
  spinner,
} from "./utils/supportingFunctions.js";
import client from "./redisClient.js";

class User {
  constructor() {
    this.users = [];
  }

  async userChoice() {
    await inquirer
      .prompt([
        {
          type: "list",
          name: "choice",
          message: chalk.cyan("What u want to do"),
          choices: ["Login", "Signup", "Exit"],
        },
      ])
      .then(async (answer) => {
        if (answer.choice === "Login") {
          this.login();
        } else if (answer.choice === "Signup") {
          this.signup();
        } else if (answer.choice === "Exit") {
          this.exit();
        }
      });
  }

  async isLoggedin() {
    await client.connect();
    const raw = await client.get(`loggedIn`);
    const user = JSON.parse(raw);
    if (!user) return { success: false };
    return { success: true, user };
  }

  async login() {
    clearScreen();
    const isLogged = await this.isLoggedin();
    if (isLogged.success) {
      console.log(chalk.green(`Welcome ${isLogged.user.name}`));
      this.exit();
    } else {
      inquirer
        .prompt([
          {
            type: "input",
            name: "email",
            message: chalk.cyan("Enter your email: "),
            validate: (input) => {
              if (!input) {
                return chalk.red(`email is required`);
              }
              return true;
            },
          },
          {
            type: "password",
            name: "password",
            message: chalk.cyan("Enter your Password"),
            mask: "*",
            validate: (input) => {
              if (!input) {
                return chalk.red(`password is required`);
              }
              return true;
            },
          },
        ])
        .then(async (credentials) => {
          const res = await axios.post(
            `http://localhost:3000/users/login`,
            credentials
          );
          if (res.data.success) {
            const user = res.data.user;
            await client.set(`loggedIn`, JSON.stringify(user), { EX: 3600 });
            console.log(res.data);
          } else {
            console.log(res.data);
          }
        });
    }
    return;
  }

  async signup() {
    clearScreen();
    inquirer
      .prompt([
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
      ])
      .then(async (userInfo) => {
        const sp = await spinner("Signing...", "green", "circle");
        const res = await axios.post(
          "http://localhost:3000/users/signup",
          userInfo
        );
        if (res.data.success) {
          await runProgressBar("Storing User...", sp);
          console.log(chalk.green(res.data.msg));
        } else {
          sp.stop();
          console.log(chalk.red(res.data.msg));
        }
      });
  }
  async exit() {
    const sp = await spinner("Exiting...");
    await runProgressBar("Saving Data...", sp);
    process.exit(0);
  }
}

const user = new User();
user.userChoice();

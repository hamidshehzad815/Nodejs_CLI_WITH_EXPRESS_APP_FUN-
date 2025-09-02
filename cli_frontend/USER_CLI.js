import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import figlet from "figlet";
import axios from "axios";
import _ from "lodash";
import {
  delay,
  clearScreen,
  runProgressBar,
  spinner,
} from "./utils/supportingFunctions.js";
import client from "./redisClient.js";
import { banners } from "../cli_frontend/utils/banners.js";
import {
  loginPrompt,
  signupPrompt,
  mainMenuPrompt,
  userActionPrompt,
  continuePrompt,
} from "./utils/Prompts.js";

class CLI {
  constructor() {}

  async promptMainMenu() {
    clearScreen();
    let exit = false;

    banners.main();
    await inquirer.prompt(mainMenuPrompt).then(async (answer) => {
      if (answer.choice === "Login") {
        clearScreen();
        banners.login();
        await this.loginHandler();
        while (true) {
          const exit = await this.userChoice();
          if (exit) {
            break;
          }
        }
        exit = false;
      } else if (answer.choice === "Signup") {
        const success = await this.signup();
        await delay(2000);
        if (success) await this.loginHandler();
        exit = false;
      } else if (answer.choice === "Exit") {
        clearScreen();
        await this.exit();
        exit = true;
      }
    });
    return exit;
  }

  async userChoice() {
    clearScreen();
    let exit = false;
    await inquirer.prompt(userActionPrompt).then(async (choice) => {
      if (choice.action === "Profile") {
        await this.profileHandler();
      } else if (choice.action === "Logout") {
        if (!client.isOpen) {
          await client.connect();
        }
        await client.del("loggedIn");
        exit = true;
      } else if (choice.action === "Exit") {
        exit = true;
      }
    });
    return exit;
  }

  async profileHandler() {
    const sp = await spinner("Fetching Profile...", "green", "toggle10");
    const response = await this.isLoggedin();
    const profile = response.user;
    sp.succeed("Profile Fetched");
    sp.stop();
    console.table(_.pick(profile, ["name", "email"]));
    await inquirer.prompt(continuePrompt);
  }

  async isLoggedin() {
    if (!client.isOpen) {
      await client.connect();
    }
    const raw = await client.get(`loggedIn`);
    let response = JSON.parse(raw);
    if (!response) {
      response = {};
      response.success = false;
    } else response.redis = true;
    return response;
  }

  async loginHandler() {
    const response = await this.login();
    const sp = await spinner("Logging in...", "green", "circleHalves", 1000);
    if (response.success) {
      clearScreen();
      sp.succeed(chalk.greenBright(`✅ ${response.msg}`));

      console.log(
        chalk.blue.bold("🎉 Welcome, ") +
          chalk.yellowBright.bold(response.user.name) +
          chalk.blue.bold(" 🎉")
      );

      await delay(2000);
      if (!response.redis)
        await client.set(`loggedIn`, JSON.stringify(response), {
          EX: 3600,
        });
      sp.stop();
      return true;
    } else {
      sp.fail(response.msg);
      sp.stop();
      return false;
    }
  }

  async login() {
    clearScreen();
    const response = await this.isLoggedin();
    if (response.success) {
      return response;
    } else {
      banners.login();
      let backendResponse = null;
      await inquirer.prompt(loginPrompt).then(async (credentials) => {
        try {
          backendResponse = await axios.post(
            `http://localhost:3000/users/login`,
            credentials
          );
        } catch (err) {
          // Axios error handling
          if (err.response) {
            // Server responded with non-2xx
            backendResponse = {
              success: false,
              msg:
                err.response.data?.msg ||
                `Login failed (${err.response.status})`,
            };
          } else if (err.request) {
            // No response from server
            backendResponse = {
              success: false,
              msg: "No response from server. Check your connection.",
            };
          } else {
            // Something else went wrong
            backendResponse = {
              success: false,
              msg: `Error: ${err.message}`,
            };
          }
        }
      });
      return backendResponse.data;
    }
  }

  async signup() {
    clearScreen();
    banners.signup();
    let signupSuccess = false;

    await inquirer.prompt(signupPrompt).then(async (userInfo) => {
      const sp = await spinner("Signing up...", "green", "circleHalves");
      try {
        const res = await axios.post(
          "http://localhost:3000/users/signup",
          userInfo
        );

        if (res.data.success) {
          await runProgressBar("Storing User...", sp);
          console.log(chalk.green(res.data.msg));
          signupSuccess = true;
        } else {
          sp.stop();
          console.log(chalk.red(res.data.msg));
        }
      } catch (err) {
        sp.stop();

        if (err.response) {
          // Server responded with an error (e.g., 400, 401, 409)
          console.log(
            chalk.red(
              `❌ Signup failed: ${
                err.response.data?.msg || err.response.statusText
              }`
            )
          );
        } else if (err.request) {
          // No response received
          console.log(
            chalk.red("❌ No response from server. Please try again later.")
          );
        } else {
          // Other unexpected error
          console.log(chalk.red(`❌ Error: ${err.message}`));
        }
      }
    });
    return signupSuccess;
  }

  async exit() {
    let sp = await spinner("");
    await runProgressBar("Storing Data...", sp);
    sp = await spinner("Exiting...");
    sp.succeed("👋 GoodBye");
    sp.stop();
    return true;
  }
}

const cli = new CLI();
while (true) {
  const exit = await cli.promptMainMenu();
  if (exit) {
    break;
  }
}
process.exit(0);

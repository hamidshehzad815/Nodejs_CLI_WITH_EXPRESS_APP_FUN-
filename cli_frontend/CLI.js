import inquirer from "inquirer";
import chalk from "chalk";
import axios from "axios";
import _ from "lodash";
import {
  delay,
  clearScreen,
  runProgressBar,
  spinner,
  printProfile,
} from "./utils/supportingFunctions.js";
import client from "./redisClient.js";
import { banners } from "./utils/banners.js";
import { Prompts } from "./utils/Prompts.js";
class CLI {
  constructor() {
    this.user = {};
    this.loginRequired = false;
  }

  async promptMainMenu() {
    clearScreen();
    let exit = false;

    banners.main();
    await inquirer.prompt(Prompts.mainMenuPrompt).then(async (answer) => {
      if (answer.choice === "Login") {
        clearScreen();
        banners.login();
        const loginStatus = await this.loginHandler();
        if (loginStatus) {
          while (true) {
            const exit = await this.userChoice();
            if (exit) {
              break;
            }
          }
        }
        exit = false;
      } else if (answer.choice === "Signup") {
        const success = await this.signup();
        await delay(2000);
        if (success) await this.loginHandler();
        exit = false;
      } else if (answer.choice === "Forget Password") {
        await this.forgetPassword();
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
    let innerExit = false;
    banners.dashboard();
    await inquirer.prompt(Prompts.userActionPrompt).then(async (choice) => {
      if (choice.action === "Profile") {
        while (!this.loginRequired) {
          innerExit = await this.profileChoice();
          if (innerExit) break;
        }
        if (this.loginRequired) exit = true;
      } else if (choice.action === "Logout") {
        await this.logout();
        exit = true;
      } else if (choice.action === "Exit") {
        exit = true;
      }
    });
    return exit;
  }

  async getResetToken(email) {
    clearScreen();
    let sp = null;
    let success = false;
    await inquirer.prompt(Prompts.TokenPrompt).then(async (resetToken) => {
      try {
        sp = await spinner("Verifying reset token...");
        const res = await axios.post(
          "http://localhost:3000/users/validateToken",
          { token: resetToken.token, email }
        );
        if (res.data.success) {
          success = true;
          sp.succeed(res.data.msg);
        } else {
          sp.fail(res.data.msg);
        }
        sp.stop();
      } catch (err) {
        console.log(err.response.status);
        await delay(2000);
        if (err.response) {
          // Server responded with an error (e.g., 400, 401, 409)
          sp.fail(
            chalk.red(
              `❌ Profile updation failed: ${
                err.response.data?.msg || err.response.statusText
              }`
            )
          );
        } else if (err.request) {
          // No response received
          sp.fail(
            chalk.red("❌ No response from server. Please try again later.")
          );
        } else {
          // Other unexpected error
          sp.fail(chalk.red(`❌ Error: ${err.message}`));
        }
        sp.stop();
      }
      await delay(2000);
    });
    return success;
  }

  async getNewPassword(email) {
    clearScreen();
    let sp = null;

    let pMatch = false;
    let updatedPassword = {};
    while (!pMatch) {
      updatedPassword = await inquirer.prompt(Prompts.newPassword);
      pMatch =
        updatedPassword.newPassword === updatedPassword.confirmedPassword
          ? true
          : false;
      if (!pMatch) {
        console.log("Password not match");
        await delay(2000);
      }
    }

    try {
      sp = await spinner("Updating new password");
      const res = await axios.post(
        "http://localhost:3000/users/resetPassword",
        { newPassword: updatedPassword.newPassword, email }
      );
      if (res.data.success) {
        sp.succeed(res.data.msg);
      } else {
        sp.fail(res.data.msg);
      }
      sp.stop;
    } catch (err) {
      if (err.response) {
        // Server responded with an error (e.g., 400, 401, 409)
        sp.fail(
          chalk.red(
            `❌ Profile updation failed: ${
              err.response.data?.msg || err.response.statusText
            }`
          )
        );
      } else if (err.request) {
        // No response received
        sp.fail(
          chalk.red("❌ No response from server. Please try again later.")
        );
      } else {
        // Other unexpected error
        sp.fail(chalk.red(`❌ Error: ${err.message}`));
      }
      sp.stop();
    }
    await delay(2000);
  }

  async forgetPassword() {
    clearScreen();
    let sp = null;
    let success = false;
    await inquirer.prompt(Prompts.emailPrompt).then(async (email) => {
      try {
        sp = await spinner("Sending reset token...");
        const res = await axios.post(
          "http://localhost:3000/users/forgetPassword",
          email
        );
        if (res.data.success) {
          sp.succeed(res.data.msg);
          sp.stop();
          await delay(2000);
          success = await this.getResetToken(email.email);
          if (success) {
            await this.getNewPassword(email.email);
          }
        } else {
          sp.fail(res.data.msg);
          sp.stop();
        }
      } catch (err) {
        if (err.response) {
          // Server responded with an error (e.g., 400, 401, 409)
          sp.fail(
            chalk.red(
              `❌ Profile updation failed: ${
                err.response.data?.msg || err.response.statusText
              }`
            )
          );
        } else if (err.request) {
          // No response received
          sp.fail(
            chalk.red("❌ No response from server. Please try again later.")
          );
        } else {
          // Other unexpected error
          sp.fail(chalk.red(`❌ Error: ${err.message}`));
        }
        sp.stop();
      }
    });
    return success;
  }

  async profileChoice() {
    clearScreen();
    let exit = false;
    banners.profile();
    await inquirer.prompt(Prompts.profilePrompt).then(async (answer) => {
      if (answer.choice === "View Profile") {
        await this.profileHandler();
      } else if (answer.choice === "Update Profile") {
        await this.updateProfile();
      } else if (answer.choice === "Verify Email") {
        await this.sendVerificationToken();
      } else if (answer.choice === "Back") {
        exit = true;
      }
    });
    return exit;
  }

  async sendVerificationToken() {
    const response = await this.isLoggedin();
    let sp = null;
    if (response.success) {
      clearScreen();
      try {
        sp = await spinner("Fetching Profile...");
        const res = await axios.post(
          "http://localhost:3000/users/emailVerificationToken",
          { email: this.user.contactInfo.email }
        );
        if (res.data.success) {
          sp.succeed(res.data.msg);
          sp.stop();
          await delay(2000);
          if (res.data.msg !== "Email Already Verified")
            await this.verifyEmail();
        } else {
          sp.fail(res.data.msg);
          sp.stop();
          await delay(2000);
        }
      } catch (err) {
        if (err.response) {
          // Server responded with an error (e.g., 400, 401, 409)
          sp.fail(
            chalk.red(
              `❌ Profile updation failed: ${
                err.response.data?.msg || err.response.statusText
              }`
            )
          );
        } else if (err.request) {
          // No response received
          sp.fail(
            chalk.red("❌ No response from server. Please try again later.")
          );
        } else {
          // Other unexpected error
          sp.fail(chalk.red(`❌ Error: ${err.message}`));
        }
        sp.stop();
      }
    } else {
      console.log(
        chalk.red("Profile Fetching failed.\nPlease make sure to login first")
      );
      await delay(2000);
    }
  }

  async verifyEmail() {
    clearScreen();
    let sp = null;
    try {
      await inquirer
        .prompt(Prompts.TokenPrompt)
        .then(async (emailVerificationToken) => {
          sp = await spinner("Verifying Email...");
          const res = await axios.post(
            "http://localhost:3000/users/verifyEmail",
            {
              token: emailVerificationToken.token,
              email: this.user.contactInfo.email,
            }
          );

          if (res.data.success) {
            sp.succeed(res.data.msg);
          } else {
            sp.fail(res.data.msg);
          }
          sp.stop();
        });
    } catch (err) {
      if (err.response) {
        // Server responded with an error (e.g., 400, 401, 409)
        sp.fail(
          chalk.red(
            `❌ Profile updation failed: ${
              err.response.data?.msg || err.response.statusText
            }`
          )
        );
      } else if (err.request) {
        // No response received
        sp.fail(
          chalk.red("❌ No response from server. Please try again later.")
        );
      } else {
        // Other unexpected error
        sp.fail(chalk.red(`❌ Error: ${err.message}`));
      }
      sp.stop();
    }
    await delay(2000);
  }

  async logout() {
    const sp = await spinner("Logging Out...", "blue", "dots");
    await delay(1500);
    if (!client.isOpen) {
      await client.connect();
    }
    await client.del("loggedIn");
    sp.succeed("Successfully Logout");
    await delay(1500);
    sp.stop();
  }

  async profileHandler() {
    const sp = await spinner("Fetching Profile...", "green", "toggle10");
    const response = await this.isLoggedin();
    if (response.success) {
      const profile = _.pick(response.user, ["personalInfo", "contactInfo"]);
      sp.succeed("Profile Fetched");
      sp.stop();
      clearScreen();
      banners.profile();
      // console.table(_.pick(profile, ["name", "email"]));
      printProfile(profile);

      await inquirer.prompt(Prompts.continuePrompt);
    } else {
      sp.fail("Profile Fetching failed.\nPlease make sure to login first");
      sp.stop();
      await delay(2000);
    }
  }

  async updateProfile() {
    clearScreen();
    const response = await this.isLoggedin();
    if (response.success) {
      banners.updateProfile();
      await inquirer
        .prompt(Prompts.updateProfile)
        .then(async (updatedProfile) => {
          const sp = await spinner(
            "🔄 Updating Profile...",
            "green",
            "toggle10"
          );
          try {
            const res = await axios.post(
              "http://localhost:3000/users/updateProfile",
              { updatedProfile, user: this.user }
            );
            if (res.data.success) {
              if (!client.isOpen) {
                await client.connect();
              }
              await client.set(
                "loggedIn",
                JSON.stringify({
                  user: res.data.updatedUser,
                  msg: "Login Successful ✅ ",
                  success: true,
                }),
                {
                  KEEPTTL: true,
                }
              );
              sp.succeed(chalk.green(res.data.msg));
              sp.stop();
            } else {
              sp.fail(res.data.msg);
              sp.stop();
            }
            await delay(1500);
          } catch (err) {
            sp.stop();

            if (err.response) {
              // Server responded with an error (e.g., 400, 401, 409)
              console.log(
                chalk.red(
                  `❌ Profile updation failed: ${
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
    } else {
      console.log(
        chalk.red("Profile Fetching failed.\nPlease make sure to login first")
      );
      await delay(2000);
    }
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
      this.loginRequired = true;
    } else {
      response.redis = true;
      (this.user = response.user), ["token"];
    }
    return response;
  }
  async loginHandler() {
    const response = await this.login();
    const sp = await spinner("Logging in...", "green", "circleHalves", 1000);
    if (response.success) {
      this.loginRequired = false;
      clearScreen();
      sp.succeed(chalk.greenBright(`✅ ${response.msg}`));
      const fullname =
        response.user.personalInfo.firstName +
        " " +
        response.user.personalInfo.lastName;
      banners.welcome(fullname);

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
      await delay(2000);
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
      await inquirer.prompt(Prompts.loginPrompt).then(async (credentials) => {
        try {
          backendResponse = await axios.post(
            `http://localhost:3000/users/login`,
            credentials
          );
        } catch (err) {
          // Axios error handling
          backendResponse = { data: {} };
          if (err.response) {
            // Server responded with non-2xx
            backendResponse.data = {
              success: false,
              msg:
                err.response.data?.msg ||
                `Login failed (${err.response.status})`,
            };
          } else if (err.request) {
            // No response from server
            backendResponse.data = {
              success: false,
              msg: "No response from server. Check your connection.",
            };
          } else {
            // Something else went wrong
            backendResponse.data = {
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

    await inquirer.prompt(Prompts.signupPrompt).then(async (userInfo) => {
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

async function start() {
  const cli = new CLI();
  while (true) {
    const exit = await cli.promptMainMenu();
    if (exit) {
      break;
    }
  }
  process.exit(0);
}

start();

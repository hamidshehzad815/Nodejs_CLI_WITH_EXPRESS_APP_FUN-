import chalk from "chalk";
import ora, { spinners } from "ora";
import cliProgress from "cli-progress";
import boxen from "boxen";

const delay = async (duration) => {
  await new Promise((resolve) => setTimeout(resolve, duration));
};

async function clearScreen() {
  process.stdout.write("\x1Bc");
}
async function spinner(text, color = "yellow", type = "dots", duration = 300) {
  const spinner = ora({ text, color, spinner: type }).start();
  await delay(duration);
  return spinner;
}

async function runProgressBar(
  message,
  spnr = null,
  steps = 5,
  stepDelay = 300
) {
  process.stdout.write("\n"); // Print a new line before progress bar
  spnr?.stop();
  const bar = new cliProgress.SingleBar({
    format:
      chalk.cyan(message) +
      " |" +
      chalk.green("{bar}") +
      `| {percentage}% || {value}/{total}`,
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });

  bar.start(100, 0);

  const increment = 100 / steps;
  for (let i = 0; i <= 100; i += increment) {
    await delay(stepDelay);
    bar.update(i);
  }
  bar.stop();
  process.stdout.write("\n");
}
function printProfile(profile) {
  const { personalInfo, contactInfo } = profile;

  const profileCard = `
${chalk.bold.cyan("👤 Name:")}     ${personalInfo.firstName} ${
    personalInfo.lastName
  }
${chalk.bold.cyan("🎂 DOB:")}      ${new Date(
    personalInfo.dateOfBirth
  ).toDateString()}

${chalk.bold.green("📧 Email:")}   ${contactInfo.email}
${chalk.bold.green("📞 Phone:")}   ${contactInfo.phone}

${chalk.bold.yellow("🏠 Address:")}
   ${contactInfo.address.street}
   ${contactInfo.address.city}, ${contactInfo.address.state}
   ${contactInfo.address.country} - ${contactInfo.address.zipCode}
`;

  console.log(
    boxen(profileCard, {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "cyan",
      title: chalk.bold("User Profile"),
      titleAlignment: "center",
    })
  );
}
export { spinner, runProgressBar, clearScreen, printProfile, delay };

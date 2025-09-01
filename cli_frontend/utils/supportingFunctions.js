import inquirer from "inquirer";
import chalk from "chalk";
import ora, { spinners } from "ora";
import figlet from "figlet";
import cliProgress from "cli-progress";

const delay = async (duration) => {
  await new Promise((resolve) => setTimeout(resolve, duration));
};

async function clearScreen() {
  process.stdout.write("\x1Bc");
}
async function spinner(text, color = "yellow", type = "dots", duration = 300) {
  const spinner = ora({ text, color, spinners: type }).start();
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
export { spinner, runProgressBar, clearScreen, delay };

import figlet from "figlet";
import chalk from "chalk";

function makeBanner(text, color, emojis = "") {
  return chalk[color](
    emojis + "\n" + figlet.textSync(text, { font: "Slant" }) + "\n" + emojis
  );
}

export const banners = {
  main: () => console.log(makeBanner("CLI Express app", "yellow", "👤👥")),
  login: () => console.log(makeBanner("Login", "green", "🔑")),
  signup: () => console.log(makeBanner("Signup", "cyan", "📝")),
  exit: () => console.log(makeBanner("Goodbye!", "red", "🚪👋")),
};

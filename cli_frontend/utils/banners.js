import figlet from "figlet";
import chalk from "chalk";

function makeBanner(text, color, emojis = "") {
  return chalk[color](
    emojis + "\n" + figlet.textSync(text, { font: "Slant" }) + "\n" + emojis
  );
}

export const banners = {
  main: () => console.log(makeBanner("CLI Express app", "yellow", "👤")),
  login: () => console.log(makeBanner("Login", "green", "🔑")),
  signup: () => console.log(makeBanner("Signup", "cyan", "📝")),
  dashboard: () => console.log(makeBanner("Dashboard", "magenta", "⚡🎯")),
  welcome: (username) =>
    console.log(makeBanner(`Welcome ${username}`, "blue", "🎉")),
  profile: () => console.log(makeBanner("Profile", "green", "👤")),
  updateProfile: () => console.log(makeBanner("Update Profile", "green", "🔄")),
  exit: () => console.log(makeBanner("Goodbye!", "red", "🚪👋")),
};

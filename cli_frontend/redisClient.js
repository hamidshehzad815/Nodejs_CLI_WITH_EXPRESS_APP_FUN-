import redis from "redis";
import chalk from "chalk";

const client = redis.createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379,
  },
});

client.on("ready", () => console.log(chalk.green("Redis connection ready")));
client.on("end", () =>
  console.log(chalk.green("Redis connection has closed."))
);
client.on("reconnecting", (o) => {
  console.log(chalk.yellow("Redis client is reconnecting"));
  if (o) {
    console.log("Attempt number:", o.attempt);
    console.log("Delay:", o.delay);
  }
});
client.on("error", (err) => {
  console.error(chalk.red("Redis Client Error:"), err);
});

export default client;

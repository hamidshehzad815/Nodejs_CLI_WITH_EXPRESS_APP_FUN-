import inquirer from "inquirer";

inquirer
  .prompt([
    {
      type: "input",
      name: "name",
      message: "Enter your name",
      validate: (input) => {
        if (input) {
          if (input.length <= 2) {
            return "less than 2";
          }
        }
        return true;
      },
    },
    {
      type: "input",
      name: "age",
      message: "Enter your age",
      validate: (input) => {
        if (input) {
          if (input <= 18) {
            return "less than 18";
          }
        }
        return true;
      },
    },
  ])
  .then((answer) => {
    if (answer.name) console.log(answer);
  });

import { Command, flags } from "@oclif/command";
const requireText = require("require-text");
const logBeauty = require("log-beautify");
import { GenerateFiles } from "../lib/GenerateFiles";
import * as inquirer from 'inquirer';
import cli from 'cli-ux';

export default class Generate extends Command {
  static description = "this command generate a new route and controller.";

  static flags = {
    name: flags.string({ char: "n", description: "Name for component" }),
    file: flags.string({
      char: "p",
      description: "Json file path",
    }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
  };

  static args = [{ name: "file" }];

  async run() {
    const { args, flags } = this.parse(Generate);

    let name = flags.name == undefined || flags.name == null ? "" : flags.name;
    let path = flags.file == undefined || flags.file == null ? "" : flags.file;
    let properties = {};

    while(!name || name == ''){
      name = await cli.prompt("Write a name for the controller")
    }

    let responses: any = await inquirer.prompt([{
      name: 'path',
      message: 'You want to create a controller without schema?',
      type: 'list',
      choices: [ {name: 'Yes'}, {name: 'No'} ],
    }])

    if(responses.path == 'No')
      path = await cli.prompt("Write the absolute path for the json file")

    let generate = new GenerateFiles(name);

    if (path != "") {
      properties = JSON.parse(requireText(path.toString(), require));
    }

    generate.validation(properties);

    if (flags.force) {
      logBeauty.info(`you input --force: ${args.force}`);
    }
  }
}

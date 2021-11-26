import { Command, flags } from '@oclif/command';
const requireText = require('require-text');
const logBeauty = require('log-beautify');
import { GenerateFiles } from '../lib/GenerateFiles';
import * as inquirer from 'inquirer';
import cli from 'cli-ux';

function processProperties(list:any) : {} {

  let properties:any = {};

  for (const property of list) {

    let item = {
      "type": property.type,
      "required": property.required
    }

    properties[property.name] = item
  }

  console.log(properties);
  return properties;

}

async function generateProperties() {
  let propertiesList = [];
  let addNew = true;

  while (addNew == true) {
    let property = { name: '', type: '', required: false };

    property.name = await cli.prompt('Name of the field');
    let { type, required } = await inquirer.prompt([
      {
        name: 'type',
        message: 'Choose a type',
        type: 'list',
        choices: [{ name: 'string' }, { name: 'number' }, { name: 'boolean' }, { name: 'array' }]
      },
      {
        name: 'required',
        message: 'Is required?',
        type: 'list',
        choices: [{ name: 'Yes' }, { name: 'No' }]
      }
    ]);

    property.type = type;
    property.required = (required == 'Yes') ? true : false

    propertiesList.push(property);

    let { responseField } = await inquirer.prompt([
      {
        name: 'responseField',
        message: 'Add a new field?',
        type: 'list',
        choices: [{ name: 'Yes' }, { name: 'No' }]
      }
    ]);

    responseField == 'Yes' ? (addNew = true) : (addNew = false);
  }

  return processProperties(propertiesList);
}

export default class Generate extends Command {
  static description = 'this command generate a new route and controller.';

  static flags = {
    name: flags.string({ char: 'n', description: 'Name for component' }),
    file: flags.string({
      char: 'p',
      description: 'Json file path'
    }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' })
  };

  static args = [{ name: 'file' }];

  async run() {
    const { args, flags } = this.parse(Generate);

    let name = flags.name == undefined || flags.name == null ? '' : flags.name;
    let path = flags.file == undefined || flags.file == null ? '' : flags.file;
    let properties = {};

    while (!name || name == '') {
      name = await cli.prompt('Write a name for the controller');
    }

    let responses: any = await inquirer.prompt([
      {
        name: 'path',
        message: 'You want to create a controller without schema?',
        type: 'list',
        choices: [{ name: 'Yes' }, { name: 'No' }]
      }
    ]);

    if (responses.path == 'No') properties = await generateProperties();

    let generate = new GenerateFiles(name);

    if (path != '') {
      properties = JSON.parse(requireText(path.toString(), require));
    }

    generate.validation(properties);

    if (flags.force) {
      logBeauty.info(`you input --force: ${args.force}`);
    }
  }
}

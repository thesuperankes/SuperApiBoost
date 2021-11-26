import { Command, flags } from '@oclif/command';
import * as cp from 'child_process';
import * as fs from 'fs';
import axios from 'axios';
const logBeauty = require('log-beautify');
const uriTxt =
  'https://raw.githubusercontent.com/thesuperankes/SuperApiBoost/main/src/assets/new/';
let nameProject = '';

function intallPackages(name: string) {
  cp.execSync(
    'npm install --save express mongoose cors @types/express @types/cors ts-node typescript',
    {
      cwd: `./${name}`,
      stdio: 'inherit'
    }
  );
  logBeauty.warning('Remember add the mongo uri in config.ts  !!!!!');
  logBeauty.success('Installed packages');
  logBeauty.success(`Run: cd ${nameProject} and execute: npm start`);
}

async function getText(url: string) {
  let response = await axios.get(url, { responseType: 'arraybuffer' });
  let buff = Buffer.from(response.data);
  return buff.toString();
}

function createDirectory(path: string) {
  logBeauty.info(`Folder ${path} Created`);
  return !fs.existsSync(path) && fs.mkdirSync(path, { recursive: true });
}

async function createFile(path: string, name: string) {
  let data: any = await getText(uriTxt + name);
  logBeauty.info(`File ${path} Created`);
  return (
    !fs.existsSync(path) &&
    fs.writeFileSync(path, data.replace('#NAME', nameProject))
  );
}

async function startProject(name: string) {
  const dir = `./${name}`;
  const path = `./${name}/src/`;
  const dirSrc = `${path}api`;
  const dirDatabases = `${path}controllers`;
  const dirTools = `${path}tools`;
  const dirRoutes = `${path}api/routes`;
  const dirInterfaces = `${path}interfaces`;

  createDirectory(dir);
  createDirectory(path);
  createDirectory(dirSrc);
  createDirectory(dirInterfaces);
  createDirectory(dirDatabases);
  createDirectory(dirTools);
  createDirectory(dirRoutes);

  await createFile(`${path}app.ts`, 'app.txt');
  await createFile(`${path}config.ts`, 'config.txt');
  await createFile(`${path}mongo.ts`, 'mongoConfig.txt');
  await createFile(`${path}api/index.ts`, 'index.txt');
  await createFile(`${path}controllers/mongoBasic.ts`, 'mongoBasic.txt');
  await createFile(`${path}tools/validateType.ts`, 'validateType.txt');
  await createFile(`./${name}/package.json`, 'package.txt');
  await createFile(`./${name}/tsconfig.json`, 'tsconfig.txt');

  logBeauty.warning(`Installing packages`);
  intallPackages(name);
}

export default class New extends Command {
  static description = 'This command start a new project';

  static flags = {
    name: flags.string({ char: 'n', description: 'name to print' }),
    force: flags.boolean({ char: 'f' })
  };

  static args = [{ name: 'file' }];

  async run() {
    const { flags } = this.parse(New);

    if (flags.name === undefined || flags.name === null) {
      logBeauty.error('ìs necessary a name for create project');
    } else {
      nameProject = flags.name;
      const dir = `./${flags.name}`;

      if (!fs.existsSync(dir)) {
        logBeauty.success('Creating project');
        startProject(flags.name);
      }
    }
  }
}

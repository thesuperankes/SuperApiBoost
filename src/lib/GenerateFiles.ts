import * as fs from 'fs';
const requireText = require('require-text');
const logBeauty = require('log-beautify');
import { Controller } from './Controller';
import { Route } from './Route';
import { Tools } from './Tools';

export class GenerateFiles {
  dir = './src/api';
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  generateInterface(name: string, arr: any) {
    let directory = `./src/interfaces/${name.toLowerCase()}`;
    let lines = [];
    lines.push(`export interface I${Tools.capitalize(name)}{`);
    for (const item of Object.keys(arr)) {
      lines.push(`  ${item}:${arr[item].type};`);
    }
    lines.push(`}`);

    let text = lines.join('\r\n');
    if (!fs.existsSync(directory))
      fs.mkdir(directory, () =>
        fs.writeFile(`${directory}/I${Tools.capitalize(name)}.ts`, text, () =>
          logBeauty.debug('Interface has been generate correctly')
        )
      );
    else logBeauty.error('Directory and interface has been exists');
  }

  async generateFilesSchema(properties: any) {
    this.generateInterface(this.name, properties);

    let controller = new Controller(this.name, properties);
    let route = new Route(this.name, properties);

    await controller.createController();
    await route.createRoute();

    logBeauty.success('Files generated correctly');
  }

  async GenerateFiles() {
    let controller = new Controller(this.name);
    let route = new Route(this.name);

    await controller.createController();
    await route.createRoute();
  }

  addImportAndUse() {
    const nameLower = this.name.toLowerCase();

    const stringIndex = fs
      .readFileSync('./src/api/index.ts')
      .toString()
      .replace(/\r\n/g, '\n')
      .split('\n');

    let cleanLines: Array<string> = stringIndex.filter(
      (i: string) => !(i === '')
    );

    const linesImport = cleanLines.filter((x: string) => x.includes('import'));

    cleanLines = this.insertAt(
      linesImport.length,
      `import ${nameLower} from './routes/${nameLower}Route';`,
      cleanLines
    );
    cleanLines = this.insertAt(
      cleanLines.length - 1,
      `router.use('/${nameLower}', ${nameLower});`,
      cleanLines
    );

    const routeLine = cleanLines.findIndex((x: any) => x.includes('.Router()'));

    cleanLines = this.insertAt(routeLine, '', cleanLines);
    cleanLines = this.insertAt(routeLine + 2, '', cleanLines);
    cleanLines = this.insertAt(cleanLines.length - 1, '', cleanLines);

    const str = cleanLines.join('\r\n');
    fs.writeFile('./src/api/index.ts', str, () => {
      logBeauty.success('Index has been update correctly');
    });
  }

  insertAt(index: number, value: string, array: Array<any>) {
    array.splice(index, 0, value);
    return array;
  }

  validation(properties?: any) {
    if (this.checkFileExists()) {
      logBeauty.error('The file with the name ' + name + ' is already exists');
      return false;
    }

    if (properties) this.generateFilesSchema(properties);
    else this.GenerateFiles();

    logBeauty.info('Modify index with new route.');
    this.addImportAndUse();
  }

  private checkFileExists() {
    let controllerPath = `./src/controllers/${this.name.toLocaleLowerCase()}Controller.ts`;
    let routePath = `./src/api/routes/${this.name.toLowerCase()}Route.ts`;

    if (!fs.existsSync(controllerPath) && !fs.existsSync(routePath))
      return false;
    else return true;
  }
}

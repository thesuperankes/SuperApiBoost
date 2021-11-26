import { Content } from "./Content";
import { File } from "./File";
import { Tools } from "./Tools";
import { TypeGenerate } from "./Types";

export class Route extends File {
  name: string;
  properties: {} | undefined;

  constructor(name: string, properties?: {}) {
    super(name, TypeGenerate.ROUTE);
    this.properties = properties;
    this.name = name;
  }

  generateBody(arr: any) {
    let names = "";
  
    for (const name of Object.keys(arr)) {
      if (names == "") names = `'${name}'`;
      else names = `${names} | '${name}'`;
    }
  
    return names;
  }

  replaceData() {

    let nameCapitalize = Tools.capitalize(this.name);
    let nameLower = this.name.toLowerCase();

    let replaceConfig = [
      {
        key: "#LOWERNAME",
        value: nameLower,
      },{
        key: "#DATAACCESS",
        value: nameCapitalize + 'Controller',
      },{
        key: "#NAMECONTROLLER",
        value: nameLower + 'Controller',
      },{
        key: "#IMPORTINTERFACE",
        value: !Tools.isObjectEmpty(this.properties) ? `import { I${nameCapitalize} } from '../../interfaces/${nameLower}/I${nameCapitalize}'` : '',
      },{
        key: "#BODY",
        value: !Tools.isObjectEmpty(this.properties) ? `req.body as Pick<I${nameCapitalize}, ${this.generateBody(this.properties)}>;` : '{}'
      }
    ];

    this.replaceParameters(replaceConfig);
  }

  async createRoute() {
    await this.buildContentFile();
    this.replaceData();
    await this.createFile();
  }
}

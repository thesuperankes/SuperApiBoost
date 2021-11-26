import { Content } from "./Content";
import { TypeGenerate } from "./Types";
import { Tools } from "./Tools";
import { File } from "./File";

export class Controller extends File {
  name: string;
  properties: {} | undefined;

  constructor(name: string, properties?: {}) {
    super(name, TypeGenerate.SCHEMA);
    this.properties = properties;
    this.name = name;
  }

  private generateSchema(properties: any) {
    let lines = [];
    lines.push(`{`);
    for (const name of Object.keys(properties)) {
      let item = properties[name];
      lines.push(
        `  ${name}:{ type: ${Tools.convertStringToType(item.type)}, required: ${
          item.required
        }${
          item.default != "" && item.default != undefined
            ? `, default: ${item.default}`
            : ""
        } },`
      );
    }
    lines.push(`}`);

    return lines.join("\r\n");
  }

  checkProperties() {
    let nameCapitalize = Tools.capitalize(this.name);
    let schema = this.generateSchema(this.properties);
    let addProperties = false;

    if (!Tools.isObjectEmpty(this.properties)) addProperties = true;

    let replaceConfig = [
      {
        key: "#SCHEMAGENERATED",
        value: addProperties ? schema : ""
      },
      {
        key: "#IMPORTINTERFACE",
        value: addProperties
          ? `import { I${nameCapitalize} } from '../interfaces/${this.name.toLowerCase()}/I${nameCapitalize}'`
          : ""
      },
      {
        key: "#INTERNAME",
        value: addProperties ? `I${nameCapitalize}` : 'any'
      },
    ];

    this.replaceParameters(replaceConfig);
  }

  replaceData() {
    let nameLower = this.name.toLowerCase();
    let nameCapitalize = Tools.capitalize(this.name);
    this.replaceKey("#LOWERNAME", nameLower);
    this.replaceKey("#CAPINAME", nameCapitalize);
  }

  async createController() {
    await this.buildContentFile();
    this.checkProperties();
    this.replaceData();
    await this.createFile();
  }
}

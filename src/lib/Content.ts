import axios from "axios";
import { TypeGenerate, TypeStart } from "./Types";

export class Content {
  name: string;
  url: string = '';
  path: string;
  content: string = "";

  constructor(name: string, type: TypeGenerate | TypeStart) {
    this.name = name;
    this.getFileUrl(type);
    this.path = this.getPath(type);
  }

  async GetContent() {
    let response = await axios.get(this.url, { responseType: "arraybuffer" });
    let buff = Buffer.from(response.data);
    return buff.toString();
  }

  setContent(value: string) {
    this.content = value;
  }

  getFileUrl(type: TypeGenerate | TypeStart) {
    let url =
      "https://raw.githubusercontent.com/thesuperankes/SuperApiBoost/main/src/assets/";

    if (type == TypeGenerate.SCHEMA) this.url = url + "generate/schema.txt";
    else if (type == TypeGenerate.ROUTE) this.url = url + "generate/route.txt";
    else if (type == TypeGenerate.NOSCHEMA)
      this.url = url + "generate/noSchema.txt";
    else if (type == TypeGenerate.ROUTESIMPLE)
      this.url = url + "generate/routeSimple.txt";
    else return "";
  }

  getPath(type: TypeGenerate | TypeStart): string {
    let nameLower = this.name.toLocaleLowerCase();

    if (type == TypeGenerate.SCHEMA)
      return `./src/controllers/${nameLower}Controller.ts`;
    else if (type == TypeGenerate.ROUTE)
      return `./src/api/routes/${nameLower}Route.ts`;
    else return "";
  }

  replaceKey(key: string, value: string) {
    let regex = new RegExp(key, "g");
    this.content = this.content.replace(regex, value);
  }
}

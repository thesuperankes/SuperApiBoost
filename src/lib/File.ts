import * as fs from "fs";
import { Content } from "./Content";
import { TypeGenerate, TypeStart } from "./Types";

export class File extends Content {
  name: string;

  constructor(name: string, type: TypeGenerate | TypeStart) {
    super(name, type);
    this.name = name;
  }

  replaceParameters(config: Array<{ key: string, value: string }>) {
    for (const iterator of config) {
      this.replaceKey(iterator.key, iterator.value);
    }
  }

  async buildContentFile() {
    let response = await this.GetContent();
    this.setContent(response);
  }

  async createFile() {
    fs.writeFileSync(this.path, this.content);
  }
}

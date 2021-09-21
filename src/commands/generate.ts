import { Command, flags } from "@oclif/command";
import { IGenProperties } from "../interfaces/IGenProperties";
import * as fs from "fs";
const requireText = require("require-text");
const logBeauty = require("log-beautify");

function capitalize(str: string) {
  const lower = str.toLowerCase();
  return str.charAt(0).toUpperCase() + lower.slice(1);
}

function insertAt(index: number, value: string, array: Array<any>) {
  array.splice(index, 0, value);
  return array;
}

function generateFiles(name: string, schema = false, array = {}) {
  const schemaTxt: any = requireText("../assets/generate/schema.txt", require);
  const routeTxt: any = requireText("../assets/generate/route.txt", require);

  if (schema) generateInterface(name, array);

  fs.writeFileSync(
    `./src/controllers/${name.toLocaleLowerCase()}Controller.ts`,
    schemaTxt
      .replace(/#LOWERNAME/g, name.toLowerCase())
      .replace(/#CAPINAME/g, capitalize(name))
      .replace(/#SCHEMAGENERATED/g, schema ? generateSchema(array) : "")
      .replace(
        /#IMPORTINTERFACE/g,
        schema
          ? `import { I${capitalize(
              name
            )} } from '../interfaces/${name.toLowerCase()}/I${capitalize(
              name
            )}'`
          : ""
      )
      .replace(/#INTERNAME/g, schema ? `I${capitalize(name)}` : "any")
  );
  fs.writeFileSync(
    `./src/api/routes/${capitalize(name)}Route.ts`,
    routeTxt
      .replace(/#LOWERNAME/g, name.toLowerCase())
      .replace(/#DATAACCESS/g, capitalize(name) + "Controller")
      .replace(
        /#IMPORTINTERFACE/g,
        schema
          ? `import { I${capitalize(
              name
            )} } from '../../interfaces/${name.toLowerCase()}/I${capitalize(
              name
            )}'`
          : ""
      )
      .replace(
        /#BODY/g,
        schema
          ? `req.body as Pick<I${capitalize(name)}, ${generateBody(array)}>;`
          : "{}"
      )
  );
  logBeauty.success("Files generated correctly");
}

function generateInterface(name: string, arr: any) {
  let directory = `./src/interfaces/${name.toLowerCase()}`;
  let lines = [];
  lines.push(`export interface I${capitalize(name)}{`);
  for (const item of Object.keys(arr)) {
    lines.push(`  ${item}:${arr[item].type};`);
  }
  lines.push(`}`);

  let text = lines.join("\r\n");
  if (!fs.existsSync(directory))
    fs.mkdir(directory, () =>
      fs.writeFile(`${directory}/I${capitalize(name)}.ts`, text, () =>
        logBeauty.debug("Interface has been generate correctly")
      )
    );
  else logBeauty.error("Directory and interface has been exists");
}

function generateSchema(arr: any) {
  let lines = [];
  lines.push(`{`);
  for (const name of Object.keys(arr)) {
    let item = arr[name];
    lines.push(
      `  ${name}:{ type: ${getType(item.type)}, required: ${item.required}${
        item.default != "" && item.default != undefined
          ? `, default: ${item.default}`
          : ""
      } },`
    );
  }
  lines.push(`}`);

  return lines.join("\r\n");
}

function generateBody(arr: any) {
  let names = "";

  for (const name of Object.keys(arr)) {
    if (names == "") names = `'${name}'`;
    else names = `${names} | '${name}'`;
  }

  return names;
}

function addImportAndUse(name: string) {
  const stringIndex = fs
    .readFileSync("./src/api/index.ts")
    .toString()
    .replace(/\r\n/g, "\n")
    .split("\n");

  let cleanLines: Array<string> = stringIndex.filter(
    (i: string) => !(i === "")
  );

  const linesImport = cleanLines.filter((x: string) => x.includes("import"));

  cleanLines = insertAt(
    linesImport.length,
    `import ${name.toLowerCase()} from './routes/${name.toLowerCase()}Route';`,
    cleanLines
  );
  cleanLines = insertAt(
    cleanLines.length - 1,
    `router.use('/${name.toLowerCase()}', ${name.toLowerCase()});`,
    cleanLines
  );

  const routeLine = cleanLines.findIndex((x: any) => x.includes(".Router()"));

  cleanLines = insertAt(routeLine, "", cleanLines);
  cleanLines = insertAt(routeLine + 2, "", cleanLines);
  cleanLines = insertAt(cleanLines.length - 1, "", cleanLines);

  const str = cleanLines.join("\r\n");
  fs.writeFile("./src/api/index.ts", str, () => {
    logBeauty.success("index has been update correctly");
  });
}

function getType(type: string) {
  switch (type) {
    case "string":
      return "String";
    case "number":
      return "Number";
    case "boolean":
      return "Boolean";
    case "[]":
      return "Array";

    default:
      return "String";
  }
}

export default class Generate extends Command {
  static description = "this command generate a new route and controller.";

  static flags = {
    name: flags.string({ char: "n", description: "Name for component" }),
    file: flags.string({
      char: "p",
      description: "Path for object json to generate interface and properties",
    }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
  };

  static args = [{ name: "file" }];

  async run() {
    const { args, flags } = this.parse(Generate);

    const dir = "./src/api";

    if (flags.name === null || flags.name === undefined) {
      logBeauty.error("Give a name with flag -n to generate controller");
      return false;
    }

    if (fs.existsSync(dir)) {
      logBeauty.info("Generate DataAccess and Router.");
      if (flags.file !== null && flags.file !== undefined) {
        const arrayProperties = JSON.parse(
          requireText(flags.file.toString(), require)
        );
        generateFiles(flags.name, true, arrayProperties);
      } else generateFiles(flags.name);
      logBeauty.info("Modify index with new route.");
      addImportAndUse(flags.name);
    } else {
      logBeauty.error(
        "It is necessary to be in the project path to be able to generate controller"
      );
    }

    if (flags.force) {
      logBeauty.info(`you input --force: ${args.force}`);
    }
  }
}

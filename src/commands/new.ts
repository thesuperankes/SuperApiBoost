import { Command, flags } from "@oclif/command";
import * as cp from "child_process";
import * as fs from "fs";
const logBeauty = require("log-beautify");
const requireText = require("require-text");

function intallPackages(name: string) {
  cp.execSync(
    "npm install --save express mongoose cors @types/express @types/cors ts-node typescript",
    {
      cwd: `./${name}`,
      stdio: "inherit",
    }
  );
  logBeauty.warning("Remember add the mongo uri in mongo.ts  !!!!!");
  logBeauty.success("installed packages");
  logBeauty.success("Go to your folder and execute: npm start");
}

async function startProject(name: string) {
  const dir = `./${name}`;

  const path = `./${name}/src/`;

  const dirSrc = `${path}/api`;
  const dirDatabases = `${path}/controllers`;
  const dirTools = `${path}/tools`;
  const dirRoutes = `${path}/api/routes`;
  const dirInterfaces = `${path}/interfaces`;

  const dataPackage: any = requireText("../assets/new/package.txt", require);
  const dataMongo: any = requireText("../assets/new/mongoBasic.txt", require);
  const dataValidate: any = requireText(
    "../assets/new/validateType.txt",
    require
  );
  const dataApp: any = requireText("../assets/new/app.txt", require);
  const dataMongoConfig: any = requireText(
    "../assets/new/mongoConfig.txt",
    require
  );
  const dataIndex: any = requireText("../assets/new/index.txt", require);

  if (!fs.existsSync(dir)) {
    //start directory
    fs.mkdir(dir, () => {
      //Create src folder and app, mongo files.
      fs.mkdir(path, () => {
        fs.writeFile(`${path}/app.ts`, dataApp, () =>
          logBeauty.debug("Added app.ts")
        );
        fs.writeFile(`${path}/mongo.ts`, dataMongoConfig, () =>
          logBeauty.debug("Added mongo.ts")
        );
        //Create api folder
        fs.mkdir(dirSrc, () => {
          logBeauty.debug("api directory created");
          //Create routes folder
          fs.mkdir(dirRoutes, () =>
            logBeauty.debug("routes directory created")
          );
          //Create index
          fs.writeFileSync(`${path}/api/index.ts`, dataIndex);
        });

        fs.mkdir(dirInterfaces, () =>
          logBeauty.debug("interfaces directory created")
        );
        //Create databases (controllers)
        fs.mkdir(dirDatabases, () => {
          logBeauty.debug("controllers directory created");
          fs.writeFileSync(`${path}/controllers/mongoBasic.ts`, dataMongo);
        });
        //Create Tools directory
        fs.mkdir(dirTools, () => {
          logBeauty.debug("Tools directory created");
          fs.writeFileSync(`${path}/tools/validateType.ts`, dataValidate);
        });
        //Create package.json and install packages
        fs.writeFile(
          `./${name}/package.json`,
          dataPackage.replace("#NAME", name),
          () => {
            logBeauty.debug("Added package.json");
            logBeauty.debug("Install Packages");
            intallPackages(name);
          }
        );
      });
    });
  }
}

export default class New extends Command {
  static description = "describe the command here";

  static flags = {
    name: flags.string({ char: "n", description: "name to print" }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
  };

  static args = [{ name: "file" }];

  async run() {
    const { flags } = this.parse(New);

    if (flags.name === undefined || flags.name === null) {
      logBeauty.error("ìs necessary a name for create project");
    } else {
      const dir = `./${flags.name}`;

      if (!fs.existsSync(dir)) {
        logBeauty.debug("Generate project");
        startProject(flags.name);
      }
    }
  }
}

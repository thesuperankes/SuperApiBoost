import {Command, flags} from '@oclif/command'
import * as cp from 'child_process'

const logBeauty = require('log-beautify')
const requireText = require('require-text')

const fs = require('fs')

function intallPackages(name: string) {
  cp.execSync(
    'npm install --save express mongoose cors @types/express @types/cors ts-node typescript',
    {
      cwd: `./${name}`,
      stdio: 'inherit',
    }
  )
  logBeauty.success('installed packages')
  logBeauty.success('Go to your folder and execute: npm run New')

  logBeauty.warning('Remember add the mongo uri in mongo.ts  !!!!!')
}

const startProject = async (name: string) => {
  const dir = `./${name}`
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
    fs.mkdirSync(dir + '/src')
    const dataPackage: any = requireText('../assets/new/package.txt', require)
    const dataMongo: any = requireText('../assets/new/mongoBasic.txt', require)
    const dataValidate: any = requireText(
      '../assets/new/validateType.txt',
      require
    )
    const dataApp: any = requireText('../assets/new/app.txt', require)
    const dataMongoConfig: any = requireText(
      '../assets/new/mongoConfig.txt',
      require
    )
    const dataIndex: any = requireText('../assets/new/index.txt', require)

    const path = `./${name}/src/`

    const dirSrc = `${path}/api`
    const dirDatabases = `${path}/databases`
    const dirApi = `${path}/api`
    const dirTools = `${path}/tools`

    fs.mkdir(dirSrc, () => {
      logBeauty.info('Src directory created')
    })

    fs.mkdir(dirTools, () => {
      logBeauty.info('Tools directory created')
      fs.writeFileSync(`${path}/tools/ValidateType.ts`, dataValidate)
    })

    fs.mkdir(dirDatabases, () => {
      logBeauty.info('databases directory created')
      fs.writeFileSync(`${path}/databases/MongoBasic.ts`, dataMongo)
    })
    fs.mkdir(dirApi, () => {
      logBeauty.info('api directory created')
      const dirRoutes = `${path}/api/Routes`
      fs.mkdir(dirRoutes, () => {
        logBeauty.info('routes directory created')
      })
      fs.writeFileSync(`${path}/api/index.ts`, dataIndex)
      fs.writeFileSync(`${path}/app.ts`, dataApp)
      fs.writeFileSync(`${path}/mongo.ts`, dataMongoConfig)
    })

    fs.writeFileSync(
      `./${name}/package.json`,
      dataPackage.replace('#NAME', name)
    )

    logBeauty.success('Folders Generated')
  }
}

export default class New extends Command {
  static description = 'describe the command here'

  static flags = {
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {flags} = this.parse(New)

    if (flags.name === undefined || flags.name === null) {
      logBeauty.error('ìs necessary a name for create project')
    } else {
      const dir = `./${flags.name}`

      if (!fs.existsSync(dir)) {
        logBeauty.info('Generate project')
        startProject(flags.name)
        logBeauty.info('Install Packages')
        intallPackages(flags.name)
      }
    }
  }
}

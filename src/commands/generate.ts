import {Command, flags} from '@oclif/command'
const fs = require('fs')
const requireText = require('require-text')
const logBeauty = require('log-beautify')

function capitalize(str: string) {
  const lower = str.toLowerCase()
  return str.charAt(0).toUpperCase() + lower.slice(1)
}

function insertAt(index: number, value: string, array: Array<any>) {
  array.splice(index, 0, value)
  return array
}

function generateFiles(name: string) {
  const schemaTxt: any = requireText('../assets/generate/schema.txt', require)
  const routeTxt: any = requireText('../assets/generate/route.txt', require)
  fs.writeFileSync(
    `./src/databases/${capitalize(name)}DA.ts`,
    schemaTxt
    .replace(/#LOWERNAME/g, name.toLowerCase())
    .replace(/#CAPINAME/g, capitalize(name))
  )
  fs.writeFileSync(
    `./src/api/Routes/${capitalize(name)}Route.ts`,
    routeTxt
    .replace(/#LOWERNAME/g, name.toLowerCase())
    .replace(/#DATAACCESS/g, capitalize(name) + 'DA')
  )
  logBeauty.success('Files generated correctly')
}

function addImportAndUse(name: string) {
  const stringIndex = fs
  .readFileSync('./src/api/index.ts')
  .toString()
  .replace(/\r\n/g, '\n')
  .split('\n')

  let cleanLines: Array<string> = stringIndex.filter(
    (i: string) => !(i === '')
  )

  const linesImport = cleanLines.filter((x: string) => x.includes('import'))

  cleanLines = insertAt(
    linesImport.length,
    `import ${name.toLowerCase()} from './Routes/${capitalize(name)}Route';`,
    cleanLines
  )
  cleanLines = insertAt(
    cleanLines.length - 1,
    `router.use('/${name.toLowerCase()}', ${name.toLowerCase()});`,
    cleanLines
  )

  const routeLine = cleanLines.findIndex((x: any) => x.includes('.Router()'))

  cleanLines = insertAt(routeLine, '', cleanLines)
  cleanLines = insertAt(routeLine + 2, '', cleanLines)
  cleanLines = insertAt(cleanLines.length - 1, '', cleanLines)

  const str = cleanLines.join('\r\n')
  fs.writeFile('./src/api/index.ts', str, () => {
    logBeauty.success('index has been update correctly')
  })
}

export default class Generate extends Command {
  static description = 'describe the command here';

  static flags = {
    name: flags.string({char: 'n', description: 'Name for component'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  };

  static args = [{name: 'file'}];

  async run() {
    const {args, flags} = this.parse(Generate)

    const dir = './src/api'

    if (flags.name === null || flags.name === undefined) {
      logBeauty.error('Give a name with flag -n to generate controller')
      return false
    }

    if (fs.existsSync(dir)) {
      logBeauty.info('Generate DataAccess and Router.')
      generateFiles(flags.name)
      logBeauty.info('Modify index with new route.')
      addImportAndUse(flags.name)
    } else {
      logBeauty.error(
        'It is necessary to be in the project path to be able to generate controller'
      )
    }

    if (args.file && flags.force) {
      logBeauty.info(`you input --force and --file: ${args.file}`)
    }
  }
}

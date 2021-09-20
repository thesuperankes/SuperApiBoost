# README

SABO is a client to make project node js typescript faster and easy.

## Installation

Using npm

```bash
npm i -g superapiboost
```

## Commands

To generate a new project use the command:
```bash
sabo start -n=[NAME]
```
When start a new project remember add the mongo uri in the file mongo.ts

``` typescript
import mongoose from 'mongoose';

var MONGODB_URL = "[URI]";
```

To generate new controller and route use:
```bash
sabo generate -n=[NAME]
```
This command create a couple of files in the folders:

```bash
src/api/databases/[NAME]DA.ts
src/api/Routes/[NAME]Route.ts
#This file has been modify
src/api/index.ts
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)

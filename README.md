# README

SABO is a client to make rest api nodejs, typescript, express, mongoose faster and easy.

## Usage & Demo

[Stackblitz Demo](https://stackblitz.com/edit/superapiboost-demo)

## Instalation

Using npm

```bash
npm i -g superapiboost
```

## Commands

To generate a new project use the command:
```bash
sabo new -n=[NAME]
```
### Folder structure: 

```
📦API
 ┣ 📂node_modules
 ┣ 📂src
 ┃ ┣ 📂api
 ┃ ┃ ┣ 📂routes
 ┃ ┃ ┗ 📜index.ts
 ┃ ┣ 📂controllers
 ┃ ┃ ┗ 📜mongoBasic.ts #Basic CRUD Methods
 ┃ ┣ 📂interfaces
 ┃ ┣ 📂tools #transversal functions in the project
 ┃ ┃ ┗ 📜validateType.ts
 ┃ ┣ 📜app.ts
 ┃ ┣ 📜config.ts
 ┃ ┗ 📜mongo.ts
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┗ 📜tsconfig.json
```


### Config.ts remember add the mongo uri in this file.

``` typescript
export default {
    MONGO: process.env.MONGO || 'URI',
    PORT: process.env.PORT || 8080,
    MESSAGES: {
        success:'Success',
        error: 'Failed',
        createError: `Can't create record`,
        updateError: `Can't update record`,
        delete: `Can't delete record`,
        
    }
};
```

### Generate

This command make the route and controller

```bash
sabo generate -n=[NAME] -p=[ROUTE]
```
You can generate the interface and mongo schema if you create a json file with the next example structure:

### Structure json.

```json
{
  "name":{
    "type":"string",
    "required":true,
    "default":"'Andy'"
  },
  "cellphone":{
    "type":"number",
    "required":false
  },
  "isValid":{
    "type":"boolean",
    "required":true,
    "default":"true"
  }
}
```

and use the flag -p path:

```bash
sabo generate -n=User -p="C:/models/user.json"
```

### Files Generated


```
📦API
 ┣ 📂src
 ┃ ┣ 📂api
 ┃ ┃ ┣ 📂routes
 ┃ ┃ ┃ ┗ 📜userRoute.ts
 ┃ ┃ ┗ 📜index.ts //this file has been modificated
 ┃ ┣ 📂controllers
 ┃ ┃ ┗ 📜userController.ts
 ┃ ┣ 📂interfaces
 ┃ ┃ ┗ 📂user
 ┃ ┃ ┃ ┗ 📜IUser.ts
```

## Run
```bash
npm start
```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)

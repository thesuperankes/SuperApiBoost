export class Tools {
  constructor() {}

  static capitalize(str: string) {
    const lower = str.toLowerCase();
    return str.charAt(0).toUpperCase() + lower.slice(1);
  }

  static convertStringToType(type: string) {
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

  static isObjectEmpty(object: any) {
    var isEmpty = true;
    for (let keys in object) {
      isEmpty = false;
      break; // exiting since we found that the object is not empty
    }
    return isEmpty;
  }
}

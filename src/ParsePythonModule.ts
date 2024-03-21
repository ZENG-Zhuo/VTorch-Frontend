import {globSync} from 'glob';
import { ClassInfo, FuncInfo, extractClassesAndFunctions } from './ParsePythonFuncClass';

export class FileModuleNode {
  path: string;
  name: string;
  classes: ClassInfo[];
  functions: FuncInfo[];

  constructor(filePath: string) {
    this.path = filePath;
    if (!filePath.endsWith('.py')) {
      throw new Error(`FileModule ${filePath} does not end with .py`);
    }
    this.name = filePath.split('/'). pop() || "";
    console.log(`Parsing: ${filePath}`);
    this.classes = [];
    this.functions = [];
  }

  toString(): string {
    return this.toStringRecursive('');
  }

  public toStringRecursive(indentation: string): string {
    let result = `${indentation}FileModuleNode: ${this.name} (${this.path})\n`;
    indentation += '  ';
    for (const className of this.classes) {
      result += `${indentation}Class: ${className.toString()}\n`;
    }
    for (const functionName of this.functions) {
      result += `${indentation}Function: ${functionName.toString()}\n`;
    }
    return result;
  }

  toJSON(): any {
    return {
      path: this.path,
      name: this.name,
      classes: this.classes.map((classInfo) => classInfo.toJSON()),
      functions: this.functions.map((funcInfo) => funcInfo.toJSON())
    };
  }

  static fromJSON(data: string): FileModuleNode {
    console.log("Parsing: " + data);
    const json = JSON.parse(data);
    const fileModuleNode = new FileModuleNode(json.path);
    fileModuleNode.name = json.name;
    fileModuleNode.classes = json.classes.map((classData: any) =>
      ClassInfo.fromJSON(JSON.stringify(classData))
    );
    fileModuleNode.functions = json.functions.map((funcData: any) =>
      FuncInfo.fromJSON(JSON.stringify(funcData))
    );
    return fileModuleNode;
  }
}

export class FolderModuleNode {
  path: string;
  name: string;
  children: (FileModuleNode | FolderModuleNode)[];

  constructor(filePath: string) {
    console.log("Filepath: {}" + filePath);
    this.path = filePath;
    this.name = filePath.split('/').pop() || "";
    this.children = [];
  }

  toString(): string {
    return this.toStringRecursive('');
  }

  public toStringRecursive(indentation: string): string {
    let result = `${indentation}FolderModuleNode: ${this.name} (${this.path})\n`;
    indentation += '  ';
    for (const child of this.children) {
      result += child.toStringRecursive(indentation);
    }
    return result;
  }

  toJSON(): any {
    return {
      path: this.path,
      name: this.name,
      children: this.children.map((child) => child.toJSON())
    };
  }

  static fromJSON(data: string): FolderModuleNode {
    const json = JSON.parse(data);
    const folderModuleNode = new FolderModuleNode(json.path);
    folderModuleNode.name = json.name;
    folderModuleNode.children = json.children.map((childData: any) => {
      if (childData.hasOwnProperty('classes') && childData.hasOwnProperty('functions')) {
        return FileModuleNode.fromJSON(JSON.stringify(childData));
      } else {
        return FolderModuleNode.fromJSON(JSON.stringify(childData));
      }
    });
    return folderModuleNode;
  }
}

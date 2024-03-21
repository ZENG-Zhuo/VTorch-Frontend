export class ClassInfo {
  name: string;
  bases?: string[];
  functions: FuncInfo[];

  constructor(name: string, bases?: string[]) {
    this.name = name;
    this.bases = bases;
    this.functions = [];
  }

  addFunction(functionInfo: FuncInfo) {
    this.functions.push(functionInfo);
  }

  toString(): string {
    let result = `ClassInfo: ${this.name}\n`;
    if (this.bases && this.bases.length > 0) {
      result += `  Bases: ${this.bases.join(", ")}\n`;
    }
    for (const functionInfo of this.functions) {
      result += functionInfo.toString();
    }
    return result;
  }

  toJSON(): any {
    return {
      name: this.name,
      bases: this.bases,
      functions: this.functions.map((funcInfo) => funcInfo.toJSON()),
    };
  }

  static fromJSON(json: string): ClassInfo {
    const data = JSON.parse(json);
    const classInfo = new ClassInfo(data.name, data.bases);
    classInfo.functions = data.functions.map((funcData: any) =>
      FuncInfo.fromJSON(JSON.stringify(funcData))
    );
    return classInfo;
  }
}

export class FuncInfo {
  name: string;
  parameters: ParameterInfo[];
  return_type: TypeInfo | null;

  constructor(
    name: string,
    parameters: ParameterInfo[] = [],
    return_type: TypeInfo | null = null
  ) {
    this.name = name;
    this.parameters = parameters;
    this.return_type = return_type;
  }

  addParameter(parameterInfo: ParameterInfo) {
    this.parameters.push(parameterInfo);
  }

  toString(): string {
    let result = `  FunctionInfo: ${this.name}\n`;
    if (this.parameters.length > 0) {
      result += `    Parameters:\n`;
      for (const parameterInfo of this.parameters) {
        result += `      ${parameterInfo.toString()}\n`;
      }
    }
    if (this.return_type) {
      result += `    Return type: ${this.return_type.toString()}\n`;
    }
    return result;
  }

  toJSON(): any {
    return {
      name: this.name,
      parameters: this.parameters.map((paramInfo) => paramInfo.toJSON()),
      return_type: this.return_type ? this.return_type.toJSON() : null,
    };
  }

  static fromJSON(json: string): FuncInfo {
    const data = JSON.parse(json);
    const funcInfo = new FuncInfo(data.name, data.parameters, data.return_type);
    funcInfo.parameters = data.parameters.map((paramData: any) =>
      ParameterInfo.fromJSON(JSON.stringify(paramData))
    );
    if (data.return_type) {
      funcInfo.return_type = TypeInfo.fromJSON(
        JSON.stringify(data.return_type)
      );
    }
    return funcInfo;
  }
}

export class ParameterInfo {
  name: string;
  type_hint?: TypeInfo;
  star: boolean;
  power: boolean;
  initial_value?: string;

  constructor(name: string, type_hint?: TypeInfo) {
    this.name = name;
    this.type_hint = type_hint;
    this.power = false;
    this.star = false;
  }

  toString(): string {
    let parameterString = `ParameterInfo: ${this.name}`;
    if (this.star) {
      parameterString = `ParameterInfo: *${this.name}`;
    }

    if (this.power) {
      parameterString = `ParameterInfo: **${this.name}`;
    }
    if (this.initial_value) {
      parameterString += ` = ${this.initial_value}`;
    }

    if (this.type_hint) {
      parameterString += ` (${this.type_hint.toString()})`;
    }
    return parameterString;
  }
  toOriginStr(): string {
    let parameterString = `${this.name}`;
    if (this.star) {
      parameterString = `*${this.name}`;
    }

    if (this.power) {
      parameterString = `**${this.name}`;
    }
    if (this.initial_value) {
      parameterString += `=${this.initial_value}`;
    }
    return parameterString;
  }

  toJSON(): any {
    return {
      name: this.name,
      type_hint: this.type_hint ? this.type_hint.toJSON() : undefined,
      star: this.star,
      power: this.power,
      initial_value: this.initial_value,
    };
  }

  static fromJSON(json: string): ParameterInfo {
    const data = JSON.parse(json);
    const paramInfo = new ParameterInfo(data.name);
    if (data.type_hint) {
      paramInfo.type_hint = TypeInfo.fromJSON(data.type_hint);
    }
    paramInfo.star = data.star;
    paramInfo.power = data.power;
    paramInfo.initial_value = data.initial_value;
    return paramInfo;
  }
}

export class TypeInfo {
  private type: string;
  private subtypes: TypeInfo[];

  constructor(type: string, subtypes: TypeInfo[] = []) {
    this.type = type;
    this.subtypes = subtypes;
  }

  getType(): string {
    return this.type;
  }

  getSubtypes(): TypeInfo[] {
    return this.subtypes;
  }

  toString(): string {
    if (this.subtypes.length > 0) {
      const subtypesStr = this.subtypes
        .map((subtype) => subtype.toString())
        .join(", ");
      return `${this.type}[${subtypesStr}]`;
    }
    return this.type;
  }

  toJSON(): any {
    if (this.subtypes.length === 0) {
      return {
        type: this.type,
      };
    } else {
      return {
        type: this.type,
        subtypes: this.subtypes.map((subtype) => subtype.toJSON()),
      };
    }
  }

  static fromJSON(json: any): TypeInfo {
    console.log("Parsing type string: ");
    console.log(json);
    if (!json.subtypes) {
      return new TypeInfo(json.type);
    } else {
      const subtypes = json.subtypes.map((subtypeData: any) =>
        TypeInfo.fromJSON(subtypeData)
      );
      return new TypeInfo(json.type, subtypes);
    }
  }
}

export function extractClassesAndFunctions(path: string){
  return undefined;
}
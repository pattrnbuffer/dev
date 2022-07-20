import type * as Yargs from 'yargs';

export type CommandModule = Yargs.CommandModule & {
  name: string;
  params?: string[];
  options: CommandOptions;
};

export type CommandOptions = Yargs.Options & {};

export namespace TypeCheck {
  export type Value = {
    configPath: string;
    projectPath: string;
    lines: Line[];
    files: File[];
  };

  export type Line = {
    file: string;
    line: string;
    column: string;
  };

  export type File = {
    file: string;
    lines: Line[];
  };
}

// export type Invariant<T> = (value: T, message: string) => T;

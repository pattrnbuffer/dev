export type DailyDatabase = {
  schema: unknown;
  data: {
    supplements: Record<string, Supplement>;
    forumlations: Record<string, Formulation>;
  };
};

export type Supplement = {
  name: string;
  volume: string;
  mass: string;
  density?: string;
  servingSize: number;
  readings?: [string, string][];
};

export type Formulation = {
  name: string;
};

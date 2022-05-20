export const matrixToCSV = (a: Array<Array<number>>): string =>
  a.map((e) => e.join(",")).join("\n");

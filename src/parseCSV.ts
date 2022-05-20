const splitLines = (s: string) => s.split("\n");

const splitElements = (s: string) => s.split(",");

export const parseCSV = (s: string): Array<Array<number>> => {
  if (!s) {
    return new Array<Array<number>>();
  }

  const ll = splitLines(s);
  if (ll.length === 0) {
    return new Array<Array<number>>();
  }

  const r = ll.length;
  const c = splitElements(ll[0]).length;
  const a = new Array<Array<number>>(r);
  for (let i = 0; i < r; i++) {
    a[i] = new Array<number>(c);
  }

  ll.forEach((l, i) => {
    splitElements(l).forEach((e, j) => {
      const n = parseFloat(e.trim());
      a[i][j] = isNaN(n) ? 0 : n;
    });
  });

  return a;
};

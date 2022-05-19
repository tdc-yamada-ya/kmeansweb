import { Global } from "@emotion/react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Fragment, useState } from "react";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import kmeans from "kmeans-ts";

const SectionHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <Box sx={{ padding: "0.5rem 1rem" }}>
    <Typography color="primary" variant="subtitle1">
      {title}
    </Typography>
    <Typography variant="body2">{description}</Typography>
  </Box>
);

const Divider = () => <Box sx={{ background: "#eee" }} />;

const Textarea = ({
  value,
  readOnly,
  onChange,
}: {
  value?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}) => (
  <textarea
    css={{
      background: "transparent",
      borderWidth: 0,
      display: "block",
      fontFamily: "monospace",
      fontSize: "16px",
      height: "100%",
      margin: "0",
      padding: "1rem",
      outline: "none",
      overflow: "auto",
      resize: "none",
      whiteSpace: "pre-wrap",
      width: "100%",
    }}
    placeholder={"100,200"}
    readOnly={readOnly}
    value={value}
    onChange={(e) => onChange?.(e.target.value)}
  />
);

const splitLines = (s: string) => s.split("\n");

const splitElements = (s: string) => s.split(",");

const csvToMatrix = (s: string): Array<Array<number>> => {
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

const matrixToCsv = (a: Array<Array<number>>): string =>
  a.map((e) => e.join(",")).join("\n");

export const App = () => {
  const [data, setData] = useState("");
  const [k, setK] = useState("10");
  const [result, setResult] = useState("");

  const run = () => {
    const a = csvToMatrix(data);
    const b = parseInt(k);
    const { centroids } = kmeans(a, b, "kmeans++");
    const c = matrixToCsv(centroids);
    setResult(c);
  };

  return (
    <Fragment>
      <Global
        styles={{
          "*": { boxSizing: "border-box" },
          body: { margin: 0 },
        }}
      />
      <Box sx={{ height: "100vh" }}>
        <Box
          sx={{
            display: "grid",
            height: "100%",
            gridTemplateColumns: "100%",
            gridTemplateRows: "min-content 1px 1fr",
          }}
        >
          <Box>
            <Box sx={{ padding: "0.5rem" }}>
              <Button
                variant="contained"
                size="small"
                startIcon={<PlayCircleOutlineIcon />}
                onClick={() => run()}
              >
                Run
              </Button>
            </Box>
          </Box>
          <Divider />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1px 1fr 1px 1fr",
              gridTemplateRows: "100%",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "100%",
                gridTemplateRows: "min-content 1fr",
              }}
            >
              <SectionHeader
                title="Data"
                description="Enter numerical data for k-means clustering. The data format is comma-separated CSV. Write a vector per line."
              />
              <Box css={{ background: "#FFFDE7" }}>
                <Textarea value={data} onChange={(v) => setData(v)} />
              </Box>
            </Box>
            <Divider />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "100%",
                gridTemplateRows: "min-content 1fr",
              }}
            >
              <Box>
                <SectionHeader
                  title="Parameters"
                  description="Enter k-means parameters."
                />
              </Box>
              <Box>
                <Box sx={{ padding: "1rem" }}>
                  <TextField
                    label="Num clusters"
                    size="small"
                    value={k}
                    onChange={(e) => setK(e.target.value)}
                  />
                </Box>
              </Box>
            </Box>
            <Divider />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "100%",
                gridTemplateRows: "min-content 1fr",
              }}
            >
              <SectionHeader
                title="Result Centroids"
                description="Centroid vectors for each cluster."
              />
              <Box css={{ background: "#E3F2FD" }}>
                <Textarea value={result} readOnly />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Fragment>
  );
};

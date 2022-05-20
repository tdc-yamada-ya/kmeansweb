import { Global } from "@emotion/react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Fragment, useState } from "react";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import kmeans from "kmeans-ts";
import { parseCSV } from "./parseCSV";
import { matrixToCSV } from "./matrixToCSV";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const SectionHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <Box sx={{ display: "flex", flexDirection: "column" }}>
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

export const App = () => {
  const [inputVectorsCSV, setInputVectorsCSV] = useState(
    "100,200\n300,400\n500,600"
  );
  const [k, setK] = useState("10");
  const [outputCentroidsCSV, setOutputCentroidsCSV] = useState("");
  const [outputIndexesCSV, setOutputIndexesCSV] = useState("");
  const [chartOptions, setChartOptions] = useState({});

  const run = () => {
    const a = parseCSV(inputVectorsCSV);
    if (a.length <= 1) {
      setOutputCentroidsCSV("");
      return;
    }

    const b = parseInt(k);
    const { centroids, indexes } = kmeans(a, b, "kmeans++");
    setOutputCentroidsCSV(matrixToCSV(centroids));
    setOutputIndexesCSV(indexes.join("\n"));

    const d = a[0].length;

    if (d === 1) {
      const ss = new Array<{ data: number[][] }>(b);
      for (let i = 0; i < b; i++) ss[i] = { data: [] };
      a.forEach((d, i) => ss[indexes[i]].data.push([d[0], 0]));

      setChartOptions({
        chart: { type: "scatter", zoomType: "xy" },
        title: { text: "Plot" },
        series: ss,
      });
    } else if (d === 2) {
      const ss = new Array<{ data: number[][] }>(b);
      for (let i = 0; i < b; i++) ss[i] = { data: [] };
      a.forEach((d, i) => ss[indexes[i]].data.push(d));

      setChartOptions({
        chart: { type: "scatter", zoomType: "xy" },
        title: { text: "Plot" },
        series: ss,
      });
    }
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
            <Box
              sx={{
                alignItems: "center",
                padding: "0.5rem 1rem",
                display: "flex",
                gap: "0.5rem",
              }}
            >
              <Typography variant="subtitle2">k-means web</Typography>
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
              display: "flex",
              flexWrap: "nowrap",
              gap: "0.1rem",
              overflowX: "auto",
            }}
          >
            <Box
              sx={{
                display: "grid",
                flexShrink: 0,
                gap: "1rem",
                gridTemplateColumns: "100%",
                gridTemplateRows: "min-content 1fr",
                padding: "1rem",
                width: "25rem",
              }}
            >
              <SectionHeader
                title="Input Vectors"
                description="Enter numerical data for k-means clustering. The data format is comma-separated CSV. Write a vector per line."
              />
              <Box css={{ background: "#FFFDE7" }}>
                <Textarea
                  value={inputVectorsCSV}
                  onChange={(v) => setInputVectorsCSV(v)}
                />
              </Box>
            </Box>
            <Divider />
            <Box
              sx={{
                display: "grid",
                flexShrink: 0,
                gap: "1rem",
                gridTemplateColumns: "100%",
                gridTemplateRows: "min-content 1fr",
                padding: "1rem",
                width: "25rem",
              }}
            >
              <Box>
                <SectionHeader
                  title="Parameters"
                  description="Enter k-means parameters."
                />
              </Box>
              <Box>
                <TextField
                  label="Num clusters"
                  size="small"
                  value={k}
                  onChange={(e) => setK(e.target.value)}
                />
              </Box>
            </Box>
            <Divider />
            <Box
              sx={{
                display: "grid",
                flexShrink: 0,
                gap: "1rem",
                gridTemplateColumns: "100%",
                gridTemplateRows: "min-content 1fr",
                padding: "1rem",
                width: "25rem",
              }}
            >
              <SectionHeader
                title="Output Centroids"
                description="The following text is an array of center vectors for each cluster."
              />
              <Box css={{ background: "#E3F2FD" }}>
                <Textarea value={outputCentroidsCSV} readOnly />
              </Box>
            </Box>
            <Divider />
            <Box
              sx={{
                display: "grid",
                flexShrink: 0,
                gap: "1rem",
                gridTemplateColumns: "100%",
                gridTemplateRows: "min-content 1fr",
                padding: "1rem",
                width: "25rem",
              }}
            >
              <SectionHeader
                title="Output Indexes"
                description="The following text is an array of indices indicating which cluster each vector corresponds to."
              />
              <Box css={{ background: "#E3F2FD" }}>
                <Textarea value={outputIndexesCSV} readOnly />
              </Box>
            </Box>
            <Box
              sx={{
                display: "grid",
                flexShrink: 0,
                gap: "1rem",
                gridTemplateColumns: "100%",
                gridTemplateRows: "min-content 1fr",
                padding: "1rem",
                width: "50rem",
              }}
            >
              <HighchartsReact highcharts={Highcharts} options={chartOptions} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Fragment>
  );
};

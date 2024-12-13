import React from "react";
import { Grid } from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { ChartContainer } from "../../styles/ArchiveDashboardStyles";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const ArchivedChart = () => {
  const barData = {
    labels: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu"],
    datasets: [
      {
        label: "Ordini Completati",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Ordini in Corso",
        data: [2, 3, 20, 5, 1, 4],
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
    ],
  };

  const pieData = {
    labels: ["Completati", "In Corso", "In Attesa"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
      },
    ],
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <ChartContainer>
          <Bar
            data={barData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </ChartContainer>
      </Grid>
      <Grid item xs={12} md={6}>
        <ChartContainer>
          <Pie
            data={pieData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </ChartContainer>
      </Grid>
    </Grid>
  );
};

export default ArchivedChart;

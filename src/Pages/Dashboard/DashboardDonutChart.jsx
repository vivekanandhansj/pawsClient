import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Filler);

const DashboardDonutChart = ({ countData }) => {
  const data = {
    labels: ["Feed", "Not Feed"],
    datasets: [
      {
        label: "Outer Doughnut",
        data: [countData.nfc, countData.fc],
        backgroundColor: ["#FF6156", "#0ACEA2"],
        borderColor: ["#FF6156", "#0ACEA2"],
        borderWidth: 10,
        hoverBackgroundColor: ["#FF6156", "#0ACEA2"],
        hoverBorderColor: ["#FF6156", "#0ACEA2"],
        borderRadius: 1,
        cutout: "100%",
        spacing: 5,
      },
      {
        label: "Inner Doughnut",
        data: [countData.nfc, countData.fc],
        backgroundColor: ["#FF6156", "#0ACEA2"],
        borderColor: ["#FF6156", "#0ACEA2"],
        borderWidth: 2,
        hoverBackgroundColor: ["#FF6156", "#0ACEA2"],
        hoverBorderColor: ["#FFB6C1", "#0ACEA2"],
        borderRadius: 1,
        cutout: "40%",
        spacing: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.label + ": " + tooltipItem.raw;
          },
          labelColor: function (context) {
            return {
              borderColor: context.element.options.backgroundColor,
              backgroundColor: context.element.options.backgroundColor,
              borderWidth: 1,
              borderRadius: 5,
            };
          },
        },
      },
      legend: {
        position: "top",
        display: false,
        labels: {
          display: false,
        },
      },
    },

    maintainAspectRatio: false,
    aspectRatio: 1,
  };

  return (
    <div
      style={{
        width: "130px",
        height: "130px",
        position: "relative",
      }}
      className="dountChart"
    >
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DashboardDonutChart;

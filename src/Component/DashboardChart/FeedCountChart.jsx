import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors,
);
ChartJS.defaults.color = "#F4F5FC";
import "./FeedCountChart.css";
import { useSelector } from "react-redux";
const FeedCountChart = () => {
  const { weekData } = useSelector((state) => state.dashboard);
  const labels = weekData ? weekData.map((item) => moment(item.fd).date()) : [];
  const dataCounts = weekData ? weekData.map((item) => item.fc) : [];

  const maxFeedCount =
    Math.max(...dataCounts) > 0 ? Math.max(...dataCounts) : 25;
  const stepSize = Math.ceil(maxFeedCount / 5);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Feed count",
        data: dataCounts,
        backgroundColor: "rgb(10 206 162)",
        borderColor: "rgb(10 206 162)",
        borderWidth: 0.2,
        barThickness: 20, // Set fixed bar width (optional)
        maxBarThickness: 30, // Set max bar width (optional)
        categoryPercentage: 0.4, // How much of the available space each category should take up (0.0 - 1.0)
        barPercentage: 0.4,
      },
    ],
  };

  const options = {
    animation: {
      duration: 1000,
      easing: "easeInOutBounce",
    },
    plugins: {
      title: {
        display: true,
        text: "Weekly report",
        font: {
          size: 14,
          weight: 600,
        },
      },
      tooltip: {
        enabled: true,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date range",
        },
        ticks: {
          color: "#F4F5FC",
          fontSize: 20,
        },
        grid: {
          color: "#3658D8", // Grid color for x-axis
          lineWidth: 1.5, // Line width for x-axis grid lines
        },
      },
      y: {
        title: {
          display: true,
          text: "Feed counts",
        },
        beginAtZero: true,
        ticks: {
          stepSize: stepSize,
          max: maxFeedCount,
          min: 0,
          color: "#F4F5FC",
        },
        grid: {
          color: "#3658D8", // Grid color for x-axis
          lineWidth: 1.5, // Line width for x-axis grid lines
        },
      },
    },
  };

  return (
    <>
      <Bar data={data} options={options} className="feedCountBarChart" />
    </>
  );
};

export default FeedCountChart;

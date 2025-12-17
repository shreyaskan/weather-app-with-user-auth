import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type WeatherChartProps = {
  hourlyTimeArray: string[];
  hourlyTemperatureData: Float32Array | null;
};

export default function WeatherChart({
  hourlyTimeArray,
  hourlyTemperatureData,
}: WeatherChartProps) {
  const data = {
    labels: hourlyTimeArray,
    datasets: [
      {
        label: "Temperature (°C)",
        data: hourlyTemperatureData,
        fill: true,
        borderColor: "rgb(21, 153, 118)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "1 Week Temperature Forecast",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Temperature (°C)",
        },
      },
    },
  };

  return (
    <div className="w-[1000px] h-[450px] border-[#159976] border-2 rounded-md flex items-center justify-center">
      <Line data={data} options={options} />
    </div>
  );
}

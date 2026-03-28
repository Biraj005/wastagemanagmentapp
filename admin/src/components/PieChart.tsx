import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ values }: { values: number[] }) {

  const data = {
    labels: ["Resolved", "Pending"],
    datasets: [
      {
        data: values,
        backgroundColor: ["#16a34a", "#facc15"],
        borderColor:     ["#15803d", "#eab308"],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,  
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: false,         
      },
    },
  };

  return (
    <div className={`${true? "w-full" : "w-100"} flex flex-col items-center py-3.5 mt-2 shadow-sm px-4 bg-white rounded-2xl`}>
      <h2 className="font-semibold my-4">Complaint Status Distribution</h2>
      <div className="w-64 h-64">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}

export default PieChart;
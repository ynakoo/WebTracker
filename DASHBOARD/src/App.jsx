import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF"];
function App() {
  // const data=[{name:"youtube",value:100},{name:"you",value:100},{name:"tube",value:100},{name:"utube",value:100}]  
  const [data, setData] = useState([]);
  useEffect(() => {
    chrome.storage.local.get("dailyLogs", (res) => {
      const formatted = Object.entries(res.dailyLogs || {}).map(([name, value]) => ({ name, value }));
      setData(formatted);
    });
  }, []);
  console.log(data)
  return (
    <PieChart width={400} height={400}>
      <Pie data={data} dataKey="value" nameKey="name" outerRadius={150} fill="#8884D8">
        {data.map((entry, index) => <Cell key={index} fill={COLORS[index]} />)}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}
export default App;

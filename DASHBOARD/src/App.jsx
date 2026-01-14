import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF"];
function App() {
  // const data=[{name:"youtube",value:100},{name:"you",value:100},{name:"tube",value:100},{name:"utube",value:100}]
  const [reportStatus, setReportStatus] = useState("loading");
  const [aggregateStatus, setAggregateStatus] = useState("loading")
  const [data, setData] = useState([]);
  useEffect(() => {
    chrome.storage.local.get("todayReport", (res) => {
      if (res.todayReport === undefined) {
        setReportStatus("undefined");
        return;
      }
      if (res.todayReport === null) {
        setReportStatus("null");
        return;
      }
      console.log('todayReport')
      const formatted = Object.entries(res.todayReport).map(([name, value]) => ({ name, value }));
      setData(formatted);
      setReportStatus("ready");
    });

  }, []);
  console.log(data)
  if (reportStatus === "loading") {
    return <p>Loading...</p>;
  }
  if (reportStatus === "undefined") {
    return (
      <p>
        Come back after completing your 24 hours since the beginning.
      </p>
    );
  }
  if (reportStatus === "null") {
    return (
      <p>
        Sorry, you've exceeded the limit of analysis. Come back tomorrow.
      </p>
    );
  }
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

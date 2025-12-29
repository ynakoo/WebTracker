import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [report, setReport] = useState({});
  const [logs,setLogs]=useState([]);
  useEffect(() => {
    chrome.storage.local.get(["logs"], (res) => {
      // setLogs(res.logs || []);
      setReport(res.todayReport || {});
    });
  }, []);

  useEffect(() => {
    function handleStorageChange(changes, area) {
      if (area === "local") {
        if (changes.logs) {
          setLogs(changes.logs.newValue || []);
        }
        // if (changes.todayReport) {
        //   setReport(changes.todayReport.newValue || {});
        // }
      }
    }
  
    chrome.storage.onChanged.addListener(handleStorageChange);
  
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);
  

  useEffect(() => {
    chrome.storage.local.get("logs", (res) => {
      setLogs(res.logs || []);
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.get("todayReport", (res) => {
      setReport(res.todayReport || {});
    });
  }, []);

  const openDashboard = () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL("../../DASHBOARD/dist/index.html")
    });
  };

  return (
    <div className="popup">
      <h3>Today Summary</h3>

      <ul>
        {logs.map((item) => (
          <li key={item.id}>
            website: {item.currentTab}, timeSpent: {item.duration}
          </li>
        ))}
      </ul>

      {/* {Object.keys(report).length === 0 ? (
        <p>No data for today yet.</p>
      ) : (
        Object.entries(report).map(([cat, time]) => (
          <p key={cat}>
            {cat}: {Math.round(time / 60000)} min
          </p>
        ))
      )} */}

      <button onClick={openDashboard}>
        View Dashboard
      </button>
    </div>
  );
}

export default App;


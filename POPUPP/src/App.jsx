import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // const [report, setReport] = useState({});
  const [logs, setLogs] = useState([]);
  //CHANGE: aggregated logs state
  const [aggregatedLogs, setAggregatedLogs] = useState({});
  useEffect(() => {
    function handleStorageChange(changes, area) {
      if (area === "local") {
        if (changes.logs) {
          setLogs(changes.logs.newValue || []);
        }
        // if (changes.todayReport) {
        //   setReport(changes.todayReport.newValue || {});
        // }
        //CHANGE: listen for aggregatedLogs
        if (changes.aggregatedLogs) {
          setAggregatedLogs(changes.aggregatedLogs.newValue || {});
        }
      }
    }

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);


  useEffect(() => {
    chrome.storage.local.get(["logs", "aggregatedLogs"], (res) => {
      setLogs(res.logs || []);
      //CHANGE: load aggregated logs on popup open
      setAggregatedLogs(res.aggregatedLogs || {});
    });
  }, []);

  // useEffect(() => {
  //   chrome.storage.local.get("todayReport", (res) => {
  //     setReport(res.todayReport || {});
  //   });
  // }, []);


  const openDashboard = () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL("../../DASHBOARD/dist/index.html")
    });
  };

  return (
    <div className="popup">
      <h3>Today Summary</h3>

      {/* <ul>
        {logs.map((item) => (
          <li key={item.id}>
            website: {item.currentTab}, timeSpent: {Math.round(item.duration / 1000)}
          </li>
        ))}
      </ul> */}

      {/* {Object.keys(report).length === 0 ? (
        <p>No data for today yet.</p>
      ) : (
        Object.entries(report).map(([cat, time]) => (
          <p key={cat}>
            {cat}: {Math.round(time / 60000)} min
          </p>
        ))
      )} */}
      {/*CHANGE: Aggregated logs */}
      {/* <h4>Aggregated Time</h4> */}
      {Object.keys(aggregatedLogs).length === 0 ? (
        <p>No aggregated data yet.</p>
      ) : (
        <ul>
          {Object.entries(aggregatedLogs).map(([site, time]) => (
            <li key={site}>
              {site}: {Math.round(time / 1000)} sec
            </li>
          ))}
        </ul>
      )}
      <button onClick={openDashboard}>
        View Dashboard
      </button>
    </div>
  );
}

export default App;


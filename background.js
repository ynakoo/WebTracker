importScripts('utils/tracker.js', 'utils/aggregator.js', 'utils/aiCategorizer.js');
let currentTab = null
let startTime = null

// CHANGE: helper to update aggregated logs
// async function updateAggregatedLogs() {
//     const summary = await agrregateDailyLogs()
//     chrome.storage.local.set({ aggregatedLogs: summary })
// }

function saveTab(){
    if (currentTab && startTime){
        const duration = Date.now() - startTime
        saveLog(currentTab,duration)
        //CHANGE: update aggregation every time a log is saved
        updateAggregatedLogs(currentTab, duration)
    }
}
chrome.tabs.onActivated.addListener(async(activeInfo)=>{
    saveTab()
    try {
        const tab = await chrome.tabs.get(activeInfo.tabId);
        
        if (tab?.url && tab.url.startsWith('http')) {
            currentTab = new URL(tab.url).hostname;
            startTime = Date.now();
            console.log("Now tracking:", currentTab);
        } else {
            currentTab = null;
            startTime = null;
        }
    } catch (error) {
        console.error("Error retrieving tab:", error);
    }
    
})



chrome.windows.onFocusChanged.addListener(async(windowId)=>{
    if (windowId === chrome.windows.WINDOW_ID_NONE){
        saveTab()
        currentTab = null
        console.log('console tab')
    }
    else{
        // console.log("chrome tab")
        // startTime = Date.now()
        // here I have to do something so that , I can read the tab info and save it to currentTab and startTime
    console.log("chrome tab")
    try {
        const tabs = await chrome.tabs.query({
            active: true,
            windowId: windowId
        });
        const tab = tabs[0];
        if (tab?.url && tab.url.startsWith('http')) {
            currentTab = new URL(tab.url).hostname;
            startTime = Date.now();
            console.log("Now tracking:", currentTab);
        } else {
            currentTab = null;
            startTime = null;
        }
    } catch (error) {
        console.error("Error retrieving tab:", error);
    } 
    }
})
// chrome.alarms.create("dailyAnalysis",{ periodInMinutes: 2 })
// chrome.alarms.onAlarm.addListener(async(alarm)=>{
//     console.log('hello')
//     if (alarm.name==="dailyAnalysis"){
//         saveTab()
//         startTime = Date.now()
//         // const dailyLogs = await agrregateDailyLogs()
//         // console.log(dailyLogs)
//         //CHANGE: also update aggregated logs on alarm
//         // chrome.storage.local.set({
//         //     logs: [],
//         //     aggregatedLogs: {},
//         //     todayReport: null
//         // })
//         //CHANGE: read aggregated logs directly from storage
//         chrome.storage.local.get(["aggregatedLogs"], (res) => {
//             const dailyLogs = res.aggregatedLogs || {}
//             console.log(dailyLogs)
//             const todayReport = await categorizeLogs(dailyLogs)
//             chrome.storage.local.set({
//                 dailyLogs,           // store snapshot
//                 logs: [],
//                 aggregatedLogs: {},
//                 todayReport: null
//             })
//             // console.log(todayReport)
//         })
//     }
// })
chrome.alarms.create("dailyAnalysis", { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== "dailyAnalysis") return;

  console.log("hello");

  saveTab();
  const startTime = Date.now();

  try {
    const { aggregatedLogs = {} } = await chrome.storage.local.get("aggregatedLogs");

    console.log(aggregatedLogs);

    const todayReport = await categorizeLogs(aggregatedLogs);
    console.log(todayReport)
    await chrome.storage.local.set({
      dailyLogs: aggregatedLogs, // snapshot
      logs: [],
      aggregatedLogs: {},
      todayReport
    });

  } catch (err) {
    console.error("Daily analysis failed:", err);
  }
});

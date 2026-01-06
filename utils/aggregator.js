// function agrregateDailyLogs(){
//     return new Promise((resolve)=>{
//         chrome.storage.local.get(["logs"],(res)=>{
//             const logs = res.logs || []
//             console.log(logs)
//             const summary = {}
//             logs.forEach(({currentTab,duration}) => {
//                 summary[currentTab] = (summary[currentTab] || 0) + duration
//             });
//             resolve(summary)
//         })
//     })
// }
function updateAggregatedLogs(currentTab, duration) {
    chrome.storage.local.get(["aggregatedLogs"], (res) => {
        const aggregatedLogs = res.aggregatedLogs || {};
        aggregatedLogs[currentTab] =
            (aggregatedLogs[currentTab] || 0) + duration;
        chrome.storage.local.set({ aggregatedLogs });
    });
}

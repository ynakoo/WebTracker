importScripts('utils/tracker.js', 'utils/aggregator.js', 'utils/aiCategorizer.js');
let currentTab = null
let startTime = null

function saveTab(){
    if (currentTab && startTime){
        const duration = Date.now() - startTime
        saveLog(currentTab,duration)
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
    }
    else{
        startTime = Date.now()
    }
})
chrome.alarms.create("dailyAnalysis",{ periodInMinutes: 1 })
chrome.alarms.onAlarm.addListener(async(alarm)=>{
    console.log('hello')
    if (alarm.name==="dailyAnalysis"){
        console.log('hello2')
        startTime = Date.now()
        const dailyLogs = await agrregateDailyLogs()
        console.log(dailyLogs)
        // const todayReport = await categorizeLogs(dailyLogs)
        chrome.storage.local.set({dailyLogs})
        // console.log(todayReport)
        chrome.storage.local.set({logs:[]})
    }
})
function agrregateDailyLogs(){
    return new Promise((resolve)=>{
        chrome.storage.local.get(["logs"],(res)=>{
            const logs = res.logs || []
            console.log(logs)
            const summary = {}
            logs.forEach(({currentTab,duration,TimeStamp}) => {
                summary[currentTab] = (summary[currentTab] || 0) + duration
            });
            resolve(summary)
        })
    })
}


function saveLog(currentTab,duration){
    chrome.storage.local.get(['logs'],(res)=>{
        const logs = res.logs || []
        logs.push({currentTab,duration,TimeStamp:Date.now()})
        chrome.storage.local.set({ logs });
    })
}


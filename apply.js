const jsPatches = ["displayFullName"]
const cssPatches = ["hideWCAG"]

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
        for (const patch of jsPatches) {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: [`./patches/${patch}.js`]
            })
        }
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading' && /^http/.test(tab.url)) {
        for (const patch of cssPatches) {
            chrome.scripting.insertCSS({
                target: {tabId: tabId},
                files: [`./patches/${patch}.css`]
            })
        }
    }
})

// "*://*dziennik-uczen.vulcan.net.pl/*"
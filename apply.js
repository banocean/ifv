const jsPatches = ["displayFullName"]
<<<<<<< HEAD
const cssPatches = ["hideWCAG", "alignDetailedGradesButton", "hideTutorsFromBoard"]
=======
const cssPatches = ["hideWCAG", "alignDetailedGradesButton"]
>>>>>>> b7b2c2414b54c4cff39c74a7b75ce2a6e488273d

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
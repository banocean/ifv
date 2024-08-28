const jsPatches = ["displayFullName"];
const cssPatches = [
  "hideWCAG",
  "alignDetailedGradesButton",
  "hideTutorsFromBoard",
];

const defaultOptions = {
  ...cssPatches.reduce(
    (acc, patch) => ({ ...acc, [patch]: { enable: true, type: "css" } }),
    {}
  ),
  ...jsPatches.reduce(
    (acc, patch) => ({ ...acc, [patch]: { enable: true, type: "js" } }),
    {}
  ),
};

chrome.storage.sync.set({ options: defaultOptions });

let config = defaultOptions;

chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (namespace !== "sync") return;
  config = changes.options.newValue;
  chrome.permissions.getAll((permissions) => {
    const hostPatterns = permissions.origins || [];

    hostPatterns.forEach((pattern) => {
      chrome.tabs.query({ url: pattern }, (tabs) => {
        tabs.forEach((tab) => {
          chrome.tabs.reload(tab.id);
        });
      });
    });
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && /^http/.test(tab.url)) {
    for (const patch of jsPatches) {
      if (config[patch].enable)
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: [`./patches/${patch}.js`],
        });
    }
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading" && /^http/.test(tab.url)) {
    for (const patch of cssPatches) {
      if (config[patch].enable)
        chrome.scripting.insertCSS({
          target: { tabId: tabId },
          files: [`./patches/${patch}.css`],
        });
    }
  }
});

// "*://*dziennik-uczen.vulcan.net.pl/*"

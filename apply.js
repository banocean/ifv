/**
 * @typedef {Object} Patch
 * @property {string} name - The name of the patch.
 * @property {string} description - The description of the patch.
 * @property {Object} files - The files to be injected.
 * @property {string[]} [files.css] - An array of CSS file names (optional).
 * @property {string[]} [files.js] - An array of JS file names (optional).
 */

/** @type {Patch[]} */
const patches = [
  {
    name: "Hide WCAG",
    description: "todo",
    files: {
      css: ["hideWCAG.css"],
    },
  },
  {
    name: "Align Detailed Grades Button",
    description: "todo",
    files: {
      css: ["alignDetailedGradesButton.css"],
    },
  },
  {
    name: "Hide Tutors From Board",
    description: "todo",
    files: {
      css: ["hideTutorsFromBoard.css"],
    },
  },
  {
    name: "Display Full Name",
    description: "todo",
    files: {
      js: ["displayFullName.js"],
    },
  },
  {
    name: "Redirect To Board",
    description: "todo",
    files: {
      js: ["redirectToBoard/script.js"],
      css: ["redirectToBoard/styles.css"]
    },
  },
  {
    name: "Add login button in eduVulcan home",
    description: "todo",
    files: {
      js: ["addEduVulcanLoginButton.js"],
      css: ["addEduVulcanLoginButton.css"],
    },
  },
  {
    name: "Hide unneeded tiles in eduVulcan home",
    description: "Hide eduVulcan features tile, eduVulcan app download links tile, eduVulcan banner and ribbon.",
    files: {
      js: ["cleanUpEduVulcanHome.js"]
    }
  }
];

let config = {
  ...patches.reduce(
    (acc, patch) => ({
      ...acc,
      [patch.name]: { description: patch.description, enable: true },
    }),
    {}
  ),
};

chrome.storage.sync.set({ options: config });

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
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: patches.reduce((acc, patch) => {
        if (config[patch.name].enable && patch.files?.js?.length)
          return [...acc, ...patch.files.js.map((file) => `patches/${file}`)];
        return acc;
      }, []),
    });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading" && /^http/.test(tab.url)) {
    chrome.scripting.insertCSS({
      target: { tabId: tabId },
      files: patches.reduce((acc, patch) => {
        if (config[patch.name].enable && patch.files?.css?.length)
          return [...acc, ...patch.files.css.map((file) => `patches/${file}`)];
        return acc;
      }, []),
    });
  }
});

// "*://*dziennik-uczen.vulcan.net.pl/*"
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

const allowedHostnames = [
  "dziennik-uczen.vulcan.net.pl",
  "dziennik-wiadomosci.vulcan.net.pl",
  "uczen.eduvulcan.pl",
  "wiadomosci.eduvulcan.pl"
]

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== "loading" || !/^http/.test(tab.url)) return
  const tabHostname = (new URLPattern(tab.url)).hostname
  if (!allowedHostnames.includes(tabHostname)) return

  chrome.scripting.insertCSS({
    target: { tabId: tabId },
    files: patches.reduce((acc, patch) => {
      if (config[patch.name].enable && patch.files?.css?.length)
        return [...acc, ...patch.files.css.map((file) => `patches/${file}`)];
      return acc
    }, []),
  });

  const [{ result: isInitiated }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      if (!window.modules) {
        window.modules = []
        return false
      }
      return true
    }
  })

  if (!isInitiated) await chrome.scripting.executeScript({
    target: { tabId },
    files: patches.reduce((acc, patch) => {
      if (config[patch.name].enable && patch.files?.js?.length)
        return [...acc, ...patch.files.js.map((file) => `patches/${file}`)];
      return acc;
    }, []),
  })

  chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const isFirstRun = !window.iWasThere; // :)
      window.iWasThere = true

      for (const { onlyOnReloads, isLoaded, run } of window.modules) {
        if (onlyOnReloads && !isFirstRun) continue

        if (isLoaded === undefined) run()
        else if (isLoaded()) run()
        else {
          const observer = new MutationObserver((mutationsList, observer) => {
            if (!isLoaded()) return
            observer.disconnect();
            run();
          });
          observer.observe(document.body, {
            subtree: true,
            childList: true
          })
        }
      }
    }
  });
});

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
    name: chrome.i18n.getMessage("hideFooter"),
    description: "Hides footer (mobile only)",
    files: {
      css: ["hideFooter.css"]
    }
  },
  {
    name: chrome.i18n.getMessage("hideWCAG"),
    description: "todo",
    files: {
      css: ["hideWCAG.css"],
    },
  },
  {
    name: chrome.i18n.getMessage("alignDetailedGradesButton"),
    description: "todo",
    files: {
      css: ["alignDetailedGradesButton.css"],
    },
  },
  {
    name: chrome.i18n.getMessage("hideTutorsFromBoard"),
    description: "todo",
    files: {
      css: ["hideTutorsFromBoard.css"],
    },
  },
  {
    name: chrome.i18n.getMessage("displayFullName"),
    description: "todo",
    files: {
      js: ["displayFullName.js"],
    },
  },
  {
    name: chrome.i18n.getMessage("redirectToBoard"),
    description: "todo",
    files: {
      js: ["redirectToBoard/script.js"],
      css: ["redirectToBoard/styles.css"],
    },
  },
  {
    name: chrome.i18n.getMessage("redirectToEVLogin"),
    description: "todo",
    files: {
      js: ["redirectToEVLogin.js"],
    },
  },
  {
    name: chrome.i18n.getMessage("cleanUpEVHome"),
    description:
    chrome.i18n.getMessage("cleanUpEVHomeDescription"),
    files: {
      css: ["cleanUpEduVulcanHome.css"],
    },
  },
  {
    name: chrome.i18n.getMessage("hideHelpOnDashboard"),
    description: chrome.i18n.getMessage("hideHelpOnDashboardDescription"),
    files: {
      css: ["hideHelpOnDashboard.css"],
    },
  },
  {
    name: chrome.i18n.getMessage("pwa"),
    description: chrome.i18n.getMessage("pwaDescription"),
    files: {
      js: ["pwa.js"],
    }
  },
  {
    name: chrome.i18n.getMessage("attendanceTabs"),
    description: chrome.i18n.getMessage("attendanceTabsDescription"),
    files: {
      css: ["attendance/styles.css"],
      js: ["attendance/tabs.js"]
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

const allowedHostnames = [
  "dziennik-uczen.vulcan.net.pl",
  "dziennik-wiadomosci.vulcan.net.pl",
  "uczen.eduvulcan.pl",
  "wiadomosci.eduvulcan.pl",
  "eduvulcan.pl"
]

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== "loading" || !/^http/.test(tab.url)) return
  const tabHostname = (new URL(tab.url)).hostname
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
      if (!window.modules.length) return console.warn("Script tried executing before all files loaded or all patches are disabled")
      const isFirstRun = !window.iWasThere; // :)
      window.iWasThere = true

      for (const { onlyOnReloads, doesRunHere, isLoaded, run } of window.modules) {
        if (onlyOnReloads && !isFirstRun) continue
        if (doesRunHere !== undefined && !doesRunHere()) continue

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

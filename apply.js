/**
 * @typedef {Object} Patch
 * @property {string} name - The name of the patch.
 * @property {string} description - The description of the patch.
 * @property {Object} files - The files to be injected.
 * @property {string[]} [files.css] - An array of CSS file names (optional).
 * @property {string[]} [files.js] - An array of JS file names (optional).
 */
/* */
/** @type {Patch[]} */
const patches = [
  {
    name: "Hide footer",
    description: "Hides footer (mobile only)",
    files: {
      css: ["hideFooter.css"]
    },
    allowedHostsCss: ["uczen.eduvulcan.pl", "dziennik-uczen.vulcan.net.pl", "wiadomosci.eduvulcan.pl", "dziennik-wiadomosci.vulcan.net.pl"],
  },
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
    allowedHostsCss: ["uczen.eduvulcan.pl", "dziennik-uczen.vulcan.net.pl"],
  },
  {
    name: "Hide Tutors From Board",
    description: "todo",
    files: {
      css: ["hideTutorsFromBoard.css"],
    },
    allowedHostsCss: ["uczen.eduvulcan.pl", "dziennik-uczen.vulcan.net.pl"],
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
      css: ["redirectToBoard/styles.css"],
    },
    allowedHostsCss: [
      "uczen.eduvulcan.pl",
      "wiadomosci.eduvulcan.pl",
      "dziennik-uczen.vulcan.net.pl",
      "dziennik-wiadomosci.vulcan.net.pl",
    ],
  },
  {
    name: "Auto redirect to login page in eduVulcan",
    description: "todo",
    files: {
      js: ["redirectToEVLogin.js"],
    },
  },
  {
    name: "Hide unneeded tiles in eduVulcan home",
    description:
      "Hides eduVulcan app download links tile, eduVulcan banner and ribbon.",
    files: {
      css: ["cleanUpEduVulcanHome.css"],
    },
    allowedHostsCss: ["eduvulcan.pl"],
  },
  {
    name: "Hide Help On Dashboard",
    description: 'Hides "Do you need help" tile',
    files: {
      css: ["hideHelpOnDashboard.css"],
    },
    allowedHostsCss: ["uczen.eduvulcan.pl", "dziennik-uczen.vulcan.net.pl"],
  },
  {
    name: "PWA Support",
    description: "Gives ability to install page as PWA",
    files: {
      js: ["pwa.js"],
    },
  },
  {
    name: "Attendance statistics in separate tab",
    description:
      "Makes attendance page more readable by moving statistics to separate tab",
    files: {
      css: ["attendance/styles.css"],
      js: ["attendance/tabs.js"]
    },
    allowedHostsCss: ["uczen.eduvulcan.pl", "dziennik-uczen.vulcan.net.pl"],
  },
  {
    name: "Reload on resize",
    description: "Reloads page while changing between desktop and mobile layouts",
    files: {
      js: ["fixResizing.js"],
    }
  },
  {
    name: "Mobile Navigation",
    description: "Replaces aside with more readable bottom navigation bar designed (mobile only)",
    files: {
      css: ["newMobileNavbar/styles.css"],
      js: ["newMobileNavbar/index.js", "newMobileNavbar/highlights.js"]
    },
    allowedHostsCss: ["uczen.eduvulcan.pl", "dziennik-uczen.vulcan.net.pl"]
  },
  {
    name: "Dark theme",
    description: "Changes site's theme to dark",
    files: {
      css: ["darkTheme/colors.css", "darkTheme/main.css"]
    }
  }
];

const allowedHostnames = [
  "dziennik-uczen.vulcan.net.pl",
  "dziennik-wiadomosci.vulcan.net.pl",
  "dziennik-logowanie.vulcan.net.pl",
  "uczen.eduvulcan.pl",
  "wiadomosci.eduvulcan.pl",
  "eduvulcan.pl",
];

async function run() {
  let config = (await chrome.storage.sync.get("options"))?.options ?? {};

  patches.forEach(patch => {
    if (config[patch.name] !== undefined) return;
    config[patch.name] = { description: patch.description, enable: true };
  });

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

  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status !== "complete" || !/^http/.test(tab.url)) return;
    const tabHostname = (new URL(tab.url)).hostname;
    if (!allowedHostnames.includes(tabHostname)) return;
    chrome.scripting.insertCSS({
      target: { tabId: tabId },
      files: patches
        .filter((patch) => !patch.allowedHostsCss || patch.allowedHostsCss.includes(tabHostname))
        .reduce((acc, patch) => {
          if (config[patch.name].enable && patch.files?.css?.length)
            return [...acc, ...patch.files.css.map((file) => `patches/${file}`)];
          return acc;
        }, []),
    });

    const [{ result: isInitiated }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        if (!window.modules) {
          window.modules = [];
          return false;
        }
        return true;
      },
    });

    if (!isInitiated)
      await chrome.scripting.executeScript({
        target: { tabId },
        files: patches.reduce((acc, patch) => {
          if (config[patch.name].enable && patch.files?.js?.length)
            return [...acc, ...patch.files.js.map((file) => `patches/${file}`)];
          return acc;
        }, []),
      });

    chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        if (!window.modules.length)
          return console.warn(
            "Script tried executing before all files loaded or all patches are disabled"
          );
        const isFirstRun = !window.iWasThere; // :)
        window.iWasThere = true;

        for (const {
          onlyOnReloads,
          doesRunHere,
          isLoaded,
          run,
        } of window.modules) {
          if (onlyOnReloads && !isFirstRun) continue;
          if (doesRunHere !== undefined && !doesRunHere()) continue;

          if (isLoaded === undefined) run();
          else if (isLoaded()) run();
          else {
            const observer = new MutationObserver((mutationsList, observer) => {
              if (!isLoaded()) return;
              observer.disconnect();
              run();
            });
            observer.observe(document.body, {
              subtree: true,
              childList: true,
            });
          }
        }
      },
    });
  });
}

run();

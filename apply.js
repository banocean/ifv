/**
 * @typedef {Object} Patch
 * @property {string} name - The name of the patch.
 * @property {string} description - The description of the patch.
 * @property {Object} files - The files to be injected.
 * @property {string[]} [files.css] - An array of CSS file names (optional).
 * @property {string[]} [files.js] - An array of JS file names (optional).
 * @property {string} [devices] - Device type: "mobileOnly", "desktopOnly" or undefined for both
 */

/** @returns {Promise<Patch[]>} */
const fetchPatches = async () => {
    const patchesResponse = await fetch(chrome.runtime.getURL("patches.json"));
    return await patchesResponse.json();
};

const getConfig = async () =>
    (await chrome.storage.sync.get("options"))?.options ?? {};

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (
        !changes.options?.oldValue ||
        JSON.stringify(changes.options?.oldValue) ===
            JSON.stringify(changes.options?.newValue)
    )
        return;
    if (namespace !== "sync") return;
    window.location.reload();
});

const isMobileView = () => window.innerWidth < 1024;

const shouldInjectPatchForDevice = (patchDeviceType) => {
    if (!patchDeviceType) return true;

    if (patchDeviceType === "mobileOnly") return isMobileView();
    if (patchDeviceType === "desktopOnly") return !isMobileView();

    return true;
};

const getPatchesFiles = (patches, config) => {
    const result = [];

    patches.forEach((patch) => {
        if (config[patch.name] === false) return;
        if (!shouldInjectPatchForDevice(patch.devices)) return;

        if (patch.files?.js?.length) {
            patch.files.js.forEach((file) => {
                result.push({
                    path: `patches/${file}`,
                    type: "js",
                });
            });
        }

        if (
            patch.files?.css?.length &&
            (!patch.allowedHostsCss ||
                patch.allowedHostsCss.includes(window.location.hostname))
        ) {
            patch.files.css.forEach((file) => {
                result.push({
                    path: `patches/${file}`,
                    type: "css",
                    device: patch.devices,
                });
            });
        }
    });

    return result;
};

async function run() {
    let config = await getConfig();
    const patches = await fetchPatches();

    if (
        patches.length > 0 &&
        config[patches[0].name] &&
        typeof config[patches[0].name] === "object" &&
        config[patches[0].name].description
    ) {
        // użytkownik ma stary format configu - kasujemy go
        config = {};
    }

    patches.forEach((patch) => {
        if (config[patch.name] === undefined) {
            config[patch.name] = true;
        }
    });

    chrome.storage.sync.set({ options: config });

    for (const file of getPatchesFiles(patches, config)) {
        const element = document.createElement(
            file.type === "js" ? "script" : "link"
        );
        element.setAttribute(
            file.type === "js" ? "src" : "href",
            chrome.runtime.getURL(file.path)
        );
        if (file.type === "css") {
            element.setAttribute("rel", "stylesheet");
        } else {
            element.setAttribute("type", "module");
            element.classList.add("injected-script");
        }
        document.head.appendChild(element);
    }
}

run();

/**
 * @typedef {Object} Patch
 * @property {string} name - The name of the patch.
 * @property {string} description - The description of the patch.
 * @property {Object} files - The files to be injected.
 * @property {string[]} [files.css] - An array of CSS file names (optional).
 * @property {string[]} [files.js] - An array of JS file names (optional).
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

const getPatchesFiles = (patches, config) => {
    return [
        ...new Set(
            patches
                .flatMap((patch) => {
                    const result = [];
                    if (config[patch.name].enable) {
                        if (patch.files?.js?.length)
                            result.push(
                                patch.files.js.map((file) => `patches/${file}`),
                            );
                        if (
                            (!patch.allowedHostsCss ||
                                patch.allowedHostsCss.includes(
                                    window.location.hostname,
                                )) &&
                            patch.files?.css?.length
                        ) {
                            result.push(
                                patch.files.css.map(
                                    (file) => `patches/${file}`,
                                ),
                            );
                        }
                    }
                    return result;
                })
                .flat(),
        ),
    ];
};

async function run() {
    let config = await getConfig();
    const patches = await fetchPatches();

    patches.forEach((patch) => {
        if (config[patch.name] !== undefined) return;
        config[patch.name] = { description: patch.description, enable: true };
    });

    chrome.storage.sync.set({ options: config });

    for (const filePath of getPatchesFiles(patches, config)) {
        const element = document.createElement(
            filePath.endsWith(".js") ? "script" : "link",
        );
        element.setAttribute(
            filePath.endsWith(".js") ? "src" : "href",
            chrome.runtime.getURL(filePath),
        );
        if (filePath.endsWith(".css"))
            element.setAttribute("rel", "stylesheet");
        else {
            element.setAttribute("type", "module");
            element.classList.add("injected-script");
        }
        document.head.appendChild(element);
    }
}

run();

chrome.storage.sync.get("patchesSettings", (data) => {
    if (data.patchesSettings) {
        sessionStorage.setItem("ifv_patches_settings", JSON.stringify(data.patchesSettings));
    } else {
        sessionStorage.setItem("ifv_patches_settings", JSON.stringify([]));
    }
});

chrome.storage.sync.get("options", (data) => {
    if (data.options) {
        sessionStorage.setItem("ifv_options", JSON.stringify(data.options));
    } else {
        sessionStorage.setItem("ifv_options", JSON.stringify({}));
    }
});

let lastContent = sessionStorage.getItem("ifv_patches_settings");

function saveSettingsToStorage() {
    const newContent = sessionStorage.getItem("ifv_patches_settings");
    if (newContent === lastContent) return;

    chrome.storage.sync.set({ patchesSettings: JSON.parse(newContent) });

    lastContent = newContent;
}

window.addEventListener("ifv-settings-changed", saveSettingsToStorage);

fetch(chrome.runtime.getURL("patches.json"))
    .then(response => response.json())
    .then(data => {
        sessionStorage.setItem("IFV_PATCHES", JSON.stringify(data));
    });

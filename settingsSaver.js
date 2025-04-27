chrome.storage.sync.get("patchesSettings", (data) => {
    if (data.patchesSettings) {
        sessionStorage.setItem("ifv_patches_settings", JSON.stringify(data.patchesSettings));
        console.debug("Patches settings loaded from storage: ", data.patchesSettings);
    } else {
        sessionStorage.setItem("ifv_patches_settings", JSON.stringify([]));
    }
});

let lastContent = sessionStorage.getItem("ifv_patches_settings");

setInterval(() => {
    if (sessionStorage.getItem("ifv_patches_settings") === lastContent) return;
    const newContent = sessionStorage.getItem("ifv_patches_settings");

    chrome.storage.sync.set({ patchesSettings: JSON.parse(newContent) });
    console.debug("Patches settings updated in storage: ", newContent);

    lastContent = newContent;
}, 1000);

fetch(chrome.runtime.getURL("patches.json"))
    .then(response => response.json())
    .then(data => {
        sessionStorage.setItem("IFV_PATCHES", JSON.stringify(data));
    })

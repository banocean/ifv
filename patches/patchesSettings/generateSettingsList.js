export async function generateSettingsList() {
    const patches = JSON.parse(sessionStorage.getItem("IFV_PATCHES"));
    const patchesSettings = JSON.parse(
        sessionStorage.getItem("ifv_patches_settings"),
    );
    const patchesSettingsDiv = document.createElement("div");

    patchesSettingsDiv.className = "settings-list";

    patchesSettingsDiv.appendChild(
        document.createElement("h2")
    ).innerText = "Patches list";

    for (const patch of patches) {
        const patchDiv = document.createElement("div");

        patchDiv.className = "patches-list__item";
        patchDiv.innerHTML = `
            <p>${patch.name}</p>
        `;

        patchesSettingsDiv.appendChild(patchDiv);
    }

    patchesSettingsDiv.appendChild(
        document.createElement("h2")
    ).innerText = "Patches settings";

    for (const setting of patchesSettings) {
        const settingDiv = document.createElement("div");

        settingDiv.className = "settings-list__item";
        settingDiv.innerHTML = `
            <p>${JSON.stringify(setting)}</p>
        `;

        patchesSettingsDiv.appendChild(settingDiv);
    }

    return patchesSettingsDiv;
};
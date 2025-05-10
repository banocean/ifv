export function getSetting(patchName, settingId) {
    const patches = JSON.parse(sessionStorage.getItem("IFV_PATCHES")) || [];
    const patch = patches.find(p => p.name === patchName);
    if (!patch) throw new Error(`Patch with name ${patchName} not found.`);

    const setting = patch.settings?.find(s => s.id === settingId);
    if (!setting) throw new Error(`Setting with id ${settingId} not found in patch ${patchName}.`);

    const patchesSettings = JSON.parse(sessionStorage.getItem("ifv_patches_settings")) || {};
    const savedValue = patchesSettings[patchName]?.[settingId];

    if (setting.type === "boolean") {
        if (savedValue !== undefined) {
            return !!savedValue;
        }
        return setting.default ?? false;
    }

    if (savedValue !== undefined) {
        if (setting.type === "multiselect" && typeof savedValue === 'string') {
            return savedValue.split(',');
        }
        return savedValue;
    }

    if (setting.type === "multiselect") {
        if (Array.isArray(setting.default)) return setting.default;
        if (typeof setting.default === 'string') return setting.default.split(',');
        return [];
    }

    return setting.default;
}

export function saveSetting(patchName, settingId, value) {
    const patches = JSON.parse(sessionStorage.getItem("IFV_PATCHES")) || [];
    const patch = patches.find(p => p.name === patchName);
    if (!patch) {
        console.debug(`Patch with name ${patchName} not found.`);
        return;
    }

    const setting = patch.settings?.find(s => s.id === settingId);
    if (!setting) {
        console.debug(`Setting with id ${settingId} not found in patch ${patchName}.`);
        return;
    }

    let rawPatchesSettings = sessionStorage.getItem("ifv_patches_settings");
    let patchesSettings;

    if (rawPatchesSettings) {
        try {
            patchesSettings = JSON.parse(rawPatchesSettings);
            if (Array.isArray(patchesSettings) || typeof patchesSettings !== 'object' || patchesSettings === null) {
                patchesSettings = {};
            }
        } catch (e) {
            patchesSettings = {};
            console.debug("Error parsing ifv_patches_settings from sessionStorage. Initializing to {}.", e);
        }
    } else {
        patchesSettings = {};
    }

    if (!patchesSettings[patchName]) {
        patchesSettings[patchName] = {};
    }

    patchesSettings[patchName][settingId] = value;
    sessionStorage.setItem("ifv_patches_settings", JSON.stringify(patchesSettings));
    console.debug(`Saved setting ${settingId} for patch ${patchName}:`, value);

    window.dispatchEvent(new CustomEvent("ifv-settings-changed"));
}

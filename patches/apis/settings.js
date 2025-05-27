/**
 * Pobiera wartość określonego ustawienia dla danego patcha.
 *
 * @param {string} patchName Pełna nazwa patcha, dla którego pobierane jest ustawienie.
 * @param {string} settingId Identyfikator ustawienia do pobrania.
 * @returns {boolean|string|number|Array<string>} Zapisana wartość ustawienia. Jeśli nie istnieje zwracana jest wartość domyślna.
 *                                                Rzeczywisty typ zwracanej wartości (np. `boolean` dla ustawień typu boolean,
 *                                                `Array<string>` dla multiselect) zależy od konfiguracji danego `settingId`.
 * @throws {Error} Rzuca błąd, jeśli patch o podanej nazwie (`patchName`) lub ustawienie o podanym ID (`settingId`) nie zostanie znalezione.
 */
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
        if (setting.type === "number" && typeof savedValue === 'string') {
            return parseFloat(savedValue);
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

/**
 * Zapisuje wartość określonego ustawienia dla danego patcha.
 *
 * @param {string} patchName Nazwa patcha, dla którego zapisywane jest ustawienie.
 * @param {string} settingId Identyfikator ustawienia do zapisania.
 * @param {boolean|string|number|string[]} value Wartość ustawienia do zapisania. Typ tej wartości powinien być zgodny
 *                  z oczekiwanym typem dla danego `settingId`.
 * @returns {void}
 * @throws {Error} Rzuca błąd, jeśli patch o podanej nazwie (`patchName`) lub ustawienie o podanym ID (`settingId`) nie zostanie znalezione.
 */
export function saveSetting(patchName, settingId, value) {
    const patches = JSON.parse(sessionStorage.getItem("IFV_PATCHES")) || [];
    const patch = patches.find(p => p.name === patchName);
    if (!patch) throw new Error(`Patch with name ${patchName} not found.`);

    const setting = patch.settings?.find(s => s.id === settingId);
    if (!setting) throw new Error(`Setting with id ${settingId} not found in patch ${patchName}.`);

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

    window.dispatchEvent(new CustomEvent("ifv-settings-changed"));
}

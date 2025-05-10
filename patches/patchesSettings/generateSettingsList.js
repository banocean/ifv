import { getSetting, saveSetting } from '../apis/settings.js';

export async function generateSettingsList() {
    const patches = JSON.parse(sessionStorage.getItem("IFV_PATCHES")) || [];
    const patchesSettingsDiv = document.createElement("div");
    patchesSettingsDiv.className = "patches-list";

    for (const patch of patches) {
        if (!patch.settings?.length) continue;

        const patchDiv = document.createElement("div");
        patchDiv.className = "patch";
        patchDiv.innerHTML = `
            <div class="patch-header">
                <p class="patch-name">${patch.name}</p>
                <p class="patch-description">${patch.description}</p>
            </div>
            <div class="settings-list"></div>
        `;

        const settingsListDiv = patchDiv.querySelector(".settings-list");

        for (const setting of patch.settings) {
            const settingContainerDiv = document.createElement("div");
            settingContainerDiv.className = "setting";
            settingContainerDiv.innerHTML = `
                <div class="setting-header">
                    <span class="setting-name">${setting.name}</span>
                    <span class="separator">—</span>
                    <span class="setting-description">${setting.description}</span>
                </div>
            `;

            const settingInputDiv = document.createElement("div");
            settingInputDiv.className = "setting-input";

            const renderer = settingRenderers[setting.type];
            if (renderer) {
                const currentValue = getSetting(patch.name, setting.id);
                settingInputDiv.innerHTML = renderer(setting, patch.name, currentValue);
            }

            settingContainerDiv.appendChild(settingInputDiv);
            settingsListDiv.appendChild(settingContainerDiv);
        }
        patchesSettingsDiv.appendChild(patchDiv);
    }

    patchesSettingsDiv.querySelectorAll('.setting-boolean-checkbox').forEach((checkbox) => {
        const label = checkbox.parentNode.querySelector("label");
        if (label) {
            label.innerText = checkbox.checked ? "Enabled" : "Disabled";
            checkbox.addEventListener("change", () => {
                label.innerText = checkbox.checked ? "Enabled" : "Disabled";
                saveSetting(checkbox.dataset.patch, checkbox.dataset.setting, checkbox.checked);
            });
        }
    });

    patchesSettingsDiv.querySelectorAll('.setting-select, .setting-text, .setting-color, .setting-number').forEach(input => {
        input.addEventListener('change', () => {
            saveSetting(input.dataset.patch, input.dataset.setting, input.value);
        });
    });

    patchesSettingsDiv.querySelectorAll('.setting-multiselect-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const patchName = checkbox.dataset.patch;
            const settingId = checkbox.dataset.setting;
            const selectedValues = Array.from(
                patchesSettingsDiv.querySelectorAll(`.setting-multiselect-checkbox[data-patch='${patchName}'][data-setting='${settingId}']:checked`)
            ).map(cb => cb.value);
            saveSetting(patchName, settingId, selectedValues);
        });
    });

    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "buttons";
    buttonsDiv.innerHTML = `
        <button class="reset-button" title="spowoduje odświeżenie strony">Zresetuj do domyślnych</button>
        <button class="apply-button" title="spowoduje odświeżenie strony">Zastosuj ustawienia</button>
    `
    patchesSettingsDiv.appendChild(buttonsDiv);

    patchesSettingsDiv.querySelector(".apply-button").addEventListener("click", () => window.location.reload());
    patchesSettingsDiv.querySelector(".reset-button").addEventListener("click", () => {
        for (const patch of patches) {
            if (!patch.settings?.length) continue;
            for (const setting of patch.settings) {
                if (setting.type === "boolean") {
                    saveSetting(patch.name, setting.id, setting.default ?? false);
                } else if (setting.type === "multiselect") {
                    saveSetting(patch.name, setting.id, setting.default ?? []);
                } else {
                    saveSetting(patch.name, setting.id, setting.default ?? '');
                }
            }
        }
        window.location.reload();
    });

    return patchesSettingsDiv;
}

const settingRenderers = {
    select: (setting, patchName, currentValue) => `
        <select class="setting-select" data-patch="${patchName}" data-setting="${setting.id}">
            ${setting.options.map(option => `
                <option value="${option.value}" ${option.value === currentValue ? 'selected' : ''}>${option.name}</option>
            `).join('')}
        </select>
    `,
    text: (setting, patchName, currentValue) => `
        <input type="text" class="setting-text" data-patch="${patchName}" data-setting="${setting.id}" value="${currentValue ?? ''}" placeholder="${setting.default ?? ''}">
    `,
    boolean: (setting, patchName, currentValue) => `
        <div class="setting-boolean">
            <div class="checkbox-item">
                <input type="checkbox" class="setting-boolean-checkbox" id="${patchName}-${setting.id}" data-patch="${patchName}" data-setting="${setting.id}" ${currentValue ? "checked" : ""}>
                <label for="${patchName}-${setting.id}"></label>
            </div>
        </div>
    `,
    multiselect: (setting, patchName, currentValue) => {
        const selectedValues = Array.isArray(currentValue) ? currentValue : [];
        return `
            <div class="setting-multiselect">
                ${setting.options.map(option => `
                    <div class="checkbox-item">
                        <input type="checkbox" class="setting-multiselect-checkbox"
                            id="${patchName}-${setting.id}-${option.value}"
                            data-patch="${patchName}"
                            data-setting="${setting.id}"
                            value="${option.value}"
                            ${selectedValues.includes(option.value) ? 'checked' : ''}>
                        <label for="${patchName}-${setting.id}-${option.value}">${option.name}</label>
                    </div>
                `).join('')}
            </div>
        `;
    },
    color: (setting, patchName, currentValue) => `
        <input type="color" class="setting-color" data-patch="${patchName}" data-setting="${setting.id}" value="${currentValue ?? '#000000'}">
    `,
    number: (setting, patchName, currentValue) => `
        <input type="number" class="setting-number" data-patch="${patchName}" data-setting="${setting.id}" value="${currentValue ?? ''}" step="${setting.step || 1}" placeholder="${setting.default ?? ''}">
    `,
};
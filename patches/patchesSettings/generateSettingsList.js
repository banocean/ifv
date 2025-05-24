import { getSetting, saveSetting } from "../apis/settings.js";

const searchIconUrl = "https://raw.githubusercontent.com/yoper12/ifv/refs/heads/patches-settings/assets/icons/search.svg";
const clearIconUrl = "https://raw.githubusercontent.com/yoper12/ifv/refs/heads/patches-settings/assets/icons/clear.svg";

export async function generateSettingsList() {
    const patches = JSON.parse(sessionStorage.getItem("IFV_PATCHES")) || [];
    const config = JSON.parse(sessionStorage.getItem("ifv_options")) || {};
    const patchesSettingsDiv = document.createElement("div");
    patchesSettingsDiv.className = "patches-list";

    patchesSettingsDiv.innerHTML = `
        <div class="search-bar">
            <img src="${searchIconUrl}">
            <input placeholder="Search" type="text" autofocus />
            <button id="clear">
                <img src="${clearIconUrl}">
            </button>
        </div>
        <div class="no-results-message">Nie znaleziono pasujących patchy 😿</div>
    `;

    const searchInput = patchesSettingsDiv.querySelector(".search-bar > input");

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim().toLowerCase();
        const noResultsMessageDiv = patchesSettingsDiv.querySelector(
            ".no-results-message"
        );
        let visiblePatchesCount = 0;

        patchesSettingsDiv.querySelectorAll(".patch").forEach((patchDiv) => {
            const patchNameEl = patchDiv.querySelector(".patch-name");
            const patchDescEl = patchDiv.querySelector(".patch-description");

            removeMarks(patchNameEl);
            removeMarks(patchDescEl);
            patchDiv.querySelectorAll(".setting").forEach((settingDiv) => {
                removeMarks(settingDiv.querySelector(".setting-name"));
                removeMarks(settingDiv.querySelector(".setting-description"));
            });

            if (query === "") {
                patchDiv.style.display = "block";
                return;
            }

            let combinedTextContent = patchNameEl.textContent.toLowerCase() + " " + patchDescEl.textContent.toLowerCase() + " ";

            patchDiv.querySelectorAll(".setting").forEach((settingDiv) => {
                combinedTextContent += settingDiv.querySelector(".setting-name").textContent.toLowerCase() + " ";
                combinedTextContent += settingDiv.querySelector(".setting-description").textContent.toLowerCase() + " ";
            });

            if (combinedTextContent.includes(query)) {
                patchDiv.style.display = "block";
                visiblePatchesCount++;

                markTextInElement(patchNameEl, query);
                markTextInElement(patchDescEl, query);

                patchDiv.querySelectorAll(".setting").forEach((settingDiv) => {
                    markTextInElement(settingDiv.querySelector(".setting-name"), query);
                    markTextInElement(settingDiv.querySelector(".setting-description"), query);
                });
            } else {
                patchDiv.style.display = "none";
            }
        });

        if (query === "") {
            noResultsMessageDiv.style.display = "none";
        } else if (visiblePatchesCount === 0) {
            noResultsMessageDiv.style.display = "block";
        } else {
            noResultsMessageDiv.style.display = "none";
        }
    });

    const clearButton = patchesSettingsDiv.querySelector("#clear");
    clearButton.addEventListener("click", () => {
        searchInput.value = "";
        searchInput.dispatchEvent(new Event("input"));
    });

    for (const patch of patches) {
        if (!patch.settings?.length) continue;
        if (config[patch.name] === false) continue;
        if (patch.devices === "mobile" && window.innerWidth >= 1024) continue;
        if (patch.devices === "desktop" && window.innerWidth < 1024) continue;

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
                settingInputDiv.innerHTML = renderer(
                    setting,
                    patch.name,
                    currentValue
                );
            }

            settingContainerDiv.appendChild(settingInputDiv);
            settingsListDiv.appendChild(settingContainerDiv);
        }
        patchesSettingsDiv.appendChild(patchDiv);
    }

    patchesSettingsDiv
        .querySelectorAll(".setting-boolean-checkbox")
        .forEach((checkbox) => {
            const label = checkbox.parentNode.querySelector("label");
            if (label) {
                label.innerText = checkbox.checked ? "Enabled" : "Disabled";
                checkbox.addEventListener("change", () => {
                    label.innerText = checkbox.checked ? "Enabled" : "Disabled";
                    saveSetting(
                        checkbox.dataset.patch,
                        checkbox.dataset.setting,
                        checkbox.checked
                    );
                });
            }
        });

    patchesSettingsDiv
        .querySelectorAll(
            ".setting-select, .setting-text, .setting-color, .setting-number"
        )
        .forEach((input) => {
            input.addEventListener("change", () => {
                saveSetting(
                    input.dataset.patch,
                    input.dataset.setting,
                    input.value
                );
            });
        });

    patchesSettingsDiv
        .querySelectorAll(".setting-multiselect-checkbox")
        .forEach((checkbox) => {
            checkbox.addEventListener("change", () => {
                const patchName = checkbox.dataset.patch;
                const settingId = checkbox.dataset.setting;
                const selectedValues = Array.from(
                    patchesSettingsDiv.querySelectorAll(
                        `.setting-multiselect-checkbox[data-patch='${patchName}'][data-setting='${settingId}']:checked`
                    )
                ).map((cb) => cb.value);
                saveSetting(patchName, settingId, selectedValues);
            });
        });

    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "buttons";
    buttonsDiv.innerHTML = `
        <button class="reset-button" title="spowoduje odświeżenie strony">Zresetuj do domyślnych</button>
        <button class="apply-button" title="spowoduje odświeżenie strony">Zastosuj ustawienia</button>
    `;
    patchesSettingsDiv.appendChild(buttonsDiv);

    patchesSettingsDiv
        .querySelector(".apply-button")
        .addEventListener("click", () => window.location.reload());
    patchesSettingsDiv
        .querySelector(".reset-button")
        .addEventListener("click", () => {
            for (const patch of patches) {
                if (!patch.settings?.length) continue;
                for (const setting of patch.settings) {
                    saveSetting(patch.name, setting.id, setting.default);
                }
            }
            window.location.reload();
        });

    return patchesSettingsDiv;
}

/**
 * @typedef {object} SettingOption
 * @property {string} value Wartość opcji przekazywana patchom.
 * @property {string} name Nazwa opcji wyświetlana użytkownikowi.
 */

/**
 * @typedef {object} Setting
 * @property {string} id Unikalny identyfikator ustawienia.
 * @property {string} name Nazwa ustawienia wyświetlana użytkownikowi.
 * @property {string} description Opis ustawienia.
 * @property {string} type Typ ustawienia (np. "select", "text", "boolean", "multiselect", "color", "number").
 * @property {string|boolean|number|string[]} default Domyślna wartość ustawienia.
 * @property {SettingOption[]} [options] Tablica opcji dla ustawień typu "select" i "multiselect".
 * @property {number} [step] Krok dla ustawień typu "number".
 */

/**
 * Obiekt mapujący typy ustawień na funkcje renderujące odpowiednie inputy HTML.
 * Każda funkcja renderująca przyjmuje obiekt ustawienia, nazwę patcha oraz aktualną wartość ustawienia.
 * @type {Object<string, function(Setting, string, any): string>}
 */
const settingRenderers = {
    /**
     * Renderuje input typu select (lista rozwijana).
     * @param {Setting} setting Obiekt konfiguracji ustawienia.
     * @param {string} patchName Nazwa patcha.
     * @param {string} currentValue Aktualna wartość ustawienia.
     * @returns {string} Ciąg HTML reprezentujący input select.
     */
    select: (setting, patchName, currentValue) => `
        <select class="setting-select" data-patch="${patchName}" data-setting="${
        setting.id
    }">
            ${setting.options
                .map(
                    (option) => `
                <option value="${option.value}" ${
                        option.value === currentValue ? "selected" : ""
                    }>${option.name}</option>
            `
                )
                .join("")}
        </select>
    `,
    /**
     * Renderuje input typu text (pole tekstowe).
     * @param {Setting} setting Obiekt konfiguracji ustawienia.
     * @param {string} patchName Nazwa patcha.
     * @param {string} currentValue Aktualna wartość ustawienia.
     * @returns {string} Ciąg HTML reprezentujący input tekstowy.
     */
    text: (setting, patchName, currentValue) => `
        <input type="text" class="setting-text" data-patch="${patchName}" data-setting="${setting.id}" value="${currentValue}" placeholder="${setting.default}">
    `,
    /**
     * Renderuje input typu boolean (checkbox).
     * @param {Setting} setting Obiekt konfiguracji ustawienia.
     * @param {string} patchName Nazwa patcha.
     * @param {boolean} currentValue Aktualna wartość ustawienia.
     * @returns {string} Ciąg HTML reprezentujący input checkbox.
     */
    boolean: (setting, patchName, currentValue) => `
        <div class="setting-boolean">
            <div class="checkbox-item">
                <input type="checkbox" class="setting-boolean-checkbox" id="${patchName}-${
        setting.id
    }" data-patch="${patchName}" data-setting="${setting.id}" ${
        currentValue ? "checked" : ""
    }>
                <label for="${patchName}-${setting.id}"></label>
            </div>
        </div>
    `,
    /**
     * Renderuje input typu multiselect (wiele checkboxów).
     * @param {Setting} setting Obiekt konfiguracji ustawienia.
     * @param {string} patchName Nazwa patcha.
     * @param {string[]} currentValue Aktualnie zaznaczone wartości.
     * @returns {string} Ciąg HTML reprezentujący grupę checkboxów.
     */
    multiselect: (setting, patchName, currentValue) => {
        const selectedValues = Array.isArray(currentValue)
            ? currentValue
            : typeof currentValue === "string" && currentValue.length > 0
            ? currentValue.split(",")
            : [];
        return `
            <div class="setting-multiselect">
                ${setting.options
                    .map(
                        (option) => `
                    <div class="checkbox-item">
                        <input type="checkbox" class="setting-multiselect-checkbox"
                            id="${patchName}-${setting.id}-${option.value}"
                            data-patch="${patchName}"
                            data-setting="${setting.id}"
                            value="${option.value}"
                            ${
                                selectedValues.includes(option.value)
                                    ? "checked"
                                    : ""
                            }>
                        <label for="${patchName}-${setting.id}-${
                            option.value
                        }">${option.name}</label>
                    </div>
                `
                    )
                    .join("")}
            </div>
        `;
    },
    /**
     * Renderuje input typu color (próbnik kolorów).
     * @param {Setting} setting Obiekt konfiguracji ustawienia.
     * @param {string} patchName Nazwa patcha.
     * @param {string} currentValue Aktualna wartość koloru (hex).
     * @returns {string} Ciąg HTML reprezentujący input color.
     */
    color: (setting, patchName, currentValue) => `
        <input type="color" class="setting-color" data-patch="${patchName}" data-setting="${setting.id}" value="${currentValue}">
    `,
    /**
     * Renderuje input typu number (pole numeryczne).
     * @param {Setting} setting Obiekt konfiguracji ustawienia.
     * @param {string} patchName Nazwa patcha.
     * @param {number} currentValue Aktualna wartość liczbowa.
     * @returns {string} Ciąg HTML reprezentujący input number.
     */
    number: (setting, patchName, currentValue) => `
        <input type="number" class="setting-number" data-patch="${patchName}" data-setting="${
        setting.id
    }" value="${currentValue}" step="${setting.step || 1}" placeholder="${
        setting.default
    }">
    `,
};

/**
 * Usuwa znaczniki <mark> z elementu
 *
 * @param {Node} element element, z którego usuwamy znaczniki <mark>
 * @returns {void}
 */
async function removeMarks(element) {
    const marks = element.querySelectorAll("mark");
    marks.forEach(async (mark) => {
        const parent = mark.parentNode;
        while (mark.firstChild) {
            parent.insertBefore(mark.firstChild, mark);
        }
        parent.removeChild(mark);
    });

    element.normalize();
}

/**
 * Zaznacza tekst w elemencie, który pasuje do podanego zapytania.
 *
 * @param {Node} element element, w którym zaznaczamy tekst
 * @param {string} textQueryToHighlight string do wyszukania
 * @returns {void}
 */
async function markTextInElement(element, textQueryToHighlight) {
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT
    );
    const nodesToModify = [];

    let currentNode;
    while ((currentNode = walker.nextNode())) {
        const nodeText = currentNode.nodeValue;
        const lowerNodeText = nodeText.toLowerCase();

        if (lowerNodeText.includes(textQueryToHighlight)) {
            nodesToModify.push({
                node: currentNode,
                text: nodeText,
                query: textQueryToHighlight,
            });
        }
    }

    nodesToModify.forEach(async ({ node, text, query }) => {
        const lowerText = text.toLowerCase();
        let matchIndex = lowerText.indexOf(query);
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;

        while (matchIndex !== -1) {
            fragment.appendChild(
                document.createTextNode(text.substring(lastIndex, matchIndex))
            );
            const mark = document.createElement("mark");
            mark.textContent = text.substring(
                matchIndex,
                matchIndex + query.length
            );
            fragment.appendChild(mark);

            lastIndex = matchIndex + query.length;
            matchIndex = lowerText.indexOf(query, lastIndex);
        }
        fragment.appendChild(
            document.createTextNode(text.substring(lastIndex))
        );

        node.parentNode.replaceChild(fragment, node);
    });

    element.normalize();
}

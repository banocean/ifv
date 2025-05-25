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
export const settingRenderers = {
    /**
     * Renderuje input typu select (lista rozwijana).
     * @param {Setting} setting Obiekt konfiguracji ustawienia.
     * @param {string} patchName Nazwa patcha.
     * @param {string} currentValue Aktualna wartość ustawienia.
     * @returns {string} Ciąg HTML reprezentujący input select.
     */
    select: (setting, patchName, currentValue) => `
        <select class="setting-select" data-patch="${patchName}" data-setting="${setting.id
        }">
            ${setting.options
            .map(
                (option) => `
                <option value="${option.value}" ${option.value === currentValue ? "selected" : ""
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
                <input type="checkbox" class="setting-boolean-checkbox" id="${patchName}-${setting.id
        }" data-patch="${patchName}" data-setting="${setting.id}" ${currentValue ? "checked" : ""
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
                            ${selectedValues.includes(option.value)
                            ? "checked"
                            : ""
                        }>
                        <label for="${patchName}-${setting.id}-${option.value
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
        <input type="number" class="setting-number" data-patch="${patchName}" data-setting="${setting.id
        }" value="${currentValue}" step="${setting.step || 1}" placeholder="${setting.default
        }">
    `,
};
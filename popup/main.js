const fetchPatches = async () => {
    const patchesResponse = await fetch(chrome.runtime.getURL("patches.json"));
    return await patchesResponse.json();
};

if (/\bMobile\b/.test(navigator.userAgent))
    document.body.classList.add("mobile");

const filterInput = document.querySelector(".filter > div > input");
const categories = document.querySelector(".categories");

filterInput.addEventListener("input", () => {
    const filter = filterInput.value.toLowerCase();

    Array.from(document.querySelectorAll(".options > *")).forEach((option) => {
        if (
            option
                .querySelector(".title")
                .innerText.toLowerCase()
                .includes(filter) ||
            option
                .querySelector(".desc")
                .innerText.toLowerCase()
                .includes(filter)
        ) {
            option.classList.remove("search-hidden");
        } else {
            option.classList.add("search-hidden");
        }
    });
});

categories.addEventListener("input", () => {
    if (categories.value === "mobile") {
        document
            .querySelectorAll(".mobileOnly")
            .forEach((e) => e.classList.remove("category-hidden"));
        document
            .querySelectorAll(".desktopOnly")
            .forEach((e) => e.classList.add("category-hidden"));
    } else if (categories.value === "desktop") {
        document
            .querySelectorAll(".mobileOnly")
            .forEach((e) => e.classList.add("category-hidden"));
        document
            .querySelectorAll(".desktopOnly")
            .forEach((e) => e.classList.remove("category-hidden"));
    } else {
        document
            .querySelectorAll("label")
            .forEach((e) => e.classList.remove("category-hidden"));
    }
    chrome.storage.local.set({ category: categories.value });
});

document.querySelector("#clear").addEventListener("click", async () => {
    filterInput.value = "";
    filterInput.dispatchEvent(new Event("input"));
});

const render = async () => {
    let config = (await chrome.storage.sync.get("options"))?.options ?? {};
    const patches = await fetchPatches();

    chrome.storage.sync.set({ options: config });

    const optionsDOM = document.querySelector(".options");
    optionsDOM.innerHTML = "";

    const sortedPatches = [...patches].sort((a, b) =>
        a.name.localeCompare(b.name, "pl")
    );

    for (const patch of sortedPatches) {
        const isEnabled = config[patch.name] !== false;

        const option = document.createElement("label");
        option.innerHTML = `
            <div style="flex: 1;">
                <p class="title">${patch.name}</p>
                <p class="desc">${patch.description}</p>
            </div>
            ${
                patch.devices === "mobileOnly"
                    ? `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#8e8e8e" title="This patch is mobile only"><path d="M400-160h160v-40H400v40ZM280-40q-33 0-56.5-23.5T200-120v-720q0-33 23.5-56.5T280-920h400q33 0 56.5 23.5T760-840v720q0 33-23.5 56.5T680-40H280Zm0-200v120h400v-120H280Zm0-80h400v-400H280v400Zm0-480h400v-40H280v40Zm0 560v120-120Zm0-560v-40 40Z"/></svg>`
                    : ""
            }
            ${
                patch.devices === "desktopOnly"
                    ? `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#8e8e8e" title="This patch is desktop only"><path d="M40-120v-80h880v80H40Zm120-120q-33 0-56.5-23.5T80-320v-440q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v440q0 33-23.5 56.5T800-240H160Zm0-80h640v-440H160v440Zm0 0v-440 440Z"/></svg>`
                    : ""
            }
            <div class="toggle-wrapper">
                <input class="toggle-input" type="checkbox" ${
                    isEnabled ? "checked" : ""
                }>
                <div class="toggle-switch"></div>
            </div>
        `;
        option.querySelector("input").id = patch.name;
        if (patch.devices === "mobileOnly") option.classList.add("mobileOnly");
        if (patch.devices === "desktopOnly")
            option.classList.add("desktopOnly");
        optionsDOM.appendChild(option);
    }

    optionsDOM.addEventListener("change", async (e) => {
        const target = e.target;
        if (target.tagName === "INPUT") {
            config[target.id] = target.checked;
            await chrome.storage.sync.set({ options: config });
        }
    });

    const { category } = (await chrome.storage.local.get(["category"])) || {};
    if (category) {
        categories.value = category;
        categories.dispatchEvent(new Event("input"));
    } else if (document.body.classList.contains("mobile")) {
        categories.value = "mobile";
        categories.dispatchEvent(new Event("input"));
    } else {
        categories.value = "desktop";
        categories.dispatchEvent(new Event("input"));
    }
};

(async () => {
    const changeAllButton = document.querySelector(".filter > button");
    let nextApplyAllAction =
        (await chrome.storage.sync.get("nextApplyAllAction"))
            .nextApplyAllAction || false;

    const toggleAllButton = async () => {
        chrome.storage.sync.set({ nextApplyAllAction: !nextApplyAllAction });

        const patches = await fetchPatches();
        const config = {};

        patches.forEach((patch) => {
            config[patch.name] = nextApplyAllAction;
        });

        await chrome.storage.sync.set({ options: config });
        await render();
        nextApplyAllAction = !nextApplyAllAction;
        setButtonName();
    };

    const setButtonName = () =>
        (document.querySelector(".filter > button").innerHTML =
            nextApplyAllAction ? "Enable&nbsp;All" : "Disable&nbsp;All");

    setButtonName();
    changeAllButton.addEventListener("click", toggleAllButton);
})();

document.addEventListener("DOMContentLoaded", render);

const fetchPatches = async () => {
    const patchesResponse = await fetch(chrome.runtime.getURL("patches.json"));
    return await patchesResponse.json();
};

if (/\bMobile\b/.test(navigator.userAgent))
    document.body.classList.add("mobile");

const filterInput = document.querySelector(".filter > input");

filterInput.addEventListener("input", () => {
    const filter = filterInput.value.toLowerCase();
    Array.from(document.querySelector(".options").children).forEach(
        (option) => {
            option.style.display =
                option
                    .querySelector(".title")
                    .innerText.toLowerCase()
                    .includes(filter) ||
                option
                    .querySelector(".desc")
                    .innerText.toLowerCase()
                    .includes(filter)
                    ? "flex"
                    : "none";
        },
    );
});

const render = async () => {
    let config = (await chrome.storage.sync.get("options"))?.options ?? {};
    const patches = await fetchPatches();

    patches.forEach((patch) => {
        if (config[patch.name] !== undefined) return;
        config[patch.name] = { description: patch.description, enable: true };
    });
    chrome.storage.sync.set({ options: config });

    const optionsDOM = document.querySelector(".options");
    optionsDOM.innerHTML = "";
    for (const [key, value] of Object.entries(config)) {
        const option = document.createElement("label");
        option.innerHTML = `
            <div style="flex: 1;">
                <p class="title">${key}</p>
                <p class="desc">${value.description}</p>
            </div>
            <div class="toggle-wrapper">
                <input class="toggle-input" type="checkbox" ${value.enable ? "checked" : ""}>
                <div class="toggle-switch"></div>
            </div>
        `;
        option.querySelector("input").id = key;
        optionsDOM.appendChild(option);
    }

    optionsDOM.addEventListener("change", async (e) => {
        const target = e.target;
        if (target.tagName === "INPUT") {
            config[target.id].enable = target.checked;
            await chrome.storage.sync.set({ options: config });
        }
    });
};

(async () => {
    const changeAllButton = document.querySelector(".filter > button");
    let nextApplyAllAction =
        (await chrome.storage.sync.get("nextApplyAllAction"))
            .nextApplyAllAction || false;

    const toggleAllButton = async () => {
        chrome.storage.sync.set({ nextApplyAllAction: !nextApplyAllAction });

        let config = {};
        const patches = await fetchPatches();

        patches.forEach((patch) => {
            if (config[patch.name] !== undefined) return;
            config[patch.name] = {
                description: patch.description,
                enable: nextApplyAllAction,
            };
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

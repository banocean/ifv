const fetchPatches = async () => {
    const patchesResponse = await fetch(chrome.runtime.getURL("patches.json"));
    return await patchesResponse.json();
};

if (/\bMobile\b/.test(navigator.userAgent)) document.body.classList.add("mobile")

const filterInput = document.querySelector(".filter > input")
filterInput.addEventListener("change", () => {
    const filter = filterInput.value.toLowerCase();
    Array.from(document.querySelector(".options").children).forEach((option) => {
        option.style.display =
            option.querySelector(".title").innerText.toLowerCase().includes(filter)
                || option.querySelector(".desc").innerText.includes(filter) ? "flex" : "none"
    })
});

(async () => {
    const changeAllButton = document.querySelector(".filter > button")
    let nextApplyAllAction = ((await chrome.storage.sync.get("nextApplyAllAction")) || false)
    const toggleChangeAllButton = () => {
        chrome.storage.sync.set({ "nextApplyAllAction": !nextApplyAllAction })
        document.querySelectorAll(".options input").forEach((option) => {
            option.checked = nextApplyAllAction
        })
        setButtonName()
        nextApplyAllAction = !nextApplyAllAction
    }
    const setButtonName = () => document.querySelector(".filter > button").innerHTML = nextApplyAllAction ? "Disable&nbsp;All" : "Enable&nbsp;All"

    setButtonName()
    changeAllButton.addEventListener("click", toggleChangeAllButton)
})()

document.addEventListener("DOMContentLoaded", async () => {
    let config = (await chrome.storage.sync.get("options"))?.options ?? {};
    const patches = await fetchPatches();

    patches.forEach((patch) => {
        if (config[patch.name] !== undefined) return;
        config[patch.name] = { description: patch.description, enable: true };
    });
    chrome.storage.sync.set({ options: config });

    const optionsDOM = document.querySelector(".options");
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
        option.querySelector("input").id = key
        optionsDOM.appendChild(option);
    }
    optionsDOM.addEventListener("change", async (e) => {
        const target = e.target;
        if (target.tagName === "INPUT") {
            config[target.id].enable = target.checked;
            await chrome.storage.sync.set({ options: config });
        }
    });
});

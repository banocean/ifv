document.addEventListener("DOMContentLoaded", async () => {
    let config = (await chrome.storage.sync.get("options"))?.options ?? {};
    const optionsDOM = document.querySelector(".options");
    for (const [key, value] of Object.entries(config)) {
        const option = document.createElement("label");
        option.innerHTML = `
        <div style="flex: 1;">
            <p class="title">${key}</p>
            <p class="desc">${value.description}</p>
        </div>
        <div class="toggle-wrapper">
            <input class="toggle-input" type="checkbox" id="${key}" ${value.enable ? "checked" : ""}>
            <div class="toggle-switch"></div>
        </div>
    `;
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

document.addEventListener("DOMContentLoaded", async () => {
    let config = (await chrome.storage.sync.get("options"))?.options ?? {};
    const optionsDOM = document.querySelector(".options");
    for (const [key, value] of Object.entries(config)) {
        const option = document.createElement("div");
        option.className = "option";
        option.innerHTML = `
    <div>
      <label for="${key}">${key}</label>
      <p class ="desc">${value.description}</p>
    </div>
    <input type="checkbox" id="${key}" ${value.enable ? "checked" : ""}>
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

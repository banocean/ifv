const beautifyName = (name) => {
  const words = name.split(/(?<=[a-z])(?=[A-Z])/);
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return capitalizedWords.join(" ");
};

document.addEventListener("DOMContentLoaded", async () => {
  let config = (await chrome.storage.sync.get("options"))?.options ?? {};
  const optionsDOM = document.querySelector(".options");
  for (const [key, value] of Object.entries(config)) {
    const option = document.createElement("div");
    option.className = "option";
    option.innerHTML = `
    <label for="${key}">${beautifyName(key)}</label>
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

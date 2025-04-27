export async function generateSettingsList() {
    const patches = await chrome.runtime.getURL("patches.json"); // wont work

    return patches
};
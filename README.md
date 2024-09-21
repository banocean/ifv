# Improvements for VULCAN

Browser extension with improvements for eduVULCAN and Dziennik VULCAN.

## Installation
<a href="https://ifv.banocean.com/assets/releases/latest.xpi"><img src="./assets/add to firefox.svg"></a><img width=10px><a href="https://ifv.banocean.com/downloads/chrome"><img src="./assets/add to chrome.svg"></a>

[Installation guide [PL]](https://ifv.banocean.com)<br>
[Adding extension to browsers for development](#development-workflow)

## Features

<details>
    <summary>Mobile navigation</summary>

| Before:                                                         | After:                                                         |
| --------------------------------------------------------------- | -------------------------------------------------------------- |
| <img src="./screenshots/mobileNavBefore.png" width="300px" /> | <img src="./screenshots/mobileNavAfter.png" width="300px" /> |

</details>
<details>
    <summary>PWA support</summary>
    <img src="./screenshots/pwa.png" width="300px" />
</details>

<details>
    <summary>Attendance statistics in separate tab</summary>

| Before:                                                      | After:                                                      |
| ------------------------------------------------------------ | ----------------------------------------------------------- |
| <img src="./screenshots/attendanceBefore.png" width="300px" /> | <img src="./screenshots/attendanceAfter.png" width="300px" /> |
</details>
<details>
    <summary>Hiding weekends in monthy calendars</summary>
    
| Before:                                                      | After:                                                      |
| ------------------------------------------------------------ | ----------------------------------------------------------- |
| <img src="./screenshots/hideWeekendsBefore.png" width="300px" /> | <img src="./screenshots/hideWeekendsAfter.png" width="300px" /> |
</details>
<details>
    <summary>Displaying full name</summary>

| Before:                                                         | After:                                                         |
| --------------------------------------------------------------- | -------------------------------------------------------------- |
| <img src="./screenshots/fnameBefore.png" width="300px" /> | <img src="./screenshots/fnameAfter.png" width="300px" /> |
</details>
<details>
    <summary>Clean student dashboard</summary>

Before:

<img src="./screenshots/whiteboardBefore.png" width="800px" />

After:

<img src="./screenshots/whiteboardAfter.png" width="800px" />
</details>

<details>
    <summary>Clean eduVULCAN home</summary>

| Before:                                                      | After:                                                      |
| ------------------------------------------------------------ | ----------------------------------------------------------- |
| <img src="./screenshots/evHomeBefore.png" width="300px" /> | <img src="./screenshots/evHomeAfter.png" width="300px" /> |

</details>

<details>
    <summary>Other minor improvements</summary>
    
- Hiding WCAG controls
- Aligning detailed grades button
- Redirecting to board
- Auto redirecting to eduVULCAN login page
</details>

## Development Workflow
### Firefox
To load addon from files in Firefox, you need to go to `about:debugging#/runtime/this-firefox` and click `Load Temporary Add-on...`. After that you need to select manifest.json file in file picker.<br>
<img src="./screenshots/firefoxDebug.png">
### Chrome
To load extension from files in Chrome, you need to go to `chrome://extensions/` and click `Load unpacked` (with developer mode enabled)<br>
<img src="./screenshots/chromeDebug.png">

## License

This project is licensed under the [MIT License](./LICENSE).

## Contributions

Contributions to this project are welcome. Feel free to [open issues](https://github.com/banocean/ifv/issues) and [submit pull requests](https://github.com/banocean/ifv/pulls).

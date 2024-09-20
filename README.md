# Improvements for VULCAN

Browser extension with improvements for eduVULCAN and Dziennik VULCAN.

## Installation
<style>
.add-to-firefox {
            background: #20123a;
            border: 1px solid #20123a;
            color: white;
            margin-right: 10px;
        }

        .installation-links {
            display: flex;
            flex-wrap: wrap;
        }

        .installation-links > * {
            margin-bottom: 15px;
            text-decoration: none;
        }

        .add-to-chrome {
            border: 1px solid black;
            color: black;
        }

        a > div {
            display: flex;
            border: 0;
            height: 50px;
            padding-block: 5px;
            padding-inline: 10px;
            font-size: 16px;
            justify-items: center;
            align-items: center;
            width: min-content;
            cursor: pointer;
            border-radius: 5px;
        }

        a > div > img {
            height: 30px;
            margin-right: 10px;
        }
</style>
<div class="installation-links">
<a href="https://ifv.banocean.com/download/chrome"><div class="add-to-firefox"><img src="./assets/icons/Fx-Browser-icon-fullColor.svg" alt="firefox logo">Add&nbsp;to&nbsp;Firefox</div></a>
<a><div class="add-to-chrome"><img src="./assets/icons/Google_Chrome_icon_(February_2022).svg" alt="chrome logo">Add&nbsp;to&nbsp;Chrome</div></a>
</div>
[Setting up project for development](#development-workflow)

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

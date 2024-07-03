# <img src="https://user-images.githubusercontent.com/36832784/79633193-9ba0ea80-8181-11ea-8f83-893907cc6664.png" height="48" align="left"> Zet

> [Chrome extension](https://chrome.google.com/webstore/detail/zet/dpgmcnlebflbgacoghfpdmokolhljmbf) to add power-ups to Chrome.

## Highlights

- Gives a familiar macOS Spotlight like interface to quickly jump between tabs across windows.
- Jump to a tab and quickly return to where you were for replying to that quick message or changing a song.
- Fuzzy search in all the open tabs across windows. Search on the title or URL of the tabs.
- Quickly mute-unmute tabs from a filtered down list of audible tabs.
- See the tabs which aren't audible now but were a while back. This is useful for times like when you want to reply to a message you got a couple of minutes back.
- Highly accessible. Completely navigable usable just your keyboard.
- Keyboard shortcuts for switching to a tab, toggling mute of a tab, jumping back to the last tab, etc.

## Keyboard shortcuts

| What?                                   | How?                                                                                                            |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Toggle Tabby's visibility                 | <kbd>⌘</kbd> + <kbd>shift</kbd> + <kbd>space</kbd>  <br/><kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>space</kbd> |
| Close Tabby                               | <kbd>esc</kbd>                                                                                                  |
| Toggle Audible Tabs Only view           | <kbd>⌘</kbd> + <kbd>S</kbd>  <br/><kbd>ctrl</kbd> + <kbd>S</kbd>                                               |
| Jump back to previous tab               | <kbd>⌘</kbd> + <kbd>shift</kbd> + <kbd>U</kbd>  <br/><kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>U</kbd>         |
| Jump to nth tab in the results          | <kbd>⌥</kbd> + <kbd>[1-9]</kbd>  <br/><kbd>alt</kbd> + <kbd>[1-9]</kbd></kbd>                                  |
| Toggle mute for nth tab in the results  | <kbd>shift</kbd> + <kbd>[1-9]</kbd>                                                                             |
| Navigate through the list of tabs       | <kbd>▲</kbd> / <kbd>▼</kbd>                                                                                     |
| Jump to the highlighted tab in the list | <kbd>return</kbd>  <br/><kbd>enter</kbd>                                                                       |

## Screenshots

<img src="https://user-images.githubusercontent.com/36832784/81068702-6bd24080-8efe-11ea-9733-2d68d28c1029.png" width="512">

_Search for an open tab_

<img src="https://user-images.githubusercontent.com/36832784/81069861-1860f200-8f00-11ea-8f0c-8751fb1b587e.png" width="512">

_Show currently and recently audible tabs_

## Setup for local development

Clone the repo.
In the root of the cloned repo run the following commands,

`npm install`

`npm run watch` This will keep the files in _dist_ directory updated.

### Installing the extension

1. Open the Extension Management page by navigating to _chrome://extensions_.

- The Extension Management page can also be opened by clicking on the Chrome menu, hovering over **More Tools** then select **Extensions**.

2. Enable Developer Mode by clicking the toggle switch next to **Developer mode**.
3. Click the **LOAD UNPACKED** button and select the extension directory.

<img src="https://user-images.githubusercontent.com/36832784/79633430-23d3bf80-8183-11ea-880b-1e171827f22e.png" width="512">

After making any changes press the reload button on the extension card on _chrome://extensions_ page.

## Created by

- [Nandwana Abhishek](https://mobile.twitter.com/nandwana92)

# <img src="https://user-images.githubusercontent.com/36832784/79633193-9ba0ea80-8181-11ea-8f83-893907cc6664.png" height="48" align="left"> Tez

> [Chrome extension](https://www.link-to-be-updated.com) to add power-ups to Chrome.

## Highlights

- Gives a familiar macOS Spotlight like interface to quickly jump between tabs across windows.
- Fuzzy search in all the open tabs across windows. Search on title and URL of the tabs.
- Quickly mute-unmute tabs from a filtered down list of tabs which are audible.
- Highly accessible. Completely navigable usable just your keyboard.
- Keyboard shortcuts for switching to a tab, toggling mute of a tab, etc.

## Keyboard shortcuts

- Toggle Tez Popup: <kbd>⌘+Shift+Space</kbd>
- Toggle _audible tabs only_ view: <kbd>⌘+S</kbd>
- Switch to tab n (1 - 9) in results: <kbd>⌥+[1-9]</kbd>
- Toggle mute for tab n (1 - 9) in results: <kbd>Shift+[1-9]</kbd>

## Screenshots

<img src="https://user-images.githubusercontent.com/36832784/80314298-57ab8680-880e-11ea-8f9d-8e1a028bcdc4.png" width="512">
<img src="https://user-images.githubusercontent.com/36832784/80314308-6a25c000-880e-11ea-8365-d65793971abb.png" width="512">
<img src="https://user-images.githubusercontent.com/36832784/80314322-7dd12680-880e-11ea-8de9-26d28aa65257.png" width="512">

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

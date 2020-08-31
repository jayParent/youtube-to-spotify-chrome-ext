const client_id = '8982911bb26f4732b6fc7012fa25460c';
const response_type = 'token';
const chrome_ext_id = chrome.runtime.id;
const redirect_uri = 'https://' + chrome_ext_id + '.chromiumapp.org/success';
const scope = 'user-library-modify';
let authorizationUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=${response_type}`;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url !== 'https://www.youtube.com/') {
    let pageTitleIsOk = checkIfPageTitleIsOk(tab);
    if (pageTitleIsOk === false) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { message: 'reloadPage' });
      });
    }
    trackInfo = getTitleFromBackground(tab);
    chrome.tabs.executeScript({
      file: 'contentScript.js',
    });

    return trackInfo;
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'saveTrack') {
    getTrackFromSpotifyApi(trackInfo);
  }
});

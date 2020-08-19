const client_id = '8982911bb26f4732b6fc7012fa25460c';
const response_type = 'token';
const redirect_uri = 'https://njeklmcpajnlhfbnlokoihegcgimoojg.chromiumapp.org/success';
const scope = 'user-library-modify';
let authorizationUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=${response_type}`;

let rule1 = {
  conditions: [
    new chrome.declarativeContent.PageStateMatcher({
      pageUrl: { hostEquals: 'www.youtube.com' },
      css: ['video'],
    }),
  ],
  actions: [new chrome.declarativeContent.ShowPageAction()],
};

chrome.runtime.onInstalled.addListener(function (details) {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([rule1]);
  });
});

chrome.browserAction.onClicked.addListener(() => {
  chrome.storage.sync.get(['access_token'], function (result) {
    access_token = result.access_token;

    chrome.identity.launchWebAuthFlow(
      {
        url: authorizationUrl,
        interactive: true,
      },
      function (responseUrl) {
        access_token = responseUrl.slice(responseUrl.indexOf('=') + 1);

        chrome.storage.sync.set({ access_token: access_token }, function () {
          console.log('Value is set to ' + access_token);
        });
      }
    );
  });

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(tabs[0].id, {
      file: 'contentScript.js',
    });
  });

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    let query1 = request.secondHalf;
    let query2 = request.firstHalf;

    let options = {
      url: `https://api.spotify.com/v1/search?q=${query1}+${query2}&type=track,artist&market=US&limit=50&offset=0`,
      headers: { Authorization: 'Bearer ' + access_token },
      json: true,
    };
    console.log(options.url);

    fetch(options.url, { headers: options.headers })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        let noSavedTrack = true;
        res.tracks.items.forEach((track) => {
          track.artists.forEach((artist) => {
            console.log(artist.name.toLowerCase(), query2);
            if (artist.name.toLowerCase() === query2 && noSavedTrack) {
              saveTrackToSpotify(track.id);
              noSavedTrack = false;
            }
          });
        });
      })
      .catch((err) => console.log(err));
  });
});

// 1. search for tracks on spotify with query1 (secondHalf)
// 2. loop through results object, if item.artists.includes(firstHalf = artist). Means we have right track name and right artist => save track
//                                 else fetch with queries reversed and do the same

function saveTrackToSpotify(trackId) {
  let options = {
    url: 'https://api.spotify.com/v1/me/tracks?ids=' + trackId,
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
    json: true,
  };

  fetch(options.url, {
    headers: options.headers,
    method: 'PUT',
  })
    .then((res) => {
      console.log(res);
      if (res.ok) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { status: 'sucess' });
        });
      } else {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { status: 'failed' });
        });
      }
    })
    .catch((err) => console.log(err));
}

function getTitleFromBackground(tab) {
  let videoTitle = tab.title;

  let inParantheses = videoTitle.slice(videoTitle.indexOf('('), videoTitle.indexOf(')') + 1);
  let inBrackets = videoTitle.slice(videoTitle.indexOf('['), videoTitle.indexOf(']') + 1);

  if (videoTitle.includes('-')) {
    let titleSeparatorIndex = videoTitle.lastIndexOf('-');
    var artistName = videoTitle.slice(0, titleSeparatorIndex - 1).trim();
  } else {
    artistName = '';
  }

  if (videoTitle.includes('ft.') || videoTitle.includes('feat')) {
    let featIndex = videoTitle.lastIndexOf('feat.');
    let featuring = videoTitle.substring(featIndex, titleSeparatorIndex);
    videoTitle = videoTitle.replace(featuring, '');
  }

  videoTitle = videoTitle
    .replace(inParantheses, '')
    .replace(inBrackets, '')
    .replace(/Youtube/gi, '')
    .replace(/-/g, '')
    .trim()
    .replace(/\s+/g, '+');

  let trackInfo = { artist: artistName, title: videoTitle };
  return trackInfo;
}

function getTrackFromSpotifyApi(trackInfo) {
  chrome.identity.launchWebAuthFlow(
    {
      url: authorizationUrl,
      interactive: true,
    },
    function (responseUrl) {
      access_token = responseUrl.slice(responseUrl.indexOf('=') + 1);

      let query = trackInfo.title;
      let artistName = trackInfo.artist;

      let options = {
        url: `https://api.spotify.com/v1/search?q=${query}&type=track&market=US&limit=50&offset=0`,
        headers: { Authorization: 'Bearer ' + access_token },
        json: true,
      };

      fetch(options.url, { headers: options.headers })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((res) => {
          console.log(res);
          let noSavedTrack = true;
          res.tracks.items.forEach((track) => {
            track.artists.forEach((artist) => {
              if (artist.name.toLowerCase() === artistName && noSavedTrack) {
                saveTrackToSpotify(track.id);
                noSavedTrack = false;
              }
            });
          });
          if (noSavedTrack) {
            try {
              let trackId = res.tracks.items[0].id;
              saveTrackToSpotify(trackId);
            } catch {
              console.log('Could not find a match.');
            }
          }
        })
        .catch((err) => console.log(err));
    }
  );
}

function checkIfPageTitleIsOk(tab) {
  if (tab.title.replace(/Youtube/gi, '').trim().length <= 3) {
    return false;
  } else return true;
}

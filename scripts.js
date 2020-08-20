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
    if(res.ok){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {status: "sucess"});
      });
    }else{
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {status: "failed"});
      });
    }
    
  })
  .catch((err) => console.log(err));
}
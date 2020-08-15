function saveTrackToSpotify(trackId) {
  let options = {
    url: "https://api.spotify.com/v1/me/tracks?ids=" + trackId,
    headers: {
      Authorization: "Bearer " + access_token,
    },
    json: true,
  };

  fetch(options.url, {
    headers: options.headers,
    method: "PUT",
  }).catch((err) => console.log(err));
}

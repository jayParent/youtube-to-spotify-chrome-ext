const client_id = "8982911bb26f4732b6fc7012fa25460c";
const response_type = "token";
const redirect_uri =
  "https://ceomfoljogbanppabhfmifkcjcckcobm.chromiumapp.org/success";
const scope = "user-library-modify";
let authorizationUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=${response_type}`;

const header = document.getElementById("header");
const mainBtn = document.getElementById("main_btn");
const searchResults = document.getElementById("search_results");

function updateMainBtn() {
  mainBtn.textContent = "Save Track";
}

function populateSearchResults(list, res){
  res.tracks.items.forEach(track => {
    let li = document.createElement("li");
    let trackBtn = document.createElement('button');

    trackBtn.textContent = track.name;

    li.appendChild(trackBtn);
    list.appendChild(li);
  });

  mainBtn.style.display = 'none';
  header.textContent = 'Click on a track to Save it to Spotify';
}

mainBtn.onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(tabs[0].id, {
      file: "contentScript.js",
    });
  });

  chrome.identity.launchWebAuthFlow(
    {
      url: authorizationUrl,
      interactive: true,
    },
    function (responseUrl) {
      access_token = responseUrl.slice(responseUrl.indexOf("=") + 1);

      updateMainBtn();
    }
  );
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  let query1 = request.secondHalf;
  let query2 = request.firstHalf;

  let options = {
    url: `https://api.spotify.com/v1/search?q=${query1}&type=track&market=US&limit=5&offset=0`,
    headers: { Authorization: "Bearer " + access_token },
    json: true,
  };

  fetch(options.url, { headers: options.headers })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      console.log(res.tracks.items.length);

      // Display search results
      populateSearchResults(searchResults, res);
    })
    .catch((err) => console.log(err));
});

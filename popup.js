console.log("yskproxy loaded")
let pInput = document.getElementById("pacUrl")

function getElm(s) {
  return document.getElementById(s);
}

function jsonPretty(s) {
  return JSON.stringify(s, undefined, 2);
}

function displayCurrentProxyConfig() {
  chrome.proxy.settings.get({}, function (data) {
    console.log(data.value);
    getElm("ctx").value = jsonPretty(data.value)
  })
}

chrome.storage.sync.get('yskproxyPacUrl', function (data) {
  pInput.value = data.yskproxyPacUrl
  console.log(data)
})

displayCurrentProxyConfig();

let cbtn = document.getElementById("changePacUrl")
cbtn.onclick = function () {
  var date = new Date();
  var ts = date.getTime();
  var pacUrl = document.getElementById("pacUrl").value;
  pacUrl = pacUrl + "?t=" + ts;
  console.log(pacUrl);
  chrome.storage.sync.set({ yskproxyPacUrl: pacUrl }, function () {
    console.log('pacUrl: ' + pacUrl)
  })
  var config = {
    mode: "pac_script",
    pacScript: {
      url: pacUrl
    }
  };
  chrome.proxy.settings.set(
    { value: config, scope: 'regular' },
    function () { });

  displayCurrentProxyConfig();

}

let npBtn = document.getElementById("noproxy")
npBtn.onclick = function () {
  var config = {
    mode: "direct"
  };
  chrome.proxy.settings.set(
    { value: config, scope: 'regular' },
    function () { });

  displayCurrentProxyConfig();

}
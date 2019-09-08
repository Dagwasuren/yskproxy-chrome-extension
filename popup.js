console.log("yskproxy loaded")

function getElm(s) {
  return document.getElementById(s);
}

let pInput = getElm("pacUrl")
let mpsInput = getElm("manualProxyScheme")
let mphInput = getElm("manualProxyHost")
let mppInput = getElm("manualProxyPort")

function jsonPretty(s) {
  return JSON.stringify(s, undefined, 2);
}

function displayCurrentProxyConfig() {
  chrome.proxy.settings.get({}, function (data) {
    console.log(data.value);
    getElm("ctx").value = jsonPretty(data.value)
  })
}

chrome.storage.sync.get([
  'yskproxyPacUrl',
  'yskproxyManualProxyScheme',
  'yskproxyManualProxyHost',
  'yskproxyManualProxyPort',
  ], function (data) {
    console.log(data);
    let dkeys = Object.keys(data);
    if (dkeys.indexOf("yskproxyPacUrl") > -1) {
      pInput.value = data.yskproxyPacUrl;
    }
    if (dkeys.indexOf("yskproxyManualProxyScheme") > -1) {
      mpsInput.value = data.yskproxyManualProxyScheme;
    } 
    if (dkeys.indexOf("yskproxyManualProxyHost") > -1) {
      mphInput.value = data.yskproxyManualProxyHost;
    }
    
    if (dkeys.indexOf("yskproxyManualProxyPort") > -1) {
      mppInput.value = data.yskproxyManualProxyPort;
    }
    
  
})

displayCurrentProxyConfig();

let cbtn = document.getElementById("changePacUrl")
cbtn.onclick = function () {
  var date = new Date();
  var ts = date.getTime();
  var pacUrl = document.getElementById("pacUrl").value;
  npacUrl = pacUrl + "?t=" + ts;
  console.log(pacUrl);
  chrome.storage.sync.set({ yskproxyPacUrl: pacUrl }, function () {
    console.log('pacUrl: ' + pacUrl)
  })
  var config = {
    mode: "pac_script",
    pacScript: {
      url: npacUrl
    }
  };
  chrome.proxy.settings.set(
    { value: config, scope: 'regular' },
    function () { });

  displayCurrentProxyConfig();

}

let mbtn = document.getElementById("changeManualProxy")
mbtn.onclick = function () {
  var mps = getElm("manualProxyScheme").value; 
  var mph = getElm("manualProxyHost").value; 
  var mpp = getElm("manualProxyPort").value; 
  chrome.storage.sync.set({
     yskproxyManualProxyScheme: mps,
     yskproxyManualProxyHost: mph,
     yskproxyManualProxyPort: mpp
     }, function () {
      console.log('manualProxyScheme: ' + mps);
      console.log('manualProxyHost: ' + mph);
      console.log('manualProxyPort: ' + mpp);
  })
 
  var config = {
    mode: "fixed_servers",
    rules: {
      singleProxy: {
        scheme: mps,
        host: mph,
        port: Number(mpp)
      },
      bypassList: []
    }
  };
  chrome.proxy.settings.set(
      {value: config, scope: 'regular'},
      function() {});

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
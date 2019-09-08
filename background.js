chrome.runtime.onInstalled.addListener(function() {
    let pacUrl = 'http://localhost:8085/pac';
    chrome.storage.sync.set({yskproxyPacUrl: pacUrl}, function() {
      console.log("yskproxyPacUrl:" + pacUrl);
    });
  });
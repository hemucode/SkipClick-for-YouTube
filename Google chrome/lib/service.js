chrome.runtime.onStartup.addListener(async () => {
  var a = new Promise(function(resolve, reject){
        chrome.storage.sync.get({"enabled": true}, function(options){
            resolve(options.enabled);
      })
  });

  const enabled = await a;
  console.log(enabled);
  if (enabled) {
    await enable();
  } else {
    await disable();
  }
});


chrome.runtime.onMessage.addListener(async (request, sender) => {
  switch (request.action) {
    case "INSERT_CSS_RULE": {
      return chrome.scripting.insertCSS({
        target: { tabId: sender.tab.id },
        files: [`content-style.css`],
      });
    }
    default:
      throw new Error(`Unknown Action: ${request.action}`);
  }
});


chrome.storage.onChanged.addListener(async (changes, namespace) => {
  if (namespace !== "sync") return;

  if (changes.enabled) {
    if (changes.enabled.newValue) {
      await enable();
    } else {
      await disable();
    }
  }
});


chrome.webNavigation.onCompleted.addListener(trackVideoView, {
  url: [{ hostSuffix: "youtube.com", pathPrefix: "/watch" }],
});


chrome.webNavigation.onHistoryStateUpdated.addListener(trackVideoView, {
  url: [{ hostSuffix: "youtube.com", pathPrefix: "/watch" }],
});

/**
 * @returns Promise
 */
async function trackVideoView() {
  var a = new Promise(function(resolve, reject){
        chrome.storage.sync.get({"enabled": true}, function(options){
            resolve(options.enabled);
      })
  });

  const enabled = await a;
  console.log(enabled);
  if (!enabled) return;
}

/**
 * Enables this extension core
 * @returns Promise
 */
async function enable() {
  await chrome.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds: ["youtube"],
  });
  await chrome.action.setIcon({
    path: {
      32: "data/icons/icon-32.png",
      38: "data/icons/icon-38.png",
      128: "data/icons/icon-128.png"
    },
  });
  await reloadAffectedTab();
}

/**
 * @returns Promise
 */
async function disable() {
  await chrome.declarativeNetRequest.updateEnabledRulesets({
    disableRulesetIds: ["youtube"],
  });
  await chrome.action.setIcon({
    path: {
      32: "data/icons/icon-disabled-32.png",
      38: "data/icons/icon-disabled-38.png",
      128: "data/icons/icon-disabled-128.png"
    },
  });
  await reloadAffectedTab();
}

/**
 * @returns Promise
 */
async function reloadAffectedTab() {
  const [currentTab] = await chrome.tabs.query({
    active: true,
    url: "*://*.youtube.com/*",
  });
  const isTabAffected = Boolean(currentTab?.url);
  if (isTabAffected) {
    return chrome.tabs.reload();
  }
}

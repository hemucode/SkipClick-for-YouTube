async function init() {
  return Promise.all([translate(), hydrate()]);
}

function translate() {
  return new Promise((resolve) => {
    const elements = document.querySelectorAll("[data-message]");
    for (const element of elements) {
      const key = element.dataset.message;
      const message = chrome.i18n.getMessage(key);
      if (message) {
        element.textContent = message;
      } else {
        console.error("Missing chrome.i18n message:", key);
      }
    }
    resolve();
  });
}

/**
 * @returns Promise
 */
async function hydrate() {
   var a = new Promise(function(resolve, reject){
        chrome.storage.sync.get({"enabled": true}, function(options){
            resolve(options.enabled);
        })
    });

  const enabled = await a;
  console.log(enabled);

  // Hydrate Logo
  const $logo = document.querySelector("#logo");
  $logo.style.filter = enabled ? "grayscale(0)" : "grayscale(100%)";
  $logo.style.opacity = enabled ? "1" : "0.7";

  // Hydrate Timesave info

  // Hydrate Checkbox Label
  const $checkboxLabel = document.querySelector("#button");
  const $statusLabel = document.querySelector("#status");


  $checkboxLabel.textContent = chrome.i18n.getMessage(
    enabled ? "enabled" : "disabled"
  );
  // background: #4a0ab2;
   $checkboxLabel.style.background = chrome.i18n.getMessage(
    enabled ? "#4a0ab2" : "#535252"
  );

  $statusLabel.textContent = chrome.i18n.getMessage(
    enabled ? "enabled" : "disabled"
  );

  $checkboxLabel.addEventListener("click", async (event) => {
    if (enabled) {
      const enabled = false;
      await chrome.storage.sync.set({ enabled });
    }else{
      const enabled = true;
      await chrome.storage.sync.set({ enabled });
    }
    await hydrate();
  });
}

init();

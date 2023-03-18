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
  try {
    var a = new Promise(function(resolve, reject){
        chrome.storage.sync.get({"enabled": true}, function(options){
            resolve(options.enabled);
        })
    });

    const enabled = await a;
    console.log(enabled);

    if (enabled) {

    }
    const second = 1000,
      minute = second * 60,
      hour = minute * 60,
      day = hour * 24;

    if (localStorage.Install_timer_SkipClick_Codehemu) {
      Install_timer = localStorage.Install_timer_SkipClick_Codehemu;
    }else{
      Install_timer = new Date();
      localStorage.Install_timer_SkipClick_Codehemu = Install_timer;
    }

    const countDown = new Date(Install_timer).getTime(),
      x = setInterval(function () {

        const now = new Date().getTime(),
          distance = now - countDown;

        if (enabled) {
          document.getElementById("days").innerText = Math.floor(distance / (day)),
          document.getElementById("hours").innerText = Math.floor((distance % (day)) / (hour)),
          document.getElementById("minutes").innerText = Math.floor((distance % (hour)) / (minute)),
          document.getElementById("seconds").innerText = Math.floor((distance % (minute)) / second);
        }

        //do something later when date is reached
        if (distance < 0) {
          document.getElementById("headline").innerText = "It's my birthday!";
          document.getElementById("countdown").style.display = "none";
          document.getElementById("content").style.display = "block";
          clearInterval(x);
        }
      }, 0)

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
    document.querySelector("#button").style.background = (enabled ? "#4a0ab2" : "#535252");

    $statusLabel.textContent = chrome.i18n.getMessage(
      enabled ? "enabled" : "disabled"
    );

    $checkboxLabel.addEventListener("click", async (event) => {
      if (enabled) {
        localStorage.Install_timer_SkipClick_Codehemu = new Date();
        clearInterval(x);
        const enabled = false;
        await chrome.storage.sync.set({ enabled });
      }else{
        const enabled = true;
        await chrome.storage.sync.set({ enabled });
      }
      await hydrate();
    });
  }catch(err) {
    console.log(err.message);
  }
}

init();

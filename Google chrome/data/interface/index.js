//================================================
/*
MIT License

Copyright (C) 2023 hemanta gayen
www.downloadhub.cloud

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
//================================================

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
        if (Math.floor((distance % (hour)) / (minute)) > 0) {
          if (!localStorage.plsrate) {
            localStorage.plsrate = 0;
            url = `https://chrome.google.com/webstore/detail/${chrome.runtime.id}/reviews`;
            window.open(url,'_blank');
          }
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
        clearInterval(x);
        const enabled = false;
        await chrome.storage.sync.set({ enabled });
      }else{
        localStorage.Install_timer_SkipClick_Codehemu = new Date();
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

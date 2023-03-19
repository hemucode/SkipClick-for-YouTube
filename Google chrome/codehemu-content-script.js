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
  try {
    var a = new Promise(function(resolve, reject){
          chrome.storage.sync.get({"enabled": true}, function(options){
              resolve(options.enabled);
          })
      });

    const enabled = await a;
    if (!enabled) return;
    injectStyles();
    setInterval(()=>{
    const btn=document.querySelector(".ytp-ad-skip-button");
    const stopbtn = document.querySelector("button[aria-label='Yes']");
    if(stopbtn) {
      stopbtn.click();
      stopbtn.parentNode.removeChild(stopbtn)
    }
    if(btn) {btn.click()}
    if( ! document.querySelector('.ad-showing') ) return

          const video=document.querySelector('video')
          if( ! video)  return

          if( btn) {
            btn.click()
          } else {
            video.currentTime = isNaN(video.duration) ? 0 : video.duration
          }
    },300);

    console.log(`[${chrome.runtime.getManifest().name} v${chrome.runtime.getManifest().version} Enabled]`);
    console.log(`Review Now https://chrome.google.com/webstore/detail/${chrome.runtime.id}`)

  }
  catch(err) {
    console.log(err.message);
  }
 
}
init();

/**
 * @returns Promise
 */
function injectStyles() {
  return chrome.runtime.sendMessage({
    action: "INSERT_CSS_RULE",
    rule: "content-style",
  });
}

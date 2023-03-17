/**
 * By @Codehemu - https://raw.githubusercontent.com/hemucode/Adblock-for-YouTube/main/Microsoft%20Edge/bundled-content-script.js ( JS: MIT License)
 * License - https://github.com/hemucode/Adblock-for-YouTube/blob/main/LICENSE ( CSS: MIT License)
 */
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

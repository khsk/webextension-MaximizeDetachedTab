const OFF = false;
const ON = true;
var state = ON;

browser.browserAction.onClicked.addListener(tab => {
  state = !state;
  if (state) {
    browser.browserAction.setTitle({title: 'Maximize Detached Tab : ON'});
    browser.browserAction.setIcon({path: 'icon/switch.svg'});
  } else {
    browser.browserAction.setTitle({title: 'Maximize Detached Tab : OFF'});
    browser.browserAction.setIcon({path: 'icon/switch-off.svg'});
  }
});


chrome.tabs.onDetached.addListener(tabId => {
  if (!state) {
    return
  }
  (async () => {
    const parentWindowId = (await browser.tabs.get(tabId)).windowId;
    // tabs.query({active:true, index:0}) のtabs.find tab.id == tabIdを対象にしていたが、index0への結合に対応していなかったので、分離後ウィンドウのtab数が1の場合のみを最大化トリガーに変更
    if ((await browser.windows.get(parentWindowId, {populate:true})).tabs.length != 1) {
      return;
    }
    chrome.windows.update(parentWindowId, {
        state: 'maximized'
    });
  })();
  
});

// chromeがmanifestでのsvn設定に対応していないため初期化(Firefoxには不要)
browser.browserAction.setIcon({path: 'icon/switch.svg'});
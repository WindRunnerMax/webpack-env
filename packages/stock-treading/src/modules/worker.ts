import { DateTime } from "@block-kit/utils/dist/es/date-time";

import { ALARM_NAME, NOTIFY_TIME } from "../utils/constant";

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL("stock.html"),
  });
});

const showNotification = () => {
  chrome.notifications.create({
    type: "basic",
    iconUrl: chrome.runtime.getURL("static/icon.png"),
    title: "每日提醒",
    message: `现在的时间是 ${NOTIFY_TIME} !`,
    requireInteraction: true,
  });
};

chrome.alarms.onAlarm.addListener(alarm => {
  const now = new DateTime();
  const hm = now.format("hh:mm");
  if (alarm.name === ALARM_NAME && hm === NOTIFY_TIME) {
    showNotification();
  }
});

chrome.scripting.registerContentScripts([
  {
    matches: ["<all_urls>"],
    runAt: "document_start",
    world: "MAIN",
    allFrames: true,
    js: ["inject.js"],
    id: "inject",
  },
]);

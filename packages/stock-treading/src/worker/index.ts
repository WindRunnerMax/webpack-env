import { DateTime } from "@block-kit/utils/dist/es/date-time";

import { MATCH_INJECT } from "../shared/constant/inject";
import { ALARM_NAME, NOTIFY_HH, NOTIFY_MM, RELOAD_FLAG } from "../shared/constant/worker";

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
    message: `现在的时间是 ${NOTIFY_HH}:${NOTIFY_MM} !`,
    requireInteraction: true,
  });
};

chrome.alarms.onAlarm.addListener(alarm => {
  const now = new DateTime();
  const h = now.getHours();
  const m = now.getMinutes();
  console.log("Alarm", `${h}:${m}`, alarm);
  if (alarm.name === ALARM_NAME && h === NOTIFY_HH && Math.abs(m - NOTIFY_MM) <= 1) {
    showNotification();
  }
});

chrome.scripting
  .registerContentScripts([
    {
      matches: MATCH_INJECT,
      runAt: "document_start",
      world: "MAIN",
      allFrames: true,
      js: ["inject.js"],
      id: "inject",
    },
  ])
  .catch(err => {
    console.log("Register Inject Scripts Failed", err);
  });

chrome.runtime.onInstalled.addListener(async details => {
  console.log("Installed", details);
  const storage = await chrome.storage.local.get([RELOAD_FLAG]);
  chrome.storage.local.remove(RELOAD_FLAG);
  if (details.reason === "update" && storage[RELOAD_FLAG]) {
    chrome.tabs.create({
      url: chrome.runtime.getURL("stock.html"),
    });
  }
});

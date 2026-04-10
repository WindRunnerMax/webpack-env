import { DateTime } from "@block-kit/utils";

const ALARM_NAME = "alarm_storage";

function showNotification() {
  chrome.notifications.create({
    type: "basic",
    iconUrl: chrome.runtime.getURL("static/icon.png"),
    title: "每日提醒",
    message: "现在是下午 2:45 !",
    requireInteraction: true, // 保持可见直到用户操作
  });
}

const setDailyAlarm = async (forceNextDay: boolean = false) => {
  const now = Date.now();
  const exist = await chrome.alarms.get(ALARM_NAME);
  if (exist && exist.scheduledTime > now) {
    const scheduledTime = new DateTime(exist.scheduledTime).format("yyyy-MM-dd hh:mm:ss");
    console.log("闹钟已存在", scheduledTime);
    return void 0;
  }
  const when = new Date();
  when.setHours(14, 45, 0, 0);
  if (when.getTime() <= now || forceNextDay) {
    when.setDate(when.getDate() + 1);
  }
  await chrome.alarms.create(ALARM_NAME, {
    when: when.getTime(), // 精确到毫秒
  });
};

// 监听闹钟触发
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === ALARM_NAME) {
    showNotification();
    setDailyAlarm(true);
  }
});

export const getAlarmSetting = async () => {
  const enable = await chrome.storage.local.get(ALARM_NAME);
  const isEnabled = !!enable[ALARM_NAME];
  isEnabled ? setDailyAlarm() : chrome.alarms.clear(ALARM_NAME);
  return isEnabled;
};

export const setAlarmSetting = async (enable: boolean) => {
  enable ? setDailyAlarm() : chrome.alarms.clear(ALARM_NAME);
  return await chrome.storage.local.set({ [ALARM_NAME]: enable });
};

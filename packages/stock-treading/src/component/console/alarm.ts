import { ALARM_NAME } from "../../utils/constant";

const setPeriodMinuteAlarm = async () => {
  const exist = await chrome.alarms.get(ALARM_NAME);
  if (exist) {
    console.log("Alarm 检查已存在", exist);
    return void 0;
  }
  await chrome.alarms.create(ALARM_NAME, {
    periodInMinutes: 1,
  });
};

// 监听闹钟触发

export const getAlarmSetting = async () => {
  const enable = await chrome.storage.local.get(ALARM_NAME);
  const isEnabled = !!enable[ALARM_NAME];
  isEnabled ? setPeriodMinuteAlarm() : chrome.alarms.clear(ALARM_NAME);
  return isEnabled;
};

export const setAlarmSetting = async (enable: boolean) => {
  enable ? setPeriodMinuteAlarm() : chrome.alarms.clear(ALARM_NAME);
  return await chrome.storage.local.set({ [ALARM_NAME]: enable });
};

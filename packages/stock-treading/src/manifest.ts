// Chromium
const __MANIFEST__ = {
  manifest_version: 3,
  name: "Stock Trading",
  version: "0.0.0",
  description: "Stock Trading",
  icons: {
    32: "static/icon.png",
    96: "static/icon.png",
    128: "static/icon.png",
  },
  action: {
    default_icon: "static/icon.png",
  },
  web_accessible_resources: [
    {
      resources: ["static/*"],
      matches: ["<all_urls>"],
    },
  ],
  background: {
    service_worker: "worker.js",
  },
  host_permissions: ["https://*/*", "http://*/*", "file://*/*"],
  permissions: ["activeTab", "tabs", "scripting", "management"],
  minimum_chrome_version: "88.0",
};

module.exports = __MANIFEST__;

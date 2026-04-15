export const removeAllCookies = async (url: string) => {
  const cookies = await chrome.cookies.getAll({ url });
  for (const cookie of cookies) {
    await chrome.cookies.remove({ url, name: cookie.name });
  }
};

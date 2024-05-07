export function isTestEnv() {
  const isTestPlatformActivated =
    process.env.REACT_APP_IS_ACTIVATE_TEST_PLATFORM;
  return isTestPlatformActivated === "YES";
}

export const log = {
  error: (...args: unknown[]) => {
    if (__DEV__) {
      console.error(...args);
    }
  },
  log: (...args: unknown[]) => {
    if (__DEV__) {
      console.log(...args);
    }
  },
};

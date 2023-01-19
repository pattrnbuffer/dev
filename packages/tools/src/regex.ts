export const regex = {
  createTest(rx: string | RegExp) {
    rx = typeof rx === 'string' ? new RegExp(rx) : rx;
    return rx.test.bind(rx);
  },
};

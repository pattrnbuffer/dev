import _ora from 'ora';

export async function ora(promise) {
  const orita = _ora({ color: 'magenta', spinner: 'moon' }).start();
  const result = await promise;
  orita.stop();
  return result;
}

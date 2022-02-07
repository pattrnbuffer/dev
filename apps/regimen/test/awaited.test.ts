import { foxy } from '../common/foxy';

const animals = ['dog', 'cat', 'mouse', 'kitten'];
const $animals = Promise.resolve(['dog', 'cat', 'mouse', 'kitten']);

test('awaited', async () => {
  const $$animals = foxy($animals);

  expect(await $$animals.includes('mouse')).toBe(true);
});

import { NextApiHandler } from 'next';
import { $ } from 'zx';

export default <NextApiHandler>(async (req, res) => {
  const secret = await createSecret(req.query.length);

  return secret
    ? res.status(200).json({ value: secret })
    : res.status(500).json({ error: 'Failed to create secret' });
});

export async function createSecret(length?: any) {
  typeof length === 'string' && (length = Number(length));
  length = isNaN(length) || !isFinite(length) ? 64 : length;

  const secret = await $`
    secret=$(openssl rand -base64 ${length || 64})
    secret=$(echo $secret | tr -d '\n\r')
    echo $secret
  `;

  return secret.stdout?.trim?.();
}

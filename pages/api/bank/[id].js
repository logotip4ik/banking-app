import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

/**
 * @param req {import("next").NextApiRequest}
 * @param res {import("next").NextApiResponse}
 */
export default async function editBankAtUser(req, res) {
  if (req.method !== 'POST')
    return res.status(400).json({ ok: false, msg: 'Not allowed method' });

  const session = getSession({ req });
  if (!session)
    return res.status(401).json({
      ok: false,
      msg: 'You must be authorized to access this resource',
    });

  let data;
  let id;
  try {
    if (typeof req.body === 'string') data = JSON.parse(req.body);
    if (typeof req.body === 'object') data = { ...req.body };

    if (req.query.id) id = parseInt(req.query.id);
    else res.status(404).json({ ok: false, msg: 'Not found' });
  } catch (err) {
    res.status(400).json({ ok: false, err: err.message });
  }
  delete data.id;

  const bank = await prisma.bank
    .update({
      where: { id },
      data: { ...data },
    })
    .catch((err) => res.status(500).json({ ok: false, err: err.message }));
  res.status(201).json({ ok: true, data: bank });
}

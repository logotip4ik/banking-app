import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

/**
 * @param req {import("next").NextApiRequest}
 * @param res {import("next").NextApiResponse}
 */
async function editBankAtUser(req, res) {
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

  const bank = await prisma.bank.findUnique({
    where: { id: parseInt(req.query.id) },
    include: { User: true },
  });

  if (bank.User.email !== session.user.email)
    return res.status(401).json({
      ok: false,
      err: 'You must be authorized tp access this resource',
    });

  const updatedBank = await prisma.bank
    .update({
      where: { id },
      data: { ...data },
    })
    .catch((err) => res.status(500).json({ ok: false, err: err.message }));
  res.status(201).json({ ok: true, data: updatedBank });
}

async function deleteBankAtUser(req, res, session) {
  if (!req.query.id || isNaN(req.query.id))
    return res.status(400).json({ ok: false, err: 'Not valid id' });

  const bank = await prisma.bank
    .findUnique({
      where: { id: parseInt(req.query.id) },
      include: { User: true },
    })
    .catch((err) => res.status(500).json({ ok: false, err: err.message }));

  console.log({ bank });

  if (bank.User.email !== session.user.email)
    return res.json(401).json({
      ok: false,
      err: 'You must be authorized to access this resource',
    });

  const deletedBank = await prisma.bank
    .delete({ where: { id: parseInt(req.query.id) } })
    .catch((err) => res.status(500).json({ ok: false, err: err.message }));

  res.status(200).json({ ok: true, data: deletedBank });
}

export default async function handler(req, res) {
  const session = getSession({ req });
  if (!session)
    return res.status(401).json({
      ok: false,
      err: 'You must be authorized to access this resource',
    });

  if (req.method === 'POST') await editBankAtUser(req, res, session);
  if (req.method === 'DELETE') await deleteBankAtUser(req, res, session);

  prisma.$disconnect();

  if (!res.writableEnded)
    res.status(400).json({ ok: false, err: 'Not valid method' });
}

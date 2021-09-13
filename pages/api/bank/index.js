import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import * as Yup from 'yup';

const prisma = new PrismaClient();

const createSchema = Yup.object().shape({
  interestRate: Yup.number().min(0.01).max(1).required(),
  loanTerm: Yup.number()
    .min(1)
    .max(365 * 10)
    .required(),
  maxDownPayment: Yup.number().min(0.01).max(1).required(),
  maxLoan: Yup.number().min(1).max(9999999).required(),
  name: Yup.string().min(1).max(50).required(),
});
const updateSchema = Yup.object().shape({
  interestRate: Yup.number().min(0.01).max(1).required(),
  loanTerm: Yup.number()
    .min(1)
    .max(365 * 10)
    .required(),
  maxDownPayment: Yup.number().min(0.01).max(1).required(),
  maxLoan: Yup.number().min(1).max(9999999).required(),
  name: Yup.string().min(1).max(50).required(),
});

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
async function getUserBanks(req, res, session) {
  const user = await prisma.bankUser.findUnique({
    where: { email: session.user.email },
    include: { banks: true },
  });
  if (!user) {
    await prisma.bankUser.create({ data: { ...session.user } });
    return res.status(201).json({ ok: true, data: [] });
  }

  return res.status(200).json({ ok: true, data: user.banks });
}

/**
 * @param req {import("next").NextApiRequest}
 * @param res {import("next").NextApiResponse}
 */
async function addBankToUser(req, res, session) {
  let data;
  try {
    if (typeof req.body === 'string') data = JSON.parse(req.body);
    if (typeof req.body === 'object') data = { ...req.body };

    data = createSchema.validateSync(data);
  } catch (err) {
    res.status(400).json({ ok: false, err: err.message });
  }
  const bank = await prisma.bank
    .create({
      data: { ...data, User: { connect: { email: session.user.email } } },
    })
    .catch((err) => res.status(500).json({ ok: false, err: err.message }));
  res.status(201).json({ ok: true, data: bank });
}

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session)
    return res.status(401).json({
      ok: false,
      msg: 'You need to be authorized to access this resource',
    });

  if (req.method === 'GET') await getUserBanks(req, res, session);
  if (req.method === 'POST') await addBankToUser(req, res, session);

  await prisma.$disconnect();

  if (!res.writableEnded)
    res.status(400).json({ ok: false, msg: 'nothing was done' });
}

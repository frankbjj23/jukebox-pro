import { Router } from "express";
import bcrypt from "bcrypt";

import { createUser, getUserByUsername } from "#db/queries/users";
import { createToken } from "#utils/jwt";

const router = Router();
export default router;

// POST /users/register
router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body ?? {};
    if (!username || !password) return res.sendStatus(400);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(username, hashedPassword);

    const token = createToken({ id: user.id });
    res.status(201).send(token);
  } catch (err) {
    next(err);
  }
});

// POST /users/login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body ?? {};
    if (!username || !password) return res.sendStatus(400);

    const user = await getUserByUsername(username);
    if (!user) return res.sendStatus(401);

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.sendStatus(401);

    const token = createToken({ id: user.id });
    res.status(200).send(token);
  } catch (err) {
    next(err);
  }
});

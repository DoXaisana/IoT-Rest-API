import express from 'express';

import { createUser, getUserByEmail } from '../models/usersModel';
import { random, authentication } from '../helpers';

export const login = async (req: express.Request, res: express.Response) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.sendStatus(400);
      }
  
      const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
  
      if (!user) {
        return res.sendStatus(400);
      }
  
      const expectedHash = authentication(user.authentication.salt, password);
      
      if (user.authentication.password != expectedHash) {
        return res.sendStatus(403);
      }
  
      const salt = random();
      user.authentication.sessionToken = authentication(salt, user._id.toString());
  
      await user.save();
  
      res.cookie('IOT-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });
  
      return res.status(200).json(user).end();
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password should be at least 8 characters long." });
    }

    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
      return res.status(400).json({ error: "Password should contain both lowercase and uppercase characters." });
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.sendStatus(400);
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
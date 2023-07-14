import express from 'express';

import authentication from './authRoute';
import users from './usersRoute';

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    users(router);

    return router;
}
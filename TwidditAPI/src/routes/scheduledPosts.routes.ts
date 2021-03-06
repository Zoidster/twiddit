import express, { Request, Response, NextFunction } from 'express';

import { getConnection } from '../model/databaseConnection';
import { morphToScheduledPosts, morphToDatabaseScheduledPost } from '../model/toModelTransformation';
import { getJwtCheckFuncs } from './checkJwt.routes';


const createRouter = () => {

  const router = express.Router();
  getConnection();

  const jwtCheck = getJwtCheckFuncs(router);

  router.all(/\/scheduled-posts.*/, jwtCheck);

  router.get('/scheduled-posts', async (req: Request, res: Response, next: NextFunction) => {
    const db = await getConnection();
    const userMail = req.user.email;
    db.pool
      .query('SELECT * FROM scheduledposts WHERE usermail = $1;', [userMail])
      .then((result) => res.send(morphToScheduledPosts(result.rows)))
      .catch((e) =>
        setImmediate(() => {
          console.error(e);
          res.status(500).send(e);
        }),
      );
  });

  router.post('/scheduled-posts', async (req, res, next) => {
    const db = await getConnection();
    const userMail = req.user.email;
    const post = morphToDatabaseScheduledPost(req.body.post);
    db.pool
      .query('INSERT INTO scheduledposts  '
        + 'VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7) RETURNING *;',
        [userMail, post.postdatetime, post.imageurl, post.twittertext, post.reddittitle, post.subreddit, post.nsfw])
      .then((result) => res.status(201).send(morphToScheduledPosts(result.rows)))
      .catch((e) =>
        setImmediate(() => {
          console.error(e);
          res.status(500).send(e);
        }),
      );
  });

  router.put('/scheduled-posts/:postId', async (req, res, next) => {
    const db = await getConnection();
    const userMail = req.user.email;
    const post = morphToDatabaseScheduledPost(req.body.post);
    db.pool
      .query('UPDATE scheduledposts '
        + 'SET postdatetime=$1, imageurl=$2, twittertext=$3, reddittitle=$4, subreddit=$5, nsfw=$6  '
        + 'WHERE usermail = $7 AND id = $8 RETURNING *;',
        [post.postdatetime, post.imageurl, post.twittertext, post.reddittitle, post.subreddit, post.nsfw, userMail, req.params.postId])
      .then((result) => res.status(201).send(morphToScheduledPosts(result.rows)))
      .catch((e) =>
        setImmediate(() => {
          console.error(e);
          res.status(500).send(e);
        }),
      );
  });

  router.delete('/scheduled-posts/:postId', async (req, res, next) => {
    const db = await getConnection();
    const userMail = req.user.email;
    db.pool
      .query('DELETE FROM scheduledposts  '
        + 'WHERE usermail = $1 AND id = $2 RETURNING *;',
        [userMail, req.params.postId])
      .then((result) => {
        console.log(result);
        res.status(200).send(morphToScheduledPosts(result.rows));
      })
      .catch((e) =>
        setImmediate(() => {
          console.error(e);
          res.status(500).send(e);
        }),
      );
  });

  return router;
}

export const CreateApiRouter = createRouter;

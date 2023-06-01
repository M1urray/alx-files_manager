/* eslint-disable class-methods-use-this */
import sha1 from 'sha1';
import Queue from 'bull/lib/queue';

const { default: dbClient } = require('../utils/db');

const userQueue = new Queue('userQueue');

class UsersController {
  static async postNew(request, response) {
    const { email, password } = await request.body;

    // Check if email is missing
    if (!email) {
      return response.status(400).send({
        error: 'Missing email',
      });
    }

    // Check if password is missing
    if (!password) {
      return response.status(400).send({
        error: 'Missing password',
      });
    }

    const emailExists = await dbClient.users.findOne({ email });
    if (emailExists) return response.status(400).send({ error: 'Already exist' });

    const hashedPwd = sha1(password);
    const result = await dbClient.users.insertOne({
      email,
      password: hashedPwd,
    });

    const user = {
      id: result.insertedId,
      email,
    };

    await userQueue.add({
      userId: result.insertedId.toString(),
    });

    return response.status(201).send(user);
  }
}

module.exports = UsersController;

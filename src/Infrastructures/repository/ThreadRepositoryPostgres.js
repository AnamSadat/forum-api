import ThreadRepository from '../../Domains/threads/ThreadRepository';
import NotFoundError from '../../Commons/exceptions/NotFoundError';

export default class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator}`;

    const query = {
      text: 'INSERT INTO threads (id, title, body, owner) VALUES ($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async verifyThreadExist(threadId) {
    const query = {
      text: 'SELECT 1 FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
  }

  async getThreadById(threadId) {
    const query = {
      text: 'SELECT threads.id, threads.title, threads.body, threads.date, users.username FROM threads JOIN users ON threads.owner = users.id WHERE threads.id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }
}

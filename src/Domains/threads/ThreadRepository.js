export default class ThreadRepository {
  async addThread(newThread) {
    console.log(newThread);
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENT');
  }

  async verifyThreadExist(threadId) {
    console.log(threadId);
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENT');
  }

  async getThreadById(threadId) {
    console.log(threadId);
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENT');
  }
}

import AddThread from '../../Domains/threads/entities/AddedThread';
import NewThread from '../../Domains/threads/entities/NewThread';

export default class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newThread = new NewThread(useCasePayload);
    const addedThread = await this._threadRepository.addThread(newThread);
    return new AddThread(addedThread);
  }
}

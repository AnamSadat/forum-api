import { vi } from 'vitest';
import AddedThread from '../../../Domains/threads/entities/AddedThread';
import ThreadRepository from '../../../Domains/threads/ThreadRepository';
import AddThreadUseCase from '../AddThreadUseCase';
import NewThread from '../../../Domains/threads/entities/NewThread';

describe('AddThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengorkestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'judul',
      body: 'isi',
      owner: 'user-123',
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = vi.fn(() =>
      Promise.resolve({
        id: 'thread-123',
        title: useCasePayload.title,
        owner: useCasePayload.owner,
      }),
    );

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread(useCasePayload),
    );
    expect(addedThread).toStrictEqual(mockAddedThread);
  });
});

export default class AddThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, title, owner } = payload;

    this._id = id;
    this._title = title;
    this._owner = owner;
  }

  _verifyPayload(payload) {
    if (!payload) throw new Error('ADDED_THREAD.PAYLOAD_REQUIRED');

    const { id, title, owner } = payload;

    if (!id || !title || !owner)
      throw new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');

    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof owner !== 'string'
    )
      throw new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

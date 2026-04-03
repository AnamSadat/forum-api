export default class NewThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { title, body, owner } = payload;

    this._title = title;
    this._body = body;
    this._owner = owner;
  }

  _verifyPayload(payload) {
    if (!payload) throw new Error('NEW_THREAD.PAYLOAD_REQUIRED');

    const { title, body, owner } = payload;

    if (!title || !body || !owner)
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');

    if (
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof owner !== 'string'
    )
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

export default class NewComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { threadId, content, owner } = payload;

    this._threadId = threadId;
    this._content = content;
    this._owner = owner;
  }

  _verifyPayload(payload) {
    if (!payload) throw new Error('NEW_COMMENT.PAYLOAD_REQUIRED');

    const { threadId, content, owner } = payload;

    if (!threadId || !content || !owner)
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');

    if (
      typeof threadId !== 'string' ||
      typeof content !== 'string' ||
      typeof owner !== 'string'
    )
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

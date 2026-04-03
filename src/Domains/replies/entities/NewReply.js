export default class NewReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { commentId, content, owner } = payload;

    this._commentId = commentId;
    this._content = content;
    this._owner = owner;
  }

  _verifyPayload(payload) {
    if (!payload) throw new Error('NEW_REPLY.PAYLOAD_REQUIRED');

    const { commentId, content, owner } = payload;

    if (!commentId || !content || !owner)
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');

    if (
      typeof commentId !== 'string' ||
      typeof content !== 'string' ||
      typeof owner !== 'string'
    )
      throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

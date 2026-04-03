export default class AddedComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, owner } = payload;

    this._id = id;
    this._content = content;
    this._owner = owner;
  }

  _verifyPayload(payload) {
    if (!payload) throw new Error('ADDED_COMMENT.REQUIRED_PAYLOAD');

    const { id, content, owner } = payload;

    if (!id || !content || !owner)
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof owner !== 'string'
    )
      throw new Error('ADDED_COMMENT.NOT_META_DATA_TYPE_SPECIFICATION');
  }
}

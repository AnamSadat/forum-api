/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('likes', {
    id: {
      type: 'TEXT',
      primaryKey: true,
    },
    thread_id: {
      type: 'TEXT',
      notNull: true,
      references: 'threads(id)',
      referencesConstraintName: 'fk_likes.thread_id_threads.id',
      onDelete: 'CASCADE',
    },
    comment_id: {
      type: 'TEXT',
      notNull: true,
      references: 'comments(id)',
      referencesConstraintName: 'fk_likes.comment_id_comments.id',
      onDelete: 'CASCADE',
    },
    date: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    owner: {
      type: 'TEXT',
      notNull: true,
      references: 'users(id)',
      referencesConstraintName: 'fk_likes.owner_users.id',
      onDelete: 'CASCADE',
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('likes');
};

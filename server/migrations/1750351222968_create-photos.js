export const up = (pgm) => {
  pgm.createTable('photos', {
    id: 'id', // auto-incrementing primary key
    path: { type: 'text', notNull: true },
    name: { type: 'varchar(1000)', notNull: false },
    longitude: { type: 'double precision', notNull: false },
    latitude: { type: 'double precision', notNull: false },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

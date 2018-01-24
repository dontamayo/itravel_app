exports.up = function (knex, Promise) {
  return knex.schema.createTable('traveler', (table) => {
    table.increments();
    table.string('title', 100).notNull();
    table.text('description');
    table.timestamps(true, true);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('traveler');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('order',function(table) {
        table.increments('id').primary();
        table.string('external_id');
        table.integer('client_id').unsigned().references('id').inTable('users');
        table.string('status').notNullable()
        table.decimal('total', 14, 2).notNullable()
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('order');
};

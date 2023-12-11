/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('payments',function(table) {
        table.increments('id').primary();
        table.integer('external_id').notNull()
        table.integer('order_id').unsigned().references('id').inTable('order').notNull();
        table.float('totalValue').notNull()
        table.string('type').notNull()
        table.string('status').notNull()
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('payments');
};

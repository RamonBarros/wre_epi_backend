/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('order_items',function(table) {
        table.increments('id').primary();
        table.integer('product_id').unsigned().references('id').inTable('products');
        table.integer('order_id').unsigned().references('id').inTable('order');
        table.integer('quantity').notNullable().defaultTo(1)
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('order_items');
};

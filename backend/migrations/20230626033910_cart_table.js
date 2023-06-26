/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('cart_items',function(table) {
        table.increments('id').primary();
        table.integer('product_id').unsigned().references('id').inTable('products');
        table.integer('quantity').notNull();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('cart_items');
};

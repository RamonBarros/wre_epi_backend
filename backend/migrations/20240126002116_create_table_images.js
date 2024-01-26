/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('product_images', (table) => {
        table.increments('image_id').primary();
        table.integer('product_id').unsigned().references('id').inTable('products').notNull();
        table.string('url');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('product_images');
};

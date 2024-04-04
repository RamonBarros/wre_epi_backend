/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('banners', (table) => {
        table.increments('id').primary();
        table.string('banner_image_url');
        table.string('banner_link');
    }).createTable('carrousel_images', (table) => {
        table.increments('id').primary();
        table.string('banner_image_url');
        table.string('banner_link');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('banners').dropTable('carrousel_images');
};

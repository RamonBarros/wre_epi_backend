/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable('products', function (table) {
        table.float('height');
        table.float('width');
        table.float('length');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable('products', function (table) {
        table.dropColumn('height');
        table.dropColumn('width');
        table.dropColumn('length');  
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable('products', function (table) {
        table.float('height').notNullable().alter();
        table.float('width').notNullable().alter();
        table.float('length').notNullable().alter();
        table.float('weight');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable('products', function (table) {
        table.float('height').alter();
        table.float('width').alter();
        table.float('length').alter();
        table.dropColumn('weight'); 
    });
};

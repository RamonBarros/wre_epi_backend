/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable('products', function (table) {
        // Adicionar not null para as colunas de dimensões da embalagem
        table.float('package_height').notNullable().alter();
        table.float('package_width').notNullable().alter();
        table.float('package_length').notNullable().alter();
        table.float('package_weight').notNullable().alter();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable('products', function (table) {
        // Remover not null para as colunas de dimensões da embalagem
        table.float('package_height').alter();
        table.float('package_width').alter();
        table.float('package_length').alter();
        table.float('package_weight').alter();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable('products', function (table) {
        // Renomear as colunas existentes para seguir o novo padrão
        table.renameColumn('height', 'product_height');
        table.renameColumn('width', 'product_width');
        table.renameColumn('length', 'product_length');
        table.renameColumn('weight', 'product_weight');

        // Adicionar as novas colunas relacionadas às dimensões da embalagem do produto
        table.float('package_height');
        table.float('package_width');
        table.float('package_length');
        table.float('package_weight');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable('products', function (table) {
        // Desfazer as alterações, renomeando as colunas de volta ao estado original
        table.renameColumn('product_height', 'height');
        table.renameColumn('product_width', 'width');
        table.renameColumn('product_length', 'length');
        table.renameColumn('product_weight', 'weight');

        // Remover as novas colunas relacionadas às dimensões da embalagem do produto
        table.dropColumn('package_height');
        table.dropColumn('package_width');
        table.dropColumn('package_length');
        table.dropColumn('package_weight');
    });
};

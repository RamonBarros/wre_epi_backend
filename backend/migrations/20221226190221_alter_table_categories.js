exports.up = function(knex) {
    return knex.schema.table ('products', function(table) {
        table.renameColumn('categoriesId', 'categoryId')
    })
};

exports.down = function(knex) {
    return knex.schema.table ('products', function(table) {
        table.renameColumn('categoryId', 'categoriesId')
    })
};
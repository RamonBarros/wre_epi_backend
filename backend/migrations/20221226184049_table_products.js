exports.up = function(knex, Promise) {
    return knex.schema.createTable('products', table =>{
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('short_description',200).notNull()
        table.string('long_description',2000).notNull()
        table.string('videoUrl',800)
        table.integer('categoriesId').references('id')
        .inTable('categories').notNull()
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('products')
};
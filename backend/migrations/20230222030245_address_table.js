exports.up = function(knex, Promise) {
    return knex.schema.createTable('user_address', table =>{
        table.increments('id').primary()
        table.string('city').notNull()
        table.string('country').notNull()
        table.string('number').notNull()
        table.string('district').notNull()
        table.string('state').notNull()
        table.string('zipCode').notNull()
        table.string('complement',200).notNull()
        table.integer('userId').references('id')
        .inTable('users').notNull()
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('products')
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex,Promise) {
    return knex.schema.createTable('users', table =>{
        table.increments('id').primary()
        table.string('cpf').notNull()
        table.string('name').notNull()
        table.string('email').notNull().unique() 
        table.string('password').notNull() 
        table.string('empresa').notNull() 
        table.boolean('admin').notNull().defaultTo(false)
        table.string('telefone').notNull() 
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex,Promise) {
    return knex.schema.dropTable('users')
};

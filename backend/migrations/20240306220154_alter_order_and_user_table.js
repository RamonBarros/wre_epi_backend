exports.up = function(knex) {
    return Promise.all([
      knex.schema.alterTable('order', function (table) {
        // Adicionar not null para as colunas de dimensões da embalagem
        table.decimal('shipping_cost', 10, 2).notNullable().defaultTo(0);
      }),
  
      knex.schema.alterTable('users', function(table) {
        table.date('birth_date').notNullable().defaultTo(knex.raw('CURRENT_DATE'));
      })
    ]);
  };
  
  exports.down = function(knex) {
    return Promise.all([
      knex.schema.alterTable('order', function(table) {
        table.dropColumn('shipping_cost');
      }),
  
      knex.schema.alterTable('users', function(table) {
        table.dropColumn('birth_date');
      })
    ]);
  };
  
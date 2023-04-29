exports.up = function(knex) {
    return knex.schema.table('user_address', table => {
      table.string('street');
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.table('user_address', table => {
      table.dropColumn('street');
    })
  };
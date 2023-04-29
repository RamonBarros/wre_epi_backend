exports.up = function(knex) {
    return knex.schema.table('users', table => {
      table.string('resetLink',255);
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.table('users', table => {
      table.dropColumn('resetLink');
    })
};

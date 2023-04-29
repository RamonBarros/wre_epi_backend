exports.up = function(knex) {
    return knex.schema.table('products', table => {
      table.string('imageUrl',800);
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.table('products', table => {
      table.dropColumn('imageUrl');
    })
};
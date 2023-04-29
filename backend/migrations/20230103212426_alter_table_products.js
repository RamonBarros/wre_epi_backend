exports.up = function(knex) {
    return knex.schema.table('products', table => {
      table.float('price',2);
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.table('products', table => {
      table.dropColumn('price');
    })
};

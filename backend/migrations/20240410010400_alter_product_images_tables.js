exports.up = function(knex) {
    return knex.schema.alterTable('product_images', (table) => {
      table.text('url').alter();
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.alterTable('product_images', (table) => {
      table.string('url').alter();
    })
  };
  
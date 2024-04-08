exports.up = function(knex) {
    return knex.schema.alterTable('banners', (table) => {
      table.text('banner_image_url').alter();
      table.text('banner_link').alter();
    }).alterTable('carrousel_images', (table) => {
      table.text('carrousel_image_url').alter();
      table.text('carrousel_image_link').alter();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.alterTable('banners', (table) => {
      table.string('banner_image_url').alter();
      table.string('banner_link').alter();
    }).alterTable('carrousel_images', (table) => {
      table.string('carrousel_image_url').alter();
      table.string('carrousel_image_link').alter();
    });
  };
  
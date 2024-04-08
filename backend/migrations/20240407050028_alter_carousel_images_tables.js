exports.up = function(knex) {
    return knex.schema.renameTable('carrousel_images', 'carousel_images').then(() => {
      return knex.schema.alterTable('carousel_images', (table) => {
        table.renameColumn('carrousel_image_url', 'carousel_image_url');
        table.renameColumn('carrousel_image_link', 'carousel_image_link');
      });
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.alterTable('carousel_images', (table) => {
      table.renameColumn('carousel_image_url', 'carrousel_image_url');
      table.renameColumn('carousel_image_link', 'carrousel_image_link');
    }).then(() => {
      return knex.schema.renameTable('carousel_images', 'carrousel_images');
    });
  };
  
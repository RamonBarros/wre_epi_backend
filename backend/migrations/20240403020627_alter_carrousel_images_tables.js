exports.up = function(knex) {
    return knex.schema.table('carrousel_images', table => {
      table.renameColumn('banner_image_url', 'carrousel_image_url');
      table.renameColumn('banner_link', 'carrousel_image_link');
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.table('carrousel_images', table => {
        table.renameColumn('carrousel_image_url', 'banner_image_url');
        table.renameColumn('carrousel_image_link', 'banner_link');
    })
  };
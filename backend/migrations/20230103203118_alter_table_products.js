exports.up = function(knex) {
    return knex.schema.table('products', table => {
      table.string('shortVideoUrl',800);
      table.renameColumn('videoUrl', 'longVideoUrl');
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.table('products', table => {
      table.dropColumn('shortVideoUrl');
      table.renameColumn('longVideoUrl', 'videoUrl');
    })
  };

var kss   = require('kss');
var debug = require('debug')('metalsmith-kss');

module.exports = plugin;

/**
 * Metalsmith plugin to add KSS output
 */
function plugin(options){
  options = options || {};
  options.options = options.options || {};

  return function(files, metalsmith, done){

    kss.traverse(options.source, options.options, function(err, styleguide) {
      setImmediate(done);

      if (err) throw err;

      var sections = styleguide.section(options.sectionQuery);

      // Throw an error if no KSS sections are found in the source files.
      if (sections.length === 0) {
        throw 'No KSS documentation discovered in source files.';
      }

      console.log(styleguide.data.files.map(function(file) {
        return ' - ' + file;
      }).join('\n'));

      sections.forEach(function(section) {
        var sectionDirectory = section.reference().split('.').join('/') + '.html';

        files[options.target + sectionDirectory] = {
          title: section.reference() + ' ' + section.header(),
          template: options.template,
          nav_sort: 0,
          nav_groups: ['primary'],
          contents: section.description() + section.markup(), // TODO: Add other section attributes (in a template?)
          nav_children: { primary: [] },
          breadcrumb_path: []
        };
      });
    });
  };
}

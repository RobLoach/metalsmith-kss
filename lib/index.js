var kss   = require('kss');
var debug = require('debug')('metalsmith-kss');
var fs    = require('fs');
var Handlebars = require('handlebars');

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

      var templateHtml = fs.readFileSync(options.template || __dirname + '/../templates/kss.hbs', { encoding: 'utf8' });
      var template = Handlebars.compile(templateHtml, options);

      sections.forEach(function(section) {
        var sectionDirectory = section.reference().split('.').join('/') + '.html';
        var html = template(section);

        files[options.target + sectionDirectory] = {
          title: section.reference() + ' ' + section.header(),
          template: options.pageTemplate,
          nav_sort: 0,
          nav_groups: ['primary'],
          contents: html,//section.description() + section.markup(),
          nav_children: { primary: [] },
          breadcrumb_path: []
        };
      });
    });
  };
}

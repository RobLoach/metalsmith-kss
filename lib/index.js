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

  if (!options.source) {
    throw new Error('No source given!');
  }
  if (!options.target) {
    throw new Error('No target given!');
  }

  // Read all files from the options.fixtures glob and put their contents into fixtures
  var fixtures = {};
  if (options.fixtures) {
    options.fixtures.forEach(function(file) {
      fixtures[file] = fs.readFileSync(file, { encoding: 'utf8' });
    });
  }

  return function(files, metalsmith, done){

    kss.traverse(options.source, options.options, function(err, styleguide) {
      setImmediate(done);

      if (err) throw err;

      var sections = styleguide.section(options.sectionQuery);

      // Throw an error if no KSS sections are found in the source files.
      if (sections.length === 0) {
        throw 'No KSS documentation discovered in source files.';
      }

      debug(styleguide.data.files.map(function(file) {
        return ' - ' + file;
      }).join('\n'));

      var templateHtml = fs.readFileSync(options.template || __dirname + '/../templates/kss.hbs', { encoding: 'utf8' });
      var template = Handlebars.compile(templateHtml, options);

      sections.forEach(function(section, i) {
        var sectionDirectory = section.reference();
        if (!options.flatten) {
          sectionDirectory = sectionDirectory.split('.').join('/');
        }
        sectionDirectory += '.html';

        // Replace all {{> path/to/external_fixture.hbs}} occurrences with the corresponding fixture
        if (section.markup()) {
          var matches = section.markup().match(/{{.*}}/g);
          if (matches !== null) {
            section.data.markup = section.markup().replace(/{{>(.*)}}/, function() {
              var file = arguments[1].trim();
              if (typeof fixtures[file] === 'undefined') {
                throw new Error('Warning: Markup file "' + file + '" could not be included!');
              }
              return fixtures[file];
            });
          }
        }

        var html = template(section);

        files[options.target + sectionDirectory] = {
          title: section.reference() + ' ' + section.header(),
          template: options.pageTemplate,
          nav_sort: i,
          nav_groups: ['primary'],
          contents: html,
          nav_children: { primary: [] },
          breadcrumb_path: []
        };
      });
    });
  };
}

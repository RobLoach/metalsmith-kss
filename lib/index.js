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
  if (options.Handlebars) {
    Handlebars = options.Handlebars;
  }

  if (!options.source) {
    throw new Error('No source given!');
  }
  if (!options.target) {
    throw new Error('No target given!');
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
        var parentSection = section.reference().split('.', options.maxDepth || 1).join('.');
        var parentDirectory = parentSection;
        if (!options.flatten) {
          sectionDirectory = sectionDirectory.split('.').join('/');
          parentDirectory = parentDirectory.split('.').join('/');
        }
        sectionDirectory += '.html';
        parentDirectory += '.html';
        section.headerDepth = section.data.refDepth <= 6 ? section.data.refDepth : 6;

        // Replace all {{> path/to/external_fixture.hbs}} occurrences with the corresponding fixture
        if (section.markup()) {
          var matches = section.markup().match(/{{.*}}/g);
          if (matches !== null) {
            section.data.markup = section.markup().replace(/{{>(.*)}}/, function() {
              var file = arguments[1].trim();
              var fixtures = options.fixtures || {};
              if (typeof fixtures[file] === 'undefined') {
                throw new Error('Warning: Markup file "' + file + '" could not be included!');
              }
              return fixtures[file];
            });
          }
        }

        var html = template(section);

        if (options.maxDepth && section.data.refDepth > options.maxDepth) {
          if (!files[options.target + parentDirectory]) {
            return done(new Error('Cannot add section "' + section.reference() + '" to non-existing parent "' + parentSection + '"!'));
          }
          files[options.target + parentDirectory].contents += html;
        } else {
          files[options.target + sectionDirectory] = {
            title: section.reference() + ' ' + section.header(),
            template: options.pageTemplate,
            nav_sort: i,
            nav_groups: ['primary'],
            contents: html,
            nav_children: { primary: [] },
            breadcrumb_path: []
          };
        }
      });
    });
  };
}

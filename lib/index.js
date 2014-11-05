var kss   = require('kss');
var debug = require('debug')('metalsmith-kss');

module.exports = plugin;

/**
 * Metalsmith plugin to add KSS output
 */
function plugin(options){
  options = options || {};

  return function(files, metalsmith, done){

    kss.traverse('less/', {
      multiline : true,
      markdown  : true,
      markup    : true
    }, function(err, styleguide) {
      setImmediate(done);
      //return;

      if (err) throw err;

      var sections = styleguide.section('*.'),
        sectionCount = sections.length,
        sectionRoots = [],
        rootCount,
        currentRoot,
        childSections = [],
        pages = {},
        i;

      console.log(styleguide.data.files.map(function(file) {
        return ' - ' + file;
      }).join('\n'));

      // Throw an error if no KSS sections are found in the source files.
      if (sectionCount === 0) {
        throw 'No KSS documentation discovered in source files.';
      }

      // Accumulate all of the sections' first indexes
      // in case they don't have a root element.
      for (i = 0; i < sectionCount; i += 1) {
        currentRoot = sections[i].reference().match(/[0-9]*\.?/)[0].replace('.', '');

        if (!~sectionRoots.indexOf(currentRoot)) {
          sectionRoots.push(currentRoot);
        }
      }

      sectionRoots.sort();
      rootCount = sectionRoots.length;

      // Now, group all of the sections by their root
      // reference, and make a page for each.
      for (i = 0; i < rootCount; i += 1) {
        childSections = styleguide.section(sectionRoots[i]+'.*');
//        console.log('TRAVERSE', styleguide);
        //generatePage(
        //  'build/kss', styleguide, childSections,
        //  sectionRoots[i], pages, sectionRoots
        //);

      }

      sections.forEach(function(section) {

        if (section.data.markup === '{{> breadcrumbs}}') {
          section.data.markup = 'REPLACED';
        }

        files['styleguide/' + section.data.reference] = {
          title: section.data.header,
          template: 'page.html',
          nav_sort: 20,
          nav_groups: ['primary'],
          contents: section.data.description + section.data.markup,
          nav_children: { primary: [] },
          breadcrumb_path: []
        };
      });
    });
  };
}

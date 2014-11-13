var assert = require('assert');
var equal = require('assert-dir-equal');
var Metalsmith = require('metalsmith');
var kss = require('..');

describe('metalsmith-kss', function(){
  it('should create a file for a KSS section', function(done){
    Metalsmith('test/fixtures/full')
      .use(kss({
        source: 'test/fixtures/full/css/',
        target: './'
      }))
      .build(function(err){
        if (err) return done(err);
        equal('test/fixtures/full/expected', 'test/fixtures/full/build');
        done();
      });
  });
});

var equal = require('assert-dir-equal');
var assert = require('assert');
var Metalsmith = require('metalsmith');
var kss = require('..');
var glob = require('glob');

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

  it('should add external fixtures to the KSS markup section', function(done){
    Metalsmith('test/fixtures/external-fixture')
      .use(kss({
        source: 'test/fixtures/external-fixture/css/',
        target: './',
        fixtures: { 'path/to/fixture': '<p>Crazy external markup</p>' }
      }))
      .build(function(err){
        if (err) return done(err);
        equal('test/fixtures/external-fixture/expected', 'test/fixtures/external-fixture/build');
        done();
      });
  });

  it('should add sections beyond maxDepth to the parent section', function(done){
    Metalsmith('test/fixtures/max-depth')
      .use(kss({
        source: 'test/fixtures/max-depth/css/',
        target: './',
        maxDepth: 2
      }))
      .build(function(err){
        if (err) return done(err);
        equal('test/fixtures/max-depth/expected', 'test/fixtures/max-depth/build');
        done();
      });
  });

  it('should warn if orphaned sections are found', function(done){
   Metalsmith('test/fixtures/orphaned-section')
      .use(kss({
        source: 'test/fixtures/orphaned-section/css/',
        target: './',
        maxDepth: 1
      }))
      .build(function(err){
        assert(err);
        done();
      });
  });
});

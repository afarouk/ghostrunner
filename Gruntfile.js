'use strict';

var grunt = require('grunt');
var argv = require('yargs').argv;

grunt.log.write('compiling Ghostrunner');

var webpackConfig = require('./webpack.config.js');

// stop webpack watch and keepalive
webpackConfig.watch = false;
webpackConfig.keepalive = false;

module.exports = function (grunt) {
  'use strict';

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);
  var webpack = require('webpack');

  var yeomanConfig = {
    app: 'app/app_ghostrunner',
    dist: 'dist',
    indexFile: 'prod-index.html',
    project: 'ghostrunner'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,

    webpack: {
        options: webpackConfig,
        'prod': {
            devtool: null // production
        }
    },
    clean: [
      './dist.zip',
      '<%= yeoman.dist %>',
      '<%= yeoman.app %>/build'
    ],
    uglify: {
      options: {
        compress: true,
        mangle: true,
        sourceMap: false
      },
      target: {
        src: '<%= yeoman.dist %>/bundle.js',
        dest: '<%= yeoman.dist %>/bundle.js'
      }
    },
    cssmin: {
      target: {
        files: {
          '<%= yeoman.dist %>/bundle.css': '<%= yeoman.dist %>/bundle.css',
          '<%= yeoman.dist %>/desktop.css': '<%= yeoman.dist %>/desktop.css',
          '<%= yeoman.dist %>/mobile.css': '<%= yeoman.dist %>/mobile.css'
        }
      },
      options: {
        report: 'min'
      }
    },
    copy: {
      dist: {
        files: [
          { expand: true,
            cwd: '<%= yeoman.app %>/build',
            src: ['**'],
            dest: '<%= yeoman.dist %>'
          },
          { expand: true,
            cwd: '<%= yeoman.app %>/build',
            src: ['.htaccess'],
            dest: '<%= yeoman.dist %>'
          }  
        ]
      }
    },
    compress: {
        dist: {
            options: {
                archive: './dist.zip',
                mode: 'zip'
            },
            files: [{
                dot: true,
                expand: true,
                src : "**/*",
                cwd : "./dist/"
            }]
        }
    },
    cacheBust: {
        taskName: {
            options: {
                assets: ['<%= yeoman.dist %>/']
            },
            src: ['index.php']
        }
    }
  });

  grunt.registerTask('default', function() {
      grunt.task.run([
        'clean',
        'webpack:prod',
        'copy',
        'uglify',
        'cssmin',
        'compress',
        'cacheBust'
      ]);
  });

};

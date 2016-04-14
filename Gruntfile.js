'use strict';

var serveStatic = require('serve-static');

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: 'app',
    dist: 'dist',
    jsBundle: 'generatedBundle.js'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,**/}generated*.js',
          '<%= yeoman.app %>/*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost',
        livereload: 36868
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect, options, middlewares) {
            var additionalMiddlewares = [];
            additionalMiddlewares.push(serveStatic('.tmp'));
            additionalMiddlewares.push(['/node_modules', serveStatic('./node_modules')]);
            additionalMiddlewares.push(serveStatic(appConfig.app));

            // put additional ones to front
            return additionalMiddlewares.concat(middlewares);
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '<%= yeoman.app %>/scripts/<%= yeoman.jsBundle %>'
          ]
        }]
      },
      server: '.tmp'
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: './node_modules',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= yeoman.dist %>/images/generated'
        }
      },
      server: {
        options: {
          sourcemap: true
        }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,**/}*.js',
          '<%= yeoman.dist %>/styles/{,**/}*.css',
          '<%= yeoman.dist %>/images/{,**/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat'],
              css: ['concat']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>',
          '<%= yeoman.dist %>/images',
          '<%= yeoman.dist %>/styles'
        ]
      }
    },

    // compress css
    ///////////////////////
    cssmin: {
      options: {
        banner: '',
        report: 'min'
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.dist %>',
            src: '**/*.css',
            dest: '<%= yeoman.dist %>'
          }
        ]
      }
    },

    htmlmin: {
      dist: {
        options: {
          // collapseWhitespace: true,
          // conservativeCollapse: true,
          // collapseBooleanAttributes: true,
          // removeCommentsFromCDATA: true,
          // removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // uglify js files
    ///////////////////////////////////////
    uglify: {
      options: {
        mangle: false,
        compress: true,
        beautify: false
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.dist %>',
            src: '{,**/}*.js',
            dest: '<%= yeoman.dist %>'
          }
        ]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          dest: '<%= yeoman.dist %>/images',
          src: '*'
        }, {
          expand: true,
          cwd: '.tmp/css',
          dest: '<%= yeoman.dist %>/css',
          src: '{,*/}*.css'
        }, {
          expand: true,
          cwd: '.',
          src: 'node_modules/bootstrap-sass/assets/fonts/bootstrap/*',
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: {
        tasks: ['compass:server'],
        options: {
          logConcurrentOutput: true
        }
      },
      dist: {
        tasks: [
          'compass:dist', 'browserify:dist'
        ],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    browserify: {
      dev: {
        src: '<%= yeoman.app %>/scripts/main.js',
        dest: '<%= yeoman.app %>/scripts/<%= yeoman.jsBundle %>',
        options: {
          watch: true
        }
      },
      dist: {
        src: '<%= yeoman.app %>/scripts/main.js',
        dest: '<%= yeoman.app %>/scripts/<%= yeoman.jsBundle %>'
      },
      options: {
        transform: ['browserify-shim', 'babelify']
      }
    }

  });

  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {

    if (target === 'dist') {
      return grunt.task.run([
        'build',
        'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'connect:livereload',
      'browserify:dev',
      'watch'
    ]);
  });

  grunt.registerTask('build', 'build assets', function (target) {

    grunt.task.run([
      'clean:dist',     // clean temp and dist directories
      'concurrent:dist',// compile sass, move images to dist
      'useminPrepare',  // read html build blocks and prepare to concatenate and move css,js to dist
      'concat',         // concatinates files and moves them to dist
      'cssmin',         // minify css in dist
      'htmlmin',        // minify and copy html files to dist
      'copy:dist',      // move unhanled files to dist
      'uglify',         // minifies & uglifies js files in dist
      'filerev',        // hashes js/css/img/font files in dist
      'usemin'
    ]);
  });

  grunt.registerTask('default', [
    'build'
  ]);
};

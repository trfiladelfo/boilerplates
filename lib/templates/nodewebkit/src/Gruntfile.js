module.exports = function(grunt) {

    'use strict';

    // Displays the execution time of grunt tasks
    require('time-grunt')(grunt);

    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);


    ///////////////////////////////////////////
    // CONFIG TASKS                          //
    ///////////////////////////////////////////

    grunt.initConfig({

        // Config
        paths: { // Available Paths
            app:     '../app',
            build:   '../_build',
            dist:    '../_dist',
            specs:   '../spec',
        },
        app: {
            name: grunt.file.readJSON('../_dist/package.json').name
        },
        bin: { // Available Binaries
            nix32: '../_build/releases/<%= app.name %>/linux32/<%= app.name %>',
            nix64: '../_build/releases/<%= app.name %>/linux64/<%= app.name %>',
            mac:   '../_build/releases/<%= app.name %>/mac/node-webkit.app',
            win:   '../_build/releases/<%= app.name %>/win/<%= app.name %>.exe'
        },
        pkg: grunt.file.readJSON('package.json'),

        // Open
        open: {
            compile: {
                path: 'http://localhost:3030',
                app: 'Firefox'
            },
            build: {
                path: '<%= paths.dist %>',
                app: 'node-webkit'
            }
        },

        // Start Web Server
        connect: {
            compile: {
                options: {
                    port: 3030,
                    hostname: 'localhost',
                    base: '<%= paths.dist %>'
                }
            }
        },

        // Watch
        watch: {
            options: {
                livereload: true
            },
            styles: {
                files: '<%= paths.app %>/styles/**/*.scss',
                tasks: ['compass']
            },
            scripts: {
                files: '<%= jshint.all %>',
                tasks: ['jshint', 'uglify']
            },
            views: {
                files: '<%= paths.app %>/*.html',
                tasks: ['copy:html']
            },
            json: {
                files: '<%= paths.app %>/_package.json',
                tasks: ['copy:manifest']
            }
        },

        // UglifyJS
        uglify: {
            options: {
                compress: true,
                mangle: false,
                banner: [
                    '/**',
                    ' * -------------------------------------------------------',
                    ' * <%= pkg.name %> - <%= pkg.description %>',
                    ' * @version  <%= pkg.version %>',
                    ' * @link     <%= pkg.homepage %>',
                    ' * @license  <%= pkg.license %>',
                    ' * -------------------------------------------------------',
                    ' */',
                    ''
                ].join('\n')
            },
            compile: {
                files: {
                    '<%= paths.dist %>/scripts/app.min.js': ['<%= paths.app %>/scripts/**/*.js']
                }
            }
        },

        // JSHint
        jshint: {
            all: [
                'Gruntfile.js',
                '<%= paths.specs %>/**/*.js',
                '<%= paths.app %>/scripts/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Compass
        compass: {
            compile: {
                options: {
                    sassDir: '<%= paths.app %>/styles',
                    cssDir: '<%= paths.dist %>/styles',
                    outputStyle: 'compressed'
                }
            }
        },

        // Mocha
        mocha: {
            test: {
                options: {
                    reporter: 'Nyan'
                },
                src: ['<%= paths.specs %>/**/*.js']
            },
        },

        // Copy
        copy: {
            images: {
                expand: true,
                cwd: '<%= paths.app %>/images/',
                src: ['*.{jpg,png}'],
                dest: '<%= paths.dist %>/images/'
            },
            manifest: {
                src: '<%= paths.app %>/_package.json',
                dest: '<%= paths.dist %>/package.json'
            },
            html: {
                expand: true,
                cwd: '<%= paths.app %>/',
                src: ['*.html'],
                dest: '<%= paths.dist %>/'
            }
        },

        // Clean
        clean: {
            options: {
                force: true
            },
            all: {
                src: [
                    '<%= paths.dist %>',
                    '<%= paths.build %>'
                ]
            }
        },

        // Node Webkit
        nodewebkit: {
            options: {
                app_name: '<%= app.name %>',        // What is the name of your application?
                app_version: '0.1.0',               // What is the version of your application?
                force_download: true,               // Force download for every time you run the app build?
                mac: true,                          // Would you like to build for Mac OSX?
                win: false,                         // Would you like to build for Windows?
                linux32: false,                     // Would you like to build for Linux 32 bits?
                linux64: false,                     // Would you like to build for Linux 64 bits?
                build_dir: '<%= paths.build %>'     // Build path
            },
            src: '<%= paths.dist %>/**/*'           // Source files
        }

    });


    ///////////////////////////////////////////
    // REGISTER TASKS                        //
    ///////////////////////////////////////////

    // Default Task
    grunt.registerTask('default', 'Build Node Webkit Application', [
        'build',
        'nodewebkit'
    ]);

    // Build Task
    grunt.registerTask('build', 'Compile Application for Development', [
        'clean:all',
        'compass',
        'jshint',
        'uglify',
        'copy',
        'open:build'
    ]);

    // Watch Task
    grunt.registerTask('run', 'Start Web Server and watch for changes', [
        'connect',
        'open:compile',
        'open:build',
        'watch'
    ]);

    // Spec Task
    grunt.registerTask('test', 'Run Unit Tests', ['mocha']);

};
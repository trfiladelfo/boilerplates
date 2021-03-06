module.exports = function(grunt) {

    'use strict';

    var config = require('../grunt.conf');

    grunt.config('compass', {
        dist: config.compass
    });

    grunt.config('csscomb', {
        dist: config.csscomb
    });

    grunt.config('csslint', {
        dist: config.csslint
    });

    grunt.config('cssmin', {
        dist: config.cssmin
    });

};


module.exports = function(grunt) {

    'use strict';

    var config = require('../grunt.conf');

    grunt.config('ftp-deploy', {
        dist: config.ftp
    });

    grunt.config('rsync', {
        dist: config.rsync
    });

    grunt.config('bump', {
        dist: config.git
    });

    // grunt.config('shell', {
    //     mycmd: config.shell.mycmd
    // });

};

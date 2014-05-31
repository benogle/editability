module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    coffee: {
      compile: {
        files: {
          'editabilty.js': ['*.coffee'] // compile and concat into single file
        }
      }
    },

    watch: {
      scss: {
        files: [
          'stylesheets/*.scss'
        ],
        tasks: ['sass']
      }
    }
  });

  // These plugins provide necessary tasks
  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});
  require('time-grunt')(grunt);

  // Register the tasks
  grunt.registerTask('dist-js', ['coffee']);
  grunt.registerTask('dist', ['dist-js']);
  grunt.registerTask('build', ['dist']);
  grunt.registerTask('default', ['dist']);
};

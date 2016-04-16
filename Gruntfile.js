module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          'node_modules/jquery/dist/jquery.min.js',
          'node_modules/angular/angular.min.js',
          'node_modules/angular-route/angular-route.min.js',
          'node_modules/angular-animate/angular-animate.min.js',
          'node_modules/angular-animate/angular-animate.min.js'
        ],
        dest: 'public/vendor/dist/<%= pkg.name %>.js'
      },
      app: {
        src: [
          'public/app.js',
          'public/routes.js',
          'public/admin/login.js',
          'public/admin/home.js',
          'public/admin/createUsers.js',
          'public/admin/parseNames.js',
          'public/fbRef.js',
          'public/fbUrl.js',
          'public/nav/nav.js',
          'public/security/logout.js',
          'public/security/login.js'
        ],
        dest: 'public/app/app-bundle.js'
      }
    },
    uglify: {
      dist: {
        files: {
          'public/vendor/dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>'],
          'public/app-bundle.min.js':['<%= concat.app.dest %>']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');


  grunt.registerTask('default', ['concat', 'uglify']);

};
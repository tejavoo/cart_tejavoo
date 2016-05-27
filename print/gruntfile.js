module.exports = function(grunt){
  grunt.config.init({

cachebreaker: {
    dev: {
        options: {
            match: [{
                'style.css':'css/style.css',
                'common.css':'css/common.css',
                'mainApp.js':'js/mainApp.js',
                'app.js':'js/app.js',
                'header.js':'js/header.js',
                'common.js':'js/common.js',
                'fileReader.js':'js/fileReader.js',
                'events.js':'js/events.js',
                'login_register.js':'js/login_register.js',
                'mainApp.html':'mainApp.html',
                'index.html':'index.html'

            }],
            replacement: 'md5'
        },
        files: {
            src: ['index.html','mainApp.html','js/login_register.js','js/header.js','js/mainApp.js','js/app.js','layout/header.html']
        }
    }
}
  });
  
    grunt.loadNpmTasks( 'grunt-cache-breaker' );
    grunt.registerTask('default', ['cachebreaker']);
}


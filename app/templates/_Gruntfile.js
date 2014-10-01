var path = require('path');

module.exports = function (grunt) {
  grunt.initConfig({
	jshint: {
      options: {
        reporter: require('jshint-stylish'),
        // https://gist.github.com/haschek/2595796
        jshintrc: './.jshintrc'
      },
	  all: ['Grunfile.js', 'routes/*.js', 
      "models/*js", "forms/*js", 'test/**/*.js']
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/unit/**/*.js']
      }
    },
    watch: {
      scripts: {
        options: { livereload: 35729 },
        files: ['./models/*.js', './routes/*.js', './forms/*.js'], 
        tasks: ['jshint','mochaTest','docco']
      },
      tests: {
        options: { livereload: 35729 },
        files: ['./test/**/*.js'],
        tasks: ['mochaTest', 'docco']
      }, 
      public: {
        files: ['./public/**/*', './views/**/*.jade'],
        options: { livereload: 35729 },
        task: ['']
      } 
    },
    nodemon: {
      dev: {
            script: './bin/www',
            options: {
                ignore: ['node_modules/**', 'public/js/**/*'],
                callback: function (nodemon) {
                    // opens browser on initial server start
                    nodemon.on('config:update', function () {
                      // Delay before server listens on port
                      setTimeout(function() {
                        require('open')('http://localhost:3000/');
                      }, 3000);
                    });
                }
            }
      }
    },
    docco: {
      debug: {
        src: ['test/**/*.js','models/*.js','routes/*.js'],
        options: {
          output: 'docs/'
        }
      }
    },
    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true,
          limit: 5
        }
      },
      test: ['mochaTest']
    }
  });

  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-docco');

  grunt.task.registerTask('create', 'Create mongoose model + test', function(arg1, arg2) {
      grunt.log.debug(arg1, arg2);
      switch(arg1){
        case 'model':
            if(typeof arg2 !== 'undefined'){
              // create model
              var filemodel = grunt.template.process(grunt.file.read('./templates/mongoose-model.js.tpl'), {
                    data: {
                        'modelname': arg2
                    }      
              });
              var filename = './models/'+arg2.toLowerCase()+'.js';
              grunt.file.write(filename, filemodel);

              // create test
              var filetest = grunt.template.process(grunt.file.read('./templates/mongoose-model-tests.js.tpl'), {
                    data: {
                        'modelname': arg2
                    }      
              });
              var filenametest = './test/unit/models/'+arg2.toLowerCase()+'-tests.js';
              grunt.file.write(filenametest, filetest);

                
            } else {
                grunt.log.warn('Parameter name missing for '+arg1+' task');    
            }
        break;    
      }
  });

  grunt.registerTask('default', ['jshint', 'concurrent']);
};

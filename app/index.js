'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');


var AnyandgoGenerator = yeoman.generators.Base.extend({
  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);
    //this.log(yosay('Installing Express!'));
    /*
    this.composeWith('express:app', { options: {
        type: 'Basic',
        viewEngine: 'Jade',
        database: 'MongoDB'
    }});
    */
  },
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the marvelous Anyandgo generator!'));

    var prompts = [{
      type: 'confirm',
      name: 'someOption',
      message: 'Would you like to enable this option?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.someOption = props.someOption;

      done();
    }.bind(this));
  },

  app: function () {
    var y = this;
    this.invoke('express', { options : { basic: true, viewEngine: "jade" } }, function(){
        y.log(yosay('Override files!'));
    });
    
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.mkdir('models');
    this.mkdir('tests');
    this.mkdir('tests/unit');
    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
    this.copy('_Gruntfile.js', 'Gruntfile.js'); 
  }
});

module.exports = AnyandgoGenerator;

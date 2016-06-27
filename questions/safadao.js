const inquirer = require("inquirer")

const questions = [
    {
      	type: 'input',
      	name: 'name',
      	message: 'Qual seu nome?',
      	default: 'Eliseu'
    },
    {
    	type: 'confirm',
      	name: 'hasGitHub',
      	message: 'Você tem github?',
    },
    { 
      when: function (response) {
          return response.hasGitHub
        },
        type: 'input',
        name: 'username',
        message: 'Qual seu username?',
    },
    { 
      when: function (response) {
          return !response.hasGitHub
        },
        type: 'input',
        name: 'language',
        message: 'Qual sua linguagem favorita?',
    }
]

module.exports = questions
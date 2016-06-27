#!/usr/bin/env node
'use strict'

const program = require('commander')
const inquirer = require("inquirer")

const https = require('https')

const pkg = require('./package.json')

program
	.version(pkg.version)

program
  .command('name')
    .description('Retorna seu nome DEVSAFADÃO')
    .action(() => {
      var questions = require('./questions/safadao.js')

      inquirer.prompt(questions)
        .then((answers) => {
          if(answers.hasGitHub) {
            let options = {
              host:'api.github.com',
              path: `/users/${answers.username}/repos`,
              method: 'GET',
              headers: {'User-Agent':'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'}
            }

            console.log('Vasculhando seu GitHub...')

            https.get(options, (r) => {
              var body = ''
              
              r.on('data', (data) => {
                body += data
              })

              r.on('end', () => {
                let repos = JSON.parse(body)
                let languages = []

                console.log('Verificando seus repositórios...')
                repos.map(repo => {
                  if(repo.language != null) {
                    if(languages[repo.language]) {
                      languages[repo.language]++
                    } else {
                      languages[repo.language] = 1
                    }
                  }
                })
                console.log('Ordenando os resultados...')

                let language = Object.keys(languages).sort((a, b) => {
                  return languages[b] - languages[a]
                })

                console.log('Seu nome de DEVSAFADÃO é:')
                console.log(`${answers.name} safadão do ${language[0]}!`)
              })
            })
          } else {
            console.log('Você não é um DEVSAFADÃO.')
            console.log(`Mas se fosse, seria: ${answers.name} safadão do ${answers.language}!`)
            console.log('P.S: DEVS SAFADÕES, TEM GITHUB.')
          }
      })
    });

program
	.parse(process.argv)
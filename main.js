#!/usr/bin/env node
'use strict'

const inquirer = require('inquirer')
const fetch = require('node-fetch')
const ora = require('ora')
const spinner = ora({ color: 'yellow', text: 'Carregando ...'})

var questions = require('./questions/safadao.js')

inquirer.prompt(questions)
  .then((answers) => {
    if(answers.hasGitHub) {
      let options = {
        method: 'GET',
        headers: {'User-Agent':'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'}
      }

      let url = `https://api.github.com/users/${answers.username}/repos`

      spinner.text = 'Vasculhando seu GitHub...'
      spinner.start()

      fetch(url, options).then((res) => {
        if (res.status === 404) {
          spinner.stop()
          console.log('Usuário do Github não encontrado.')
          process.exit(1)
        }

        return res.json()
      }).then((repos) => {
          let languages = []

          spinner.text = 'Verificando seus repositórios...'
          repos.map(repo => {
            if(repo.language != null) {
              if(languages[repo.language]) {
                languages[repo.language]++
              } else {
                languages[repo.language] = 1
              }
            }
          })

          spinner.text = 'Ordenando os resultados...'

          let language = Object.keys(languages).sort((a, b) => {
            return languages[b] - languages[a]
          })

          spinner.stop()

          console.log('Seu nome de DEVSAFADÃO é:')
          console.log(`${answers.name} safadão do ${language[0]}!`)
      })
    } else {
      spinner.stop()
      console.log('Você não é um DEVSAFADÃO.')
      console.log(`Mas se fosse, seria: ${answers.name} safadão do ${answers.language}!`)
      console.log('P.S: DEVS SAFADÕES, TEM GITHUB.')
    }
})
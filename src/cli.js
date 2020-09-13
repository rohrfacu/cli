const arg = require('arg');
const inquirer = require('inquirer');
const { createProject } = require('./main');
const parseArgumentsIntoOptions = (rawArgs) => {
    const args = arg(
        {
            '--git': Boolean,
            '--yes': Boolean,
            '--install': Boolean,
            '-g': '--git',
            '-y': '--yes',
            '-i': '--install'
        },
        {
            argv: rawArgs.slice(2),
        }
    )

    return {
        skipPrompts: args['--yes'] || false,
        git: args['--git'] || false,
        template: args._[0],
        runInstall: args['--install'] || false,
    }
}

const promptForMissingOptions = async (options) => {
    const defaultTemplate = 'Javascript';
    if (options.skipPrompts) {
        return {
            ...options,
            template: options.template || defaultTemplate,
        }
    }

    const questions = [];

    if (!options.template) {
        questions.push({
            type: 'list',
            name: 'template',
            message: 'Por favor elegí que template usar',
            choices: ['Javascript', 'TypeScript'],
            default: defaultTemplate,
        })
    }

    if (!options.git) {
        questions.push({
            type: 'confirm',
            name: 'git',
            message: 'Inicializar repo en git?',
            default: false,
        })
    }

    const answers = await inquirer.prompt(questions);
    return {
        ...options,
        template: options.template || answers.template,
        git: options.git || answers.git,
    }
}

const cli = async (params) => {
   let options = parseArgumentsIntoOptions(params);
   options = await promptForMissingOptions(options);
   await createProject(options);
}

module.exports = {
    cli
}
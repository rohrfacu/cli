const chalk = require('chalk');
const fs = require('fs');
const ncp = require('ncp');
const path = require('path');
const { promisify } = require('util');

const access = promisify(fs.access);
const copy = promisify(ncp);

const copyTemplateFiles = async (options) => {
    return copy(options.templateDirectory, options.targetDirectory, {
        clobber: false,
    })
}

const createProject = async (options) => {
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd(),
    }

    console.log('las opciones', options);

    let currentFileUrl = import.meta.url;
    currentFileUrl = currentFileUrl.replace('file:///', '');

    const templateDir = path.resolve(
        currentFileUrl,
        '../../templates',
        options.template.toLowerCase()
    );

    console.log('templatedir', templateDir);

    options.templateDirectory = templateDir;

    try {
        await access(templateDir, fs.constants.R_OK);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }

    console.log("Copiando archivos");
    await copyTemplateFiles(options);

    console.log('%s Proyecto listo', chalk.green.bold('LISTO'));

    return true;
}

module.exports = {
    createProject,
}
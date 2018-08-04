"use strict";
const fs = require('fs');
const project = require('./package.json');
const readline = require('readline');
const { execSync } = require('child_process');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const prompt = async (question, defaultAnswer = "") => {
    return new Promise(resolve => {
        rl.question(`${question}: `, (answer) => {
            if(!answer){
                resolve(defaultAnswer);
            }else{
                resolve(answer);
            }
        })
    });
};

project.name = await prompt('Project Name');
project.version = await prompt('Version (0.0.1', '0.0.1');
project.author = await('Author Name');
project.license = await('License Type (MIT)', 'MIT');

console.log('Install complete! Running `npm build`...');
execSync('npm build');
fs.writeFileSync(`${__dirname}/package.json`, JSON.stringify(project, null, 1));
fs.unlinkSync(`${__dirname}/install.js`);




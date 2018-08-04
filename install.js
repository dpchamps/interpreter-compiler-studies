"use strict";
const fs = require('fs');
const project = require('./package.json');
const readline = require('readline');
const { execSync } = require('child_process');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const licenseFile = 'license.md';
const packageFile = 'package.json';

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

const writeProject = async () => {
    project.name = await prompt('Project Name');
    project.version = await prompt('Version (0.0.1)', '0.0.1');
    project.author = await prompt('Author Name');
    project.license = await prompt('License Type (MIT)', 'MIT');

    fs.writeFileSync(`${__dirname}/package.json`, JSON.stringify(project, null, 1));
    return Promise.resolve();
};

const writeLicense = async () => {
    const licenseName = await prompt('Author this project is licensed under', '');
    const copyrightLine = `Copyright (c) ${(new Date()).getFullYear()} ${licenseName}`;
    const license = fs.readFileSync(`${__dirname}/license.md`, 'utf8').split("\n");

    license[2] = copyrightLine;

    fs.writeFileSync(`${__dirname}/${licenseFile}`, license.join("\n"));
    return Promise.resolve();
};

const cleanUp = () => {
    fs.unlinkSync(`${__dirname}/install.js`);
    fs.unlinkSync(`${__dirname}/readme.md`);
    fs.writeFileSync(`${__dirname}/readme.md`, "");
};

 (async() => {
     try{
         await writeProject();
         await writeLicense();

         console.log('Install complete! Running `npm build`...');

         execSync('npm run build', {stdio:[0,1,2]});
         
         cleanUp();
         
         console.log('Build Finished :D');
         process.exit(0);
     }catch(error){
         console.log('There was an error in the postinstall script D:');
         process.exit(1);
     }
     
})();




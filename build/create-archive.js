const dateFormat = require('dateformat');
const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

const listOfDirectories = ['dist', 'images'];
const listOfFiles = [
  'manifest.json',
  'how-to-use.html',
  'popup.html',
  'tez.html',
];
const projectRootDirectory = path.join(__dirname, '..');
const distDirectoryName = 'dist';
const archive = archiver('zip');
const archiveOutputDirectory = path.join(
  projectRootDirectory,
  'chrome-extension-archive'
);
const now = new Date();
const archiveName = dateFormat(now, 'ddmmyyyy-HHMMss');

if (!fs.existsSync(archiveOutputDirectory)) {
  fs.mkdirSync(archiveOutputDirectory);
}

const output = fs.createWriteStream(
  path.join(archiveOutputDirectory, `${archiveName}.zip`)
);

archive.pipe(output);

addDirectories(listOfDirectories);
addFiles(listOfFiles);

archive.finalize();

output.on('close', function () {
  console.log('Archive created successfully');
});

function addDirectories(listOfDirectories) {
  for (const item of listOfDirectories) {
    archive.directory(path.join(projectRootDirectory, item), item);
  }
}

function addFiles(listOfFiles) {
  for (const item of listOfFiles) {
    archive.file(path.join(projectRootDirectory, item), {
      name: item,
    });
  }
}

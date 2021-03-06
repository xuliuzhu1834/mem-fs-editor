'use strict';

const path = require('path');
const editor = require('..');
const memFs = require('mem-fs');

describe('#copyTpl()', () => {
  let store;
  let fs;

  beforeEach(function () {
    store = memFs.create();
    fs = editor.create(store);
  });

  it('copy file and process contents as underscore template', () => {
    const filepath = path.join(__dirname, 'fixtures/file-tpl.txt');
    const newPath = '/new/path/file.txt';
    fs.copyTpl(filepath, newPath, {name: 'new content'});
    expect(fs.read(newPath)).toBe('new content\n');
  });

  it('allow setting custom template delimiters', function () {
    const filepath = path.join(__dirname, 'fixtures/file-tpl-custom-delimiter.txt');
    const newPath = '/new/path/file.txt';
    fs.copyTpl(filepath, newPath, {name: 'mustache'}, {
      delimiter: '?'
    });
    expect(fs.read(newPath)).toBe('mustache\n');
  });

  it('allow including partials', function () {
    const filepath = path.join(__dirname, 'fixtures/file-tpl-include.txt');
    const newPath = '/new/path/file.txt';
    fs.copyTpl(filepath, newPath);
    expect(fs.read(newPath)).toBe('partial\n\n');
  });

  it('allow including glob options', function () {
    const filenames = [
      path.join(__dirname, 'fixtures/file-tpl-partial.txt'),
      path.join(__dirname, 'fixtures/file-tpl.txt')
    ];
    const copyOptions = {
      globOptions: {
        ignore: filenames[1]
      }
    };
    const newPath = '/new/path';
    fs.copyTpl(filenames, newPath, {}, {}, copyOptions);
    expect(fs.exists(path.join(newPath, 'file-tpl-partial.txt'))).toBeTruthy();
    expect(fs.exists(path.join(newPath, 'file-tpl.txt'))).toBeFalsy();
  });
});

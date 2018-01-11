#!/usr/bin/env node
'use strict';

const
	program = require('commander'),
	colors = require('colors'),
	fs = require('fs'),
	archiver = require('archiver');

var dir		= './',
	lib_path= '//developers.timify.com/widget-library';

program
	.version('1.0.0')
	.usage('<command> [options]');

program
	.command('new <appName>')
	.description('Build new timify app')
	.usage('<appName>')
	.action(function (appName) {

		if (!fs.existsSync(dir + appName)) {
			fs.mkdir(dir + appName, function (err) {
				if (err) {
					return console.error(err);
				}

				fs.mkdir(dir + appName + '/root', function (err) {
					var appHTML = fs.readFileSync('./app/app.html').toString();
					if (err) {
						return console.error(err);
					}

					fs.mkdir(dir + appName + '/root/assets', function (err) {
						if (err) {
							return console.error(err);
						}

						fs.mkdir(dir + appName + '/root/assets/locales', function (err) {
							if (err) {
								return console.error(err);
							}

							fs.writeFile(dir + appName + '/root/assets/locales/en.js',
								fs.readFileSync('./app/locales/en.js'), 'utf8');
						});

						fs.mkdir(dir + appName + '/root/assets/img', function (err) {
							if (err) {
								return console.error(err);
							}
						});

						fs.mkdir(dir + appName + '/root/assets/css', function (err) {
							if (err) {
								return console.error(err);
							}

							fs.writeFile(dir + appName + '/root/assets/css/app.css',
								fs.readFileSync('./app/app.css'), 'utf8');
						});

						fs.mkdir(dir + appName + '/root/assets/js', function (err) {
							if (err) {
								return console.error(err);
							}

							fs.writeFile(dir + appName + '/root/assets/js/app.js',
								fs.readFileSync('./app/app.js'), 'utf8');
						});

					});

					appHTML = appHTML.replace(/%APPNAME%/g, appName);
					appHTML = appHTML.replace(/%LIBRARY%/g, lib_path);

					fs.writeFile(dir + appName + '/root/app.html', appHTML, 'utf8');
				});

				fs.writeFile(dir + appName + '/manifest', '', 'utf8');
			});
		}
	});

program
	.command('pack <appName>')
	.description('Pack chosen app')
	.usage('<appName>')
	.action(function (appName) {

		var output,
			archive = archiver('zip', {
				zlib: { level: 9 }
			}),
			pack = function () {

				if (fs.existsSync(dir + appName + '/dist/' + appName + '.tpkg')) {
					fs.unlinkSync(dir + appName + '/dist/' + appName + '.tpkg');
				}

				output = fs.createWriteStream(dir + appName + '/dist/' + appName + '.tpkg');

				archive.on('error', function (err) {
					throw err;
				});

				archive.on('warning', function (err) {
					if (err.code === 'ENOENT') {
						// log warning
					} else {
						// throw error
						throw err;
					}
				});

				archive.pipe(output);

				archive.glob('./**/*', {
					cwd: process.cwd() + '/' + appName,
					ignore: ['./dist/**']
				}, {});
				archive.finalize();
			};

		if (!fs.existsSync(dir + appName + '/dist/')) {
			return fs.mkdir(dir + appName + '/dist/', function (err) {
				if (err) {
					return console.error(err);
				}

				pack();
			});
		}

		pack();
	});

program.parse(process.argv);
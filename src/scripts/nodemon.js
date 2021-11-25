const nodemon = require('nodemon');

nodemon({
	ignore: ['node_modules'],
	script: 'src/index',
	ext: 'js json',
	verbose: true,
	watch: ['src/**/*.js'],
	env: process.env,
});

nodemon
	.on('restart', files => {
		console.log(`Nodemon restarting because ${files.join(',')} changed.`);
	})
	.on('crash', () => {
		console.log('Nodemon crashed. Waiting for changes to restart.');
	});

// Make sure the process is killed when hitting ctrl + c
process.once('SIGINT', () => {
	nodemon.once('exit', () => {
		console.log('Exiting Nodemon.');
		process.exit();
	});
});
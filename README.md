# saloon
Electronic bartender on Raspberry pi using node.js

## Structure
	/build 	(created on the fly)
	/gulp
	/src
		/client
			/app
			/content
			/test
		/server
			/data
			/routes

## Requirements

- Install Node
	- on OSX install [home brew](http://brew.sh/) and type `brew install node`
	- on Windows install [chocolatey](https://chocolatey.org/) and type `choco install nodejs`
- On OSX you can alleviate the need to run as sudo by [following these instructions](https://github.com/sindresorhus/guides/blob/master/npm-global-without-sudo.md). I highly recommend this step on OSX
- Open terminal
- Type `npm install -g node-inspector bower gulp`

## Installing Node.js and Bower Packages
- Open terminal
- Type `npm install`

## Installing Bower Packages
`npm install` will install these too, but you can do it manually.
- Open terminal
- Type `bower install`

## Running
Runs locally, no database required.

### Dev Builds
The dev build does not optimize the deployed code. It simply runs it in place. You can run a dev build in multiple ways.

####Option 1 - Serve
Type `gulp serve-dev` and browse to `http://localhost:7200`

####Option 2 - Serve and Debug Node
Type `gulp serve-dev-debug` and browse to `http://localhost:7200` for the client and `http://localhost:8080/debug?port-5858` to debug the server.

####Option 3 - Serve and Debug Node Breaking on 1st Line
Type `gulp serve-dev-debug-brk` and browse to `http://localhost:7200` for the client and `http://localhost:8080/debug?port-5858` to debug the server.

### Staging Build
The staging build is an optimized build. Type `gulp serve-stage` and browse to `http://localhost:7200`

The optimizations are performed by the gulp tasks and include the following list. See the `gulpfile.js` for details

- jshint
- preparing Angular's templatecache for html templates
- concat task to bundle css and js, separately
- Angular dependency injection annotations using ngAnnotate
- uglify to minify and mangle javascript
- source maps
- css autoprefixer for vendor prefixes
- minify css
- optimize images
- index.html injection for scripts and links
- deploying all js, css, images, fonts, and index.html

## Testing
Type `gulp test` to run the tests including both unit and midway tests (spins up a server). This will create a watch on the files, with a 5 second delay, to run the tests.

Testing uses karma, mocha, chai, sinon, ngMidwayTester libraries.

### Quick Start
1. Install globally
    `npm install -g node-inspector`

2. Run server, load it in the browser
    `node-debug server/server.js`

    This loads http://localhost:8080/debug?port-5858 with the node code in the Chrome debugger

### Manually Run in One Terminal Tab
Run the server with options, and debug

`node --debug=5858 server/server.js & node-inspector`

Or

`node-inspector & node --debug server/server.js`

 - Note: Debug defaults to 5858

### Manual Run and Break on First Line
Run the server and have it break on the first line of code
    `node-inspector & node --debug-brk server/server.js`

### Run in its own Tab
Or run node-inspector in a separate Terminal tab. You can keep it running and just serve and shutdown your site as needed

### node-inspector with Gulp
Alternative to running node-inspector in its own tab is to use `gulp-shell`

```javascript
gulp.src('', {read: false})
    .pipe(plug.shell(['node-inspector']));
```

#!/usr/bin/env node

var path = require('path'),
spawn = require('child_process').spawn;

function replaceAll(find, replace, str) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
};

function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
}

setTimeout(function() {

    console.log("Compiling html using Harp");

    var harpCompile = spawn('harp',["compile", "server", "publish"]);

    harpCompile.on('close', function (code) {
        if (code == 0) {

            var transform = function(content, filename) {
                console.log("Transforming " + filename);

                content = replaceAll('__RevisionNoGoesHere__', guid(), content);

                require('fs').writeFile(path.resolve(filename), content, function(err) {
                    if (err) throw err;
                    console.log(filename + " saved");
                });
            };

            require('node-dir').readFiles(__dirname + '/publish', {
                match: /.html$/
            }, function(err, content, filename, next) {
                if (err) throw err;
                transform(content, filename);
                next();
            }, function(err, files) {
                if (err) throw err;
                console.log('finished transforming files');
            });
        } else {
             throw new Error("Couldn't compile html using harp");
        }
    });
}, 0);

process.on('uncaughtexceptions', function(e) {
    process.exit(1);
});

process.on('exit', function(code) {
    if (code == 0) {
        console.log("\n*************Static html file generated successfully*************\n");
    }
});
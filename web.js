#!/usr/bin/env node

var path = require('path'),
exec = require('child_process').exec;

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

    exec('harp compile server publish', function(err, stdout, stderr) {
        
        console.log("Html compiled\n\n");
        var version = guid();
        var transform = function(content, filename) {
            console.log("Transforming " + filename);

            content = replaceAll('__RevisionNoGoesHere__', version, content);

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
    });
}, 0);

process.on('uncaughtexceptions', function(e) {
    process.exit(1);
});

process.on('exit', function(code) {
    if (code == 0) {
        console.log("\n*************Site generated successfully*************\n");
    }
});
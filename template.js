/*
 * node-template
 * http://github.com/graphnode/node-template/
 * by Diogo Gomes - MIT Licensed
 *
 * Based off of:
 * - Chad Etzel - http://github.com/jazzychad/template.node.js/
 * - John Resig - http://ejohn.org/blog/javascript-micro-templating/
 */

/*jslint node: true, browser: true, evil: true, regexp: true */

var fs = require('fs');

var template = {
    useCache: true,
    
    cache: {},
    
    create: function (str, data, callback) {
        'use strict';
        
        // Move argument around, data should be an object not a function
        if (typeof (data) === "function") {
            callback = data;
            data = undefined;
        }
        
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn;
        
        if (!/[\t\r\n% ]/.test(str)) {
            if (!callback) {
                fn = this.create(fs.readFileSync(str, { encoding: 'utf8' }), data, callback);
            } else {
                fs.readFile(str, { encoding: 'utf8' }, function (err, contents) {
                    if (err) {
                        throw err;
                    }
                    this.create(contents, data, callback);
                });
                return;
            }
        } else {
            if (this.useCache && this.cache[str]) {
                fn = this.cache[str];
            } else {
                // Generate a reusable function that will serve as a template
                // generator (and which will be cached).
                fn = new Function("obj",
                    "var p=[],print=function(){p.push.apply(p,arguments);};" +
                    "obj=obj||{};" +
                    // Introduce the data as local variables using with(){}
                    "with(obj){p.push('" +

                    // Convert the template into pure JavaScript
                    str.split("'").join("\\'")
                    .split("\n").join("\\n")
                    .replace(/<%([\s\S]*?)%>/mg, function (m, t) { return '<%' + t.split("\\'").join("'").split("\\n").join("\n") + '%>'; })
                    .replace(/<%=(.+?)%>/g, "',$1,'")
                    .split("<%").join("');")
                    .split("%>").join("p.push('") +
                    "');}return p.join('');");

                if (this.useCache) {
                    this.cache[str] = fn;
                }
            }
        }

        // Provide some "basic" currying to the user
        if (callback) {
            callback(data ? fn(data) : fn);
        } else {
            return data ? fn(data) : fn;
        }
    }
};

if (module) {
    module.exports = template;
}
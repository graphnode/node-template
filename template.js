/*
 * node-template
 * http://github.com/graphnode/node-template/
 * by Diogo Gomes - MIT Licensed
 *
 * Based off of:
 * - Chad Etzel - http://github.com/jazzychad/template.node.js/
 * - John Resig - http://ejohn.org/blog/javascript-micro-templating/
 */

/*jslint node: true, browser: true, evil: true, regexp: true, nomen: true */

(function (module) {
    'use strict';
    
    var fs, exports, templateFn;

    if (require) {
        fs = require('fs');
    }
    
    exports = {
        useCache: true,
        cache: {}
    };
    
    
    templateFn = function (str, data, callback) {
        // Move argument around, data should be an object not a function
        if (typeof (data) === "function") {
            callback = data;
            data = undefined;
        }

        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn, functionArgs, functionBody, result;
        
        if (fs && str !== '' && !/[\t\r\n% ]/.test(str)) {
            if (!callback) {
                fn = templateFn(fs.readFileSync(str, 'utf8'), data, callback);
            } else {
                fs.readFile(str, { encoding: 'utf8' }, function (err, contents) {
                    if (err) {
                        throw err;
                    }
                    templateFn(contents, data, callback);
                });
                return;
            }
        } else {
            if (((data && data.cache) || exports.useCache) && exports.cache[str]) {
                fn = exports.cache[str];
            } else {
                functionArgs = "obj";
                functionBody = "var p=[],print=function(){p.push.apply(p,arguments);};" +
                    "obj=obj||{};" +
                    // Introduce the data as local variables using with(){}
                    "with(obj){p.push('" +
                    // Convert the template into pure JavaScript
                    str.split("'").join("\\'")
                    .replace(/\r\n|\n/mg, '\\n')
                    .replace(/<%([\s\S]*?)%>/mg, function (m, t) { return '<%' + t.split("\\'").join("'").split("\\n").join("\n") + '%>'; })
                    .replace(/<%=(.+?)%>/g, "',$1,'")
                    .split("<%").join("');")
                    .split("%>").join("p.push('") +
                    "');}return p.join('');";
                    
                // Generate a reusable function that will serve as a template
                // generator (and which will be cached).
                try {
                    fn = new Function(functionArgs, functionBody);
                } catch (e1) {
                    if (callback) {
                        callback(e1, null);
                        return;
                    } else {
                        throw e1;
                    }
                }
                
                if ((data && data.cache) || exports.useCache) {
                    exports.cache[str] = fn;
                }
            }
        }
        
        // Provide some "basic" currying to the user
        if (callback) {
            result = null;
            try {
                result = data ? fn(data) : fn;
            } catch (e2) {
                callback(e2, null);
                return;
            }
            callback(null, result);
        } else {
            return data ? fn(data) : fn;
        }
    };
    
    exports.render = exports.__express = templateFn;
    
    // Backwards compatibility and semantics.
    exports.create = templateFn;
    
    // Export template engine or inject it into browser window.
    if (module) {
        module.exports = exports;
    } else if (window) {
        window.template = exports;
    }
    
}(module));
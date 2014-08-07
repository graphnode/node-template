/*jslint node: true, nomen: true */
/*global describe: false, it: false */

var assert = require('assert'),
    template = require('../template.js');

template.useCache = false;

describe('node-template', function () {
    'use strict';

    describe('basic inline', function () {
        it('should return "Hello, world."', function () {
            var result = template.create('Hello, <%= name %>.', { name: 'world' });
            assert.equal(result, 'Hello, world.');
        });
    });
    
    describe('basic precompile', function () {
        it('should return "Hello, precompiled world."', function () {
            var tmpl = template.create('Hello, <%= name %>.');
            assert.equal(tmpl({ name: 'precompiled world' }), 'Hello, precompiled world.');
        });
    });
    
    describe('complex inline', function () {
        it('should return "1, 2, 3, START!"', function () {
            var result = template.create('<% for (var i = 1; i <= count; i++) {%><%=i%>, <% } %>START!', { count: 3 });
            assert.equal(result, '1, 2, 3, START!');
        });
    });
    
    describe('complex precompiled', function () {
        it('should return "1, 2, 3, 4, 5, START!"', function () {
            var tmpl = template.create('<% for (var i = 1; i <= count; i++) {%><%=i%>, <% } %>START!');
            assert.equal(tmpl({ count: 5 }), '1, 2, 3, 4, 5, START!');
        });
    });
    
    describe('read template from basic file', function () {
        it('should return "Hello, file. 1, 2, 3, START!"', function () {
            var tmpl = template.create(__dirname + '/basic.html');
            assert.equal(tmpl({ name: 'file', count: 3 }), 'Hello, file. 1, 2, 3, START!');
            
        });
    });
    
    describe('try parsing complex file', function () {
        it('should not throw any error or exception', function () {
            assert.doesNotThrow(function () {
                template.create(__dirname + '/complex.html');
            }, Error);
        });
    });

    describe('errors while parsing templates', function () {
        it('should throw an exception because of bad template', function () {
            assert.throws(function () {
                template.create('<% for (var i = 1; i <=  i++) {%>i%>, <% } %>START!');
            }, Error);
        });
        
        it('should throw an exception because of non-existing var', function () {
            assert.throws(function () {
                template.render('<% for (var i = 1; i <= count; i++) {%><%=i%>, <% } %>START!', {});
            }, Error);
        });

        it('should return callback with error instead of throwing an exception', function () {
            assert.doesNotThrow(function () {
                template.render('<% for (var i = 1; i <= count; i++) {%><%=i%>, <% } %>START!', {}, function (err, result) {
                    assert.notEqual(err, undefined, 'callback didn\'t return error');
                });
            });
        });
    });

    describe('wrong "this" with callback', function () {
        it('should not throw a exception', function () {
            var other = {
                self: 'random object'
            };
            
            template.create.apply(other, ['Hello, <%= name %>.', { name: 'world' }, function (err, html) {
                assert.equal(html, 'Hello, world.');
            }]);
        });
    });

});
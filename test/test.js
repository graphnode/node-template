/*jslint node: true */
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
    
});
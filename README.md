# node-template

Simple templating for [node.js](http://nodejs.org) based on 
John Resig's [JavaScript Micro-Templating](http://ejohn.org/blog/javascript-micro-templating/) and Chad Etzel's [template.node.js](http://github.com/jazzychad/template.node.js/).

## Templates

Templates are just files with special <% %> tags (like PHP or Ruby tags) which will be replaced with passed-in data. 
Templates can also contain javascript code to be expanded.

### Example Template
    <html>
    <body>
     Hello, <%=name>.
    </body>
    </html>

### Example Template with javascript
    <html>
    <body>
    <% for (var i = 0; i < arr.length; i++) { %>
        The value of arr[<%=i%>] is <%=arr[i]%> <br/>
    <% } %>
    </body>
    </html>
    
### Using the print function instead
    <html>
    <body>
    <% for (var i = 0; i < arr.length; i++) {
        print('The value of arr ', i, ' is ', arr[i], ' <br/>');
    } %>
    </body>
    </html>

## Usage

    template.create(str, data, callback)
       Parameters:
          str      - filename of template to load
          data     - object containing data to replace in the template
          callback - optional argument for async coding 
       Returns:
          String of the template file with all code/variables replaced with data object contents
       Example:
          var foo = template.tmpl("./hello.template", {name:"Chad"});
          console.log(foo);


    template.create(str, callback)
       Parameters:
          str      - filename of template to load
          callback - optional argument for async coding
       Returns:
          Pre-compiled/generated function to which you can pass a data object
       Example:
          var bar = template.tmpl("./hello.template");
          var baz = bar({name:"Bob"});
          console.log(baz);

## Other Info

Templates are cached in the "cache" property of the module. Change the "useCache" property to false if you don't want to use the cache.
They are cached with the template as the key, please avoid caching huge templates and instead pre-compile them.
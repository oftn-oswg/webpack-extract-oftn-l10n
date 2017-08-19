const fs = require('fs');

function ExtractStringsPlugin(options) {
  this.variable = options.variable || 'R';
  this.output = typeof options.output === 'string' ? options.output : false;
  this.regex = new RegExp(`^${this.variable}\\.(\\w+)\\s*=\\s*(.*)$`);
  this.strings_predefined = {};
  this.strings = [];
}

ExtractStringsPlugin.prototype.apply = function (compiler) {
  compiler.plugin('compilation', (compilation, params) => {
    params.normalModuleFactory.plugin('parser', (parser) => {

      parser.plugin('program', (expr) => {

        // Scan comments for R.<identifier> = "<value>"
        const comments = parser.getComments(expr.range).map((comment) => comment.value)
        for (const comment of comments) {
          const trim = comment.trim();
          const matches = trim.match(this.regex);
          if (matches) {
            const string = matches[1];
            const string_default_json = matches[2];
            try {
              this.strings_predefined[string] = JSON.parse(string_default_json)
            } catch (e) {
              console.warn(new SyntaxError("Could not parse comment as string literal: " + matches[2]));
            }
          }
        }

        // Look for R.<identifier>
        const self = this;
        (function traverse(expr) {
          if (typeof expr === 'object' && expr) {
            if (expr.type === 'MemberExpression') {
              if (expr.object.name === self.variable) {
                if (expr.property.type === 'Identifier') {
                  self.strings.push(expr.property.name);
                }
              }
            }
            for (const key in expr) {
              traverse(expr[key]);
            }
          }
        }(expr));
      })
    });
  });

  // Write data to output
  compiler.plugin('done', () => {
    for (const string of this.strings) {
      if (typeof this.strings_predefined[string] === 'undefined') {
        this.strings_predefined[string] = `#${string}`;
      }
    }
    if (this.output) {
      const sorted_keys = Object.keys(this.strings_predefined).sort();
      sorted_keys.push('')
      fs.writeFileSync(this.output, JSON.stringify({ "": this.strings_predefined }, sorted_keys, '\t'));
    }
  })
};

module.exports = ExtractStringsPlugin;
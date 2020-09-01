
let fs = require('fs')

const ClosureCompiler = require('google-closure-compiler').jsCompiler;

console.log(ClosureCompiler.CONTRIB_PATH); // absolute path to the contrib folder which contains externs

const closureCompiler = new ClosureCompiler({
  compilation_level: 'ADVANCED',
  env: "BROWSER",
  js: ["programs.js",'src/os.js'],
  js_output_file: 'out.js',
  externs: ["src/extern.js"],
  define: "ENABLE_DEBUG=false",
  language_in: 'ECMASCRIPT_2018',
  language_out: 'ECMASCRIPT_2019',
  jscomp_off: "checkVars",
  formatting: 'PRETTY_PRINT',
  warning_level: "QUIET",
  generate_exports: ["true"],
  // warning_level: "VERBOSE",
  // debug: true
});

const compilerProcess = closureCompiler.run([{
  sourceMap: null // optional input source map
}], (exitCode, stdOut, stdErr) => {
  console.log(exitCode)
  console.log(stdErr)
  //compilation complete
});
// console.log(compilerProcess)

let src = compilerProcess.compiledFiles[0].src
console.log(src.length)
fs.writeFileSync("out.js", src)
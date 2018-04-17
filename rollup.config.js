const globals = {
  'apollo-link': 'apolloLink.core',
};

export default {
  input: 'build/index.js',
  output: {
    file: 'build/bundle.umd.js',
    format: 'umd',
    exports: 'named',
    globals,
  },
  name: 'apolloLink.maxage',
  exports: 'named',
  sourcemap: true,
  external: Object.keys(globals),
  onwarn,
};

function onwarn(message) {
  const suppressed = ['UNRESOLVED_IMPORT', 'THIS_IS_UNDEFINED'];

  if (!suppressed.find(code => message.code === code)) {
    return console.warn(message.message);
  }
}
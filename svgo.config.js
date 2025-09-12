module.exports = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          removeTitle: false,
        },
      },
    },
    'removeXMLNS',
    'removeComments', 
    'removeMetadata',
    'removeDesc',
    'removeEditorsNSData',
    'removeEmptyAttrs',
    'removeHiddenElems',
    'removeEmptyText',
    'removeEmptyContainers',
    'cleanupIds',
    'minifyStyles',
    'convertColors',
  ],
};
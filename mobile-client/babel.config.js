module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          api: './src/api',
          assets: './src/assets',
          components: './src/components',
          navigation: './src/navigation',
          reduxStore: './src/reduxStore',
          context: './src/context',
          screens: './src/screens',
          socket: './src/socket',
          variables: './src/variables',
          utils: './src/utils'
        },
      },
    ],
  ],
};
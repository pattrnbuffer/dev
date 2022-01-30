{
  preset: 'jest-expo',
roots: ['<rootDir>'],
moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx'],
testPathIgnorePatterns: ['<rootDir>[/\\\\](node_modules)[/\\\\]'],
transformIgnorePatterns: [
  '[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$',
  'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
],
moduleNameMapper: {
  '\\.(otf|ttf|eot|svg|png|gif)$': '<rootDir>/test/__mocks__/fileMock.js',
},
watchPlugins: [
  'jest-watch-typeahead/filename',
  'jest-watch-typeahead/testname',
],
}

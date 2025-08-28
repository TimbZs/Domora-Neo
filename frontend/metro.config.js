const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Optimize file watching to prevent ENOENT errors
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Exclude problematic directories and file patterns that cause ENOENT errors
config.resolver.blacklistRE = /(__tests__|android|ios|build|dist|\.git|node_modules\/.*\/(android|ios|windows|macos|__tests__|\.git))$/;

// Reduce file watching scope to prevent unknown file access errors
config.watchFolders = [__dirname];

// Optimize resolver to handle missing files gracefully
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx', 'json', 'mjs'];

// Reduce the number of workers to decrease resource usage
config.maxWorkers = 2;

// Add better error handling for missing assets
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

module.exports = config;

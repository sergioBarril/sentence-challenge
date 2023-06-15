const config = {
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
  coveragePathIgnorePatterns: [
    "node_modules",
    "coverage",
    "tests",
    "config",
    "src/app.js",
    "src/views",
  ],
};

export default config;

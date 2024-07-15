// build: changes affecting build systems or external dependencies
// ci: updating configuration files for continuous integration and deployment services
// chore: updating grunt tasks etc.; no production code change
// docs: documentation-only changes
// feat: a new feature
// fix: a bug fix
// perf: a code change that improves performance
// refactor: a code change that neither fixes a bug nor adds a feature
// style: changes that do not affect the meaning of the code (white-space, formatting, missing semicolons, etc.)
// test: adding missing tests or correcting existing tests

module.exports = {
  extends: ["@commitlint/config-conventional"],
};

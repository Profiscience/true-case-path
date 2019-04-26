# Change Log

# 2.0.0 (2019-04-26)

Rewrite, transfer to Profiscience GitHub org, set up CI

### BREAKING CHANGES

- Use named exports instead of exporting sync func by default (was 'module.exports = trueCasePathSync`, now `module.exports = { trueCasePath, trueCasePathSync }`)
- If relying on (undocumented) glob options, those will no longer work
- Drop support for Node <=6

### Features

- Async version of function
- TypeScript definitions

### Bug Fixes

- **Windows:** [Drive letters](https://github.com/barsh/true-case-path/issues/3)
- **Windows:** [Special characters in file path](https://github.com/barsh/true-case-path/issues/5)
# true-case-path

![Travis (.com)](https://img.shields.io/travis/com/Profiscience/true-case-path.svg)

> Given a possibly case-variant version of an existing filesystem path, returns the absolute, case-exact, normalized version as stored in the filesystem.

## Usage

```typescript
const { trueCasePath, trueCasePathSync } = require('true-case-path')

trueCasePath(<fileSystemPath>)
    .then((caseCorrectPath) => {
        // ...
    })

const caseCorrectPath = trueCasePathSync(<fileSystemPath>)
```

> **NOTE**: If no matching path exists, an error with be thrown.

## Platforms

Windows, OSX, and Linux

## Examples

```typescript
const { trueCasePathSync } = require('true-case-path')

trueCasePathSync('/users/guest') // OSX: -> '/Users/Guest'

trueCasePathSync('c:\\users\\all users') // Windows: -> 'c:\Users\All Users'
```

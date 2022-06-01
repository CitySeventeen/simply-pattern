# simply-pattern
[![Test][test-pass-img]][test-pass-url]
[![Commit Number][commit-number-img]][commit-number-url]

Create and use pattern without knowledge. The purpose is to bring the javascript design pattern closer to a real OO design pattern.
# Index
- [Injection Pattern](#injection-pattern)

# Injection pattern
injection(`entity`, `where_inject` [, `...dependencies`])
- `entity` \<function\> | \<object\>
- `where_inject` \<object\> | \<function\> if `dependencies` is present
- `dependencies` \[\<any\>\]
eg
```js
const {injection} = require('simply-pattern')
const performsCallback = function(callback, ...number){return callback(...number)}

// example with sum callback
const sum = (a, b) => {return a+b}
const where_inject_sum = {apply(...args){return [sum, ...args]}}

const entity_with_dep_injected_sum = injection(performsCallback, where_inject)
console.log(entity_with_dep_injected(2,3)) // = 5
//example with multiplication callback
const mult = (a, b) => {return a*b}
const where_inject_multiplication = {apply(...args){return [mult, ...args]}}

const entity_with_dep_injected_multiplication = injection(performsCallback, where_inject)
console.log(entity_with_dep_injected(2,3)) // = 6
```

### where_inject as a function
It must to be return an object like previously.
```js
const where_inject = function(...dep){
          return {apply(...args){return [dep[0], dep[1], ...args}}
}
const entity_with_dep_injected = injection(entity, where_inject, depA, depB)

// or, once again
const where_inject = function(dep){
          return {apply(...args){return dep.dependencyA, ...args}}
}
const entity_with_dep_injected = injection(entity, where_inject, {dependencyA: /* any */})
```



[test-pass-img]: https://github.com/CitySeventeen/simply-pattern/workflows/Node.js%20CI/badge.svg
[test-pass-url]: https://github.com/CitySeventeen/simply-pattern/actions/workflows/node.js.yml

[commit-number-img]: https://img.shields.io/github/commit-activity/m/CitySeventeen/simply-pattern
[commit-number-url]: https://github.com/CitySeventeen/simply-pattern/commits/main



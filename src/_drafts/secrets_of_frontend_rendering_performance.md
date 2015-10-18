- Performance Scenarios
  - Initial render vs. Hot Updates
  - Replacing entire dataset vs. mutating properties
  - High binding density vs. Low binding density

- Optimizability
  - Angular: track-by, digest cycle is the root of all evil
  - React: should component update or Immutable Data
    - http://jlongster.com/Using-Immutable-Data-Structures-in-JavaScript
  - Vue: track-by, avoid replacing huge amount of data

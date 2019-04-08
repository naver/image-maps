# ImageMaps

## ?

- Compatibility fix: Add `@babel/polyfill` to demo (since
    Babelification may still require some polyfills
    be added for the sake of some older browsers)
- npm: Further devDeps updates (non-major version changes)

## 1.0.0

- Fix: Reference to undefined `shapetype` -> `shapeType`
- Fix: Avoid error in `onMouseMove` if `coords` is false
- Fix: Grammar nit in thrown error
- Breaking enhancement: ES6 Modules (changes script path)
- Enhancement: Avoid zoom if less than 0 or NaN
- Update: Save copies of no-longer-cross-origin-accessible images locally;
    use npm jquery
- Accessibility: Add more color contrast to Github ribbon; image alt text;
    use labels, visible colors, main role, fieldset/legend group, visible
    link text
- Refactoring: Use ES6
- Refactoring: Change `getCoordsByRatio` to class method since does
  not require `this`
- Linting (ESLint): Add eslint-config-ash-nazg/sauron; line breaks, avoid
  now redundant radix to `parseInt`, prefer `const`/`let`; indicate polyfills
  for sake of eslint-plugin-compat (though `Array.isArray()` is made
  available by @babel/polyfill).
- Docs: Add JSDoc, CHANGES; integrate demo, adding external files and
  making local
- License: Rename file to add ".txt" extension and to reflect license type
- npm: Add `package.json`/`package-lock.json`; add `eslint`, `start`,
    `open`/`open-docs`, `docs`, `rollup`, `prepublishOnly` scripts

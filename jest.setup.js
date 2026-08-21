import '@testing-library/jest-dom';

// Next.js server compatibility polyfills for JSDOM/Node environment in Jest
if (typeof global.Request === 'undefined') {
  global.Request = class Request {};
}
if (typeof global.Response === 'undefined') {
  global.Response = class Response {};
}

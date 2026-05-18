const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        include: ['app/js/**/*.test.js'],
    },
});

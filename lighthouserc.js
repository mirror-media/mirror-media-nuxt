module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/story/test-story-slug'],
      startServerCommand: 'npm run start',
      settings: {
        preset: 'desktop',
        chromeFlags: '--no-sandbox',
        throttling: {
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.6 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'categories:pwa': ['error', { minScore: 0 }],
      },
    },
  },
}

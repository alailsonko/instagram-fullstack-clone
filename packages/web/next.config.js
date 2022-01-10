module.exports = {
    // Target must be serverless
    target: "serverless",
    experimental: {
      concurrentFeatures: true,
      serverComponents: true,
    },
  };
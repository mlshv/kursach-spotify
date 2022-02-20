const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api/accounts",
    createProxyMiddleware({
      target: "https://accounts.spotify.com",
      changeOrigin: true,
      pathRewrite: {
        "^/api/accounts": "/api" // edit base path
      }
    })
  );
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://api.spotify.com",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/" // remove base path
      }
    })
  );
};

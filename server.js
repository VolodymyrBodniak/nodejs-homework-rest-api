const app = require("./app");
const setupMongoConnection = require("./decorators/setupMongoConnection");

setupMongoConnection().then(() =>
  app.listen(3000, async () => {
    console.log("Server running. Use our API on port: 3000");
  })
);

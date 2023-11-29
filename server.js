const app = require("./app");
const setupMongoConnection = require("./decorators/setupMongoConnection");

// app.listen(3000, () => {
//   console.log("Server running. Use our API on port: 3000")
// })
setupMongoConnection().then(() =>
  app.listen(3000, async () => {
    console.log("Server running. Use our API on port: 3000");
  })
);

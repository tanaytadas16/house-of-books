const bookRoutes = require("./books");
const userRoutes = require("./users");

const constructorMethod = (app) => {
  app.use("/books", bookRoutes);
  app.use("/user", userRoutes);

  app.use("*", (req, res) => {
    res.status(404).json("Error: Route not found");
  });
};

module.exports = constructorMethod;

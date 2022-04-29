const bookRoutes = require("./books");

const constructorMethod = (app) => {
    app.use("/books", bookRoutes);
    app.use("*", (req, res) => {
        res.status(404).json("Error: Route not found");
    });
};

module.exports = constructorMethod;

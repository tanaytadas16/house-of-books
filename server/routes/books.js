const express = require("express");
const router = express.Router();

function validateStringParams(param, paramName) {
    if (!param) {
        throw `No ${paramName} entered`;
    } else if (typeof param !== "string") {
        throw ` Argument ${param} entered is not a string ${paramName}`;
    } else if (param.length === 0) {
        throw ` No ${paramName} entered`;
    } else if (!param.trim()) {
        throw ` Empty spaces entered to ${paramName}`;
    }
}

function validateNumber(param, paramName) {
    element = parseInt(param);
    if (element !== 0 && (!element || typeof element !== "number")) {
        throw `Argument ${param} entered is not a numeric ${paramName}`;
    }
}
router.get("/", async (req, res) => {
    try {
        let testJson = "House of books";
        res.status(200).json(testJson);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

router.get("/:id", async (req, res) => {
    try {
        validateStringParams(req.params.id, "Book id");
        validateNumber(req.params.id, "Book id");
    } catch (e) {
        res.status(400).json({error: e});
        return;
    }
    try {
        res.status(200).json();
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

module.exports = router;

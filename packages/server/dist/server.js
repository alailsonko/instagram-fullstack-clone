"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = express_1.default();
app.get("/", function (req, res) {
    return res.status(200).json({ message: "hello LUDKA 💘 " });
});
var PORT = process.env.PORT || 3333;
app.listen(PORT, function () {
    console.log("listening on port 3333");
});
//# sourceMappingURL=server.js.map
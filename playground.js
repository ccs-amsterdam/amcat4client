"use strict";
exports.__esModule = true;
var zod_1 = require("zod");
var s = zod_1.z.object({
    x: zod_1.z.string(),
    y: zod_1.z.object({
        a: zod_1.z.string(),
        b: zod_1.z.number()
    })
});
var shape = s.shape;
function recursiveForm(shape, level) {
    if (level === void 0) { level = 1; }
    for (var _i = 0, _a = Object.entries(shape); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (value instanceof zod_1.z.ZodString) {
            console.log("   ".repeat(level - 1) + key, "is a string");
        }
        if (value instanceof zod_1.z.ZodNumber) {
            console.log("   ".repeat(level - 1) + key, "is a number");
        }
        if (value instanceof zod_1.z.ZodObject) {
            console.log("   ".repeat(level - 1) + key, "is an object");
            recursiveForm(value.shape, level + 1);
        }
    }
}
console.log(recursiveForm(shape));

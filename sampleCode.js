"use strict";
var Omg = /** @class */ (function () {
    function Omg() {
    }
    return Omg;
}());
function Injectable() {
    return function (constructor) {
        Object.seal(constructor);
        Object.seal(constructor.prototype);
    };
}
//# sourceMappingURL=sampleCode.js.map
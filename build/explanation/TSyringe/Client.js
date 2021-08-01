"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
// Client.ts
var tsyringe_1 = require("tsyringe");
var Client = /** @class */ (function () {
    // We would like to be able to omit the @inject(string) call here, and use the type to refer to the token
    // we create behind-the-scenes
    function Client(/* @inject("SuperService")  */ service) {
        this.service = service;
    }
    Client = __decorate([
        tsyringe_1.injectable()
    ], Client);
    return Client;
}());
exports.Client = Client;
//# sourceMappingURL=Client.js.map
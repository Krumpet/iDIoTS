"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// main.ts
require("reflect-metadata");
var Client_1 = require("./Client");
var TestService_1 = require("./TestService");
var tsyringe_1 = require("tsyringe");
tsyringe_1.container.register("SuperService", {
    useClass: TestService_1.TestService
});
// We would like (maybe?) to do this, and use the generic parameter to refer to the token we will create behind-the-scenes
// container.register<SuperService>({useClass: TestService});
var client = tsyringe_1.container.resolve(Client_1.Client);
// client's dependencies will have been resolved
//# sourceMappingURL=main.js.map
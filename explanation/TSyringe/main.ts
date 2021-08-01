// main.ts
import "reflect-metadata";
import { Client } from "./Client";
import { TestService } from "./TestService";
import { container } from "tsyringe";
import { SuperService } from "./SuperService";

container.register("SuperService", {
  useClass: TestService
});

// We would like (maybe?) to do this, and use the generic parameter to refer to the token we will create behind-the-scenes
// container.register<SuperService>({useClass: TestService});

const client = container.resolve(Client);
// client's dependencies will have been resolved
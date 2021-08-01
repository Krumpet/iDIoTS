// Client.ts
import {injectable, inject} from "tsyringe";
import { SuperService } from "./SuperService";

@injectable()
export class Client {
  // We would like to be able to omit the @inject(string) call here, and use the type to refer to the token
  // we create behind-the-scenes
  constructor(/* @inject("SuperService")  */private service: SuperService) {}
}
import { NearBindgen, view } from "near-sdk-js";

@NearBindgen({})
class MyContract{
    message = 'Hello World';

    @view({})
    getGreeting() {
        return this.message;
    }

}
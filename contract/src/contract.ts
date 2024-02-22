import { NearBindgen, near, call, view } from 'near-sdk-js';

@NearBindgen({})
    class HelloNear{
        greeting: string = "Hello"

        @view({})
        get_greeting():string {
            return this.greeting;
        }

        @call({})
        set_greeting({ message }: {message:string}){
            this.greeting = message;
            near.log(`Record a greeting in the block, ${message}`)
        }
    }
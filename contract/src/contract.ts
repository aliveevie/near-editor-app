import { NearBindgen, near, call, view } from 'near-sdk-js';
  // Write Your Smart Contract Here
  
  @NearBindgen({})
  class HelloNear{
      greeting: string;

      @view({})
      get_greeting():string{
        return this.greeting;
      }

      @call({})
      set_greeting({ message } : { message:string }){
        this.greeting = message;
        near.log(`You saved a message in the blockchain ${message}`)
      }
  }
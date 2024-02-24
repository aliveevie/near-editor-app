import { NearBindgen, near, call, view } from 'near-sdk-js';
  // Write Your Smart Contract in Typescript please
  // This editor accept only Typescript
  // Dont Worry about the import error
  // Just build your contract

  @NearBindgen({})
  class Hello{
      greeting:string = "Hello";

      @view({})
      get_greeting():string{
        return this.greeting
      }

      @call({})
      set_greeting({ message } : { message }):void{
          this.greeting = message;
          near.log(`You saved a message in the near blockchain ${message}`)
      }
  }
  
  
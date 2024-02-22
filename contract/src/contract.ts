import { NearBindgen, near, call, view } from 'near-sdk-js';
  // Write Your Smart Contract Here

  @NearBindgen({})
  class Hello{
    greeting:string = 'Hello'

    @view({})
    get_greeting():string {
      return this.greeting;
    }

    @call({})
    set_greeting({ message } : { message: string}) :void {
      this.greeting = message;
      near.log("You saved they message in the blockchain " + message)
    }
  }
  
  
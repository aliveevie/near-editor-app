import { NearBindgen, view, call, near, Vector } from "near-sdk-js";


@NearBindgen({})
class Storage{
        data:Vector = new Vector('data-id');
        points = 0;

        @view
        view_data(){
            return this.data.toArray()
        }
        
        @call
        get_data({transaction_id}:{transaction_id:string}){
            const account_id = near.predecessorAccountId();
            const contract_name = account_id;
            this.points += 1;
            this.data.push({account_id:account_id, contract_name:contract_name, transaction_id:transaction_id})
            near.log(`Data Insersation Was Successfull!`) 
        }

        @view
        view_accountDetails(){
            const account_id = near.predecessorAccountId();
            // View Data data for this account only
            const accountData = new Vector('d');
            for(let i = 0; i < this.data.length; i++){
                if(this.data[i].account_id == account_id){
                    accountData.push(this.data[i])
                }
            }

            return accountData.toArray();
        }

}
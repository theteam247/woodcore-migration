import {SERVICE_URL} from '../config'
import axios,{AxiosResponse} from "axios";
import MarkerOutput from './markeroutput'
import transactionoutput from "@/openassets/transactionoutput";
import {crypto} from 'bitcoinjs-lib'
import {UNCOLORED ,MARKER_OUTPUT,ISSUANCE,TRANSFER,reverseMap} from './OutputType'
type _vincoinbase={
    coinbase:string,
    sequence:number,

}
type _scriptSig={
    asm:string,
    hex:string,
}
type _vinnormal={
    scriptSig:_scriptSig,
    sequence:number,
    txid:string,
    vout:number,
    coinbase?:string,

}
export type vin= _vinnormal;

export type _scriptPubKey={
    addresses:string[] | undefined,
    asm:string,
    hex:string,
    reqSigs:number | undefined,
    type:string,

}
type vout={
    n:number,
    scriptPubKey:_scriptPubKey,
    value:number,
}
export type transaction_result={
    blockhash:string,
    blocktime:number,
    confirmations:number,
    hash:string,
    hex:string,
    locktime:number,
    size:number,
    txid:string,
    version:number,
    vin:vin[],
    vout:vout[],
    vsize:number,
    weight:number
}

type _error={
    code:number,
    message:string
}
type transactionresponse={
    error:_error | null,
    id:number,
    result:transaction_result
}

class ColoringEngine {
    static cache:Map<string,transaction_result>=new Map<string,transaction_result>();
    static async getprivkeys(addresses:string[]):Promise<Map<string,string>>{
        let tmp=new Map<string,string>();
        for (let address of addresses){
            const id=new Date().getTime()+Math.floor(Math.random()*1000000);
            const postdata={'version':1.1,method:'dumpprivkey','params':[address],'id':id};
            await axios.post(SERVICE_URL,postdata).then(ret=>{tmp.set(address,ret.data.result)});

        }
        return tmp;
    }
     static async get_transaction(txid:string):Promise<transaction_result>{
        let c=this.cache.get(txid);
        if(c) return c;
        const id=new Date().getTime()+Math.floor(Math.random()*1000000);
        const postdata={'version':1.1,method:'getrawtransaction','params':[txid,1],'id':id};
        return await axios.post(SERVICE_URL,postdata).then((ret:AxiosResponse<transactionresponse>)=>{
            const {data}=ret;

            if(this.cache.size>6000){
                let tmp=this.cache.keys().next();
                if(tmp.value){
                    this.cache.delete(tmp.value);
                }
            }
            this.cache.set(txid,data.result);
            return data.result;
        }).catch(error=>{

            return error.response.data.error.message;
        });


    }
    static async get_output(txid: string, output_index: number):Promise<transactionoutput>{

        const transaction=await this.get_transaction(txid);
        console.log('gettransaction:',transaction);
        if (typeof transaction=="string"){
            let tm:_scriptPubKey={asm:'',hex:'',type:'',addresses:undefined,reqSigs:undefined}
            return new transactionoutput(-1,tm);
        }
        let colored_outputs=await this.color_transaction(transaction)
        console.log('colocre_output:',colored_outputs);
        return colored_outputs[output_index]
    }
    // @ts-ignore
    static async color_transaction(transaction:transaction_result):transactionoutput[]{


        var makeUncoloredResponse = function (tx:transaction_result) {
            var outs:transactionoutput[] = [];
            tx.vout.forEach(function (o) {
                outs.push(new transactionoutput(o.value,o.scriptPubKey));
            });
            return outs;
        };
        // @ts-ignore
        if(transaction.vin.length==1 && transaction.vin[0]?.coinbase){
            return makeUncoloredResponse(transaction)
        }
         //transaction.vout.forEach((output,index)=>{
        let ouputi=0;
         for(let output of transaction.vout){
             let marker_output_payload = MarkerOutput.parse_script(Buffer.from(output.scriptPubKey.hex,'hex'))
             console.log('marker_outpl:',marker_output_payload)
             if(marker_output_payload){
                 let marker_output=MarkerOutput.deserialize_payload(marker_output_payload as Buffer)
                 if (marker_output){
                     let inputs:transactionoutput[]=[];
                     for (let input of transaction.vin){
                         inputs.push(await this.get_output(input.txid,input.vout))
                     }
                     let asset_ids:transactionoutput[]=[];//this._compute_asset_ids(inputs,index,transaction.vout,marker_output.asset_quantities)
                     // @ts-ignore
                     asset_ids=this._computeAssetIds(inputs,ouputi,transaction.vout,marker_output.asset_quantities,marker_output.metadata)
                     if (asset_ids)
                     return asset_ids;
                 }
             }
             ouputi++;
         }

        return makeUncoloredResponse(transaction)

    }

    static _computeAssetIds(inputs:transactionoutput[], markerOutputIndex:number, outputs:vout[], assetQuantities:number[],metadata:Buffer) {

        let result = [], assetId, issuanceAssetId, outputAssetQuantity, curInput, inputUnitsLeft, outputUnitsLeft, progress, i;

        // If there are more items in the asset quantities list than outputs in
        // the transaction (excluding the marker output), the marker output is
        // deemed invalid
        if (assetQuantities.length > outputs.length - 1) {
            return false;
        }

        // If there is no input in the transaction, the marker output is always invalid
        if (inputs.length == 0) {
            return false;
        }

        // Add the issuance outputs
        issuanceAssetId = this.hashScript(inputs[0].script);
        for (i = 0; i < markerOutputIndex; i++) {
            if (i < assetQuantities.length && assetQuantities[i] > 0) {
                result.push(new transactionoutput(
                    outputs[i].value,
                    outputs[i].scriptPubKey,
                    issuanceAssetId,
                    assetQuantities[i],
                    ISSUANCE,
                    metadata.toString('utf-8')

                ));
            } else {
                result.push(new transactionoutput(
                    outputs[i].value,
                    outputs[i].scriptPubKey,
                    -1,
                    0,
                    ISSUANCE));
            }
        }

        // Add the marker output
        result.push(new transactionoutput(
            outputs[markerOutputIndex].value,
            outputs[markerOutputIndex].scriptPubKey,
            -1,
            0,
            MARKER_OUTPUT));

        // Add the transfer outputs
        for (i = markerOutputIndex + 1; i < outputs.length; i++) {

            if (i <= assetQuantities.length) {
                outputAssetQuantity = assetQuantities[i-1];
            } else {
                outputAssetQuantity = 0;
            }

            outputUnitsLeft = outputAssetQuantity;
            assetId = null;

            curInput = 0;
            assetId  = (inputs[curInput]) ? inputs[curInput].assetId : null;
            inputUnitsLeft = (inputs[curInput]) ? ((null == inputs[curInput].assetQuantity) ? 0 : inputs[curInput].assetQuantity) : 0;

            while (outputUnitsLeft > 0) {
                // Move to the next input if the current one is depleted
                if (inputUnitsLeft == 0) {
                    curInput++;

                    // If there are less asset units available than in the outputs
                    // the marker output is considered invalid
                    if (!inputs[curInput]) {
                        return false;
                        // Otherwise, use the assetQuantity associated with the current input
                    } else {
                        inputUnitsLeft = (null == inputs[curInput].assetQuantity) ? 0 : inputs[curInput].assetQuantity;
                    }
                }

                // If the current input is colored, assign its asset id to the
                // current output
                if (inputs[curInput].assetId != null) {
                    progress = Math.min(inputUnitsLeft, outputUnitsLeft);
                    outputUnitsLeft -= progress;
                    inputUnitsLeft  -= progress;

                    if (assetId == null) {
                        // This is the first input to map to this output
                        assetId = inputs[curInput].assetId;
                    } else if (assetId!=inputs[curInput].assetId) {
                        // Another different asset ID has already been assigned to
                        // that output. The marker output is considered invalid
                        return false;
                    }
                }
            }

            result.push(new transactionoutput(
                outputs[i].value,
                outputs[i].scriptPubKey,
                (outputAssetQuantity > 0) ? (assetId?assetId:-1 ) : -1,
                (outputAssetQuantity > 0) ? outputAssetQuantity :0,
                TRANSFER));

        }

        return result;
    }
   static hashScript(data:_scriptPubKey) :number{

        return crypto.hash160(Buffer.from(data.hex,'hex')).readUInt32BE(0);;

    }


}

export default ColoringEngine;
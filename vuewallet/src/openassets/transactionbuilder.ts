import {SERVICE_URL} from '../config'

import MarkerOutput from "@/openassets/markeroutput";
import {transaction_result,vin} from './coloringengine'
import CE from './coloringengine'
import axios, {AxiosResponse} from "axios";



export type uxto={
    txid:string,
    vout:number,
    address:string,
    label:string,
    redeemScript:string,
    scriptPubKey:string,
    amount:number,
    confirmations:number,
    spendable:boolean,
    solvable:string,
    safe:boolean,
    assetid?:number,
    assetamount?:number
}

type feetype= number;
export type issueparam={
    uxto:uxto[],
    changescript:string,
    toscript:string,
    walletname:string,
    asset_quantities:number[],
    metadata:Buffer,
}

class TransactionBuilder {
    private cache:Map<string,uxto[]>
    constructor(private dust_amount: number=1,private unspentcache:uxto[]=[]) {
        this.cache=new Map<string,uxto[]>();
    }
    // @ts-ignore
    async _listunspent(param):Promise<uxto[]>{
        let POSTURL:string;
        if(param.walletname)
             POSTURL=SERVICE_URL+'/wallet/'+param.walletname;
        else
            POSTURL=SERVICE_URL
        // if(this.cache.has(POSTURL))
        //     return this.cache.get(POSTURL)
        const id1=new Date().getTime()+Math.floor(Math.random()*1000000);
        const postdata1={'version':1.1,method:'listunspent','params':[0,99999],'id':id1};
        let uxtoresult=await axios.post(POSTURL,postdata1);

        for(let tmpitem of uxtoresult.data.result){
            let tmptp=await CE.get_output(tmpitem.txid,tmpitem.vout);
            tmpitem['assetid']=tmptp.assetId
            tmpitem['assetamount']=tmptp.assetQuantity
        }
        console.log('this is uxto:',uxtoresult.data.result);
       // this.cache.set(POSTURL,uxtoresult.data.result);
        return uxtoresult.data.result;
    }
    async send_assets(param:{payto:string,changeto:string,amount:number,fee:feetype,assetid:number,walletname:string,metadata:Buffer}){
            console.log('param::',param);
            let POSTURL:string;
            if(param.walletname)
                POSTURL=SERVICE_URL+'/wallet/'+param.walletname;
            else
                POSTURL=SERVICE_URL


            let inputs=[];
            let outputs=[];
            let asset_quantities = []
            let myuxto:uxto[]=await this._listunspent(param);
            let colored_outputs=this._collect_colored_outputs(myuxto,param.assetid,param.amount);
            inputs=colored_outputs.result;
            let tmp={};
        // @ts-ignore
            tmp[param.payto]=this.dust_amount;
            outputs.push(tmp);
            asset_quantities.push(param.amount);
        let leftbtc=colored_outputs.result.reduce((s,c)=>{return s+c.amount},0)-this.dust_amount;
        if(leftbtc<param.fee+this.dust_amount){
            let uncolored_outputs=this._collectUncoloredOutputs(myuxto,param.fee-leftbtc);
            inputs=inputs.concat(uncolored_outputs.outputs);
            leftbtc+=uncolored_outputs.totalAmount;
        }
        let change=leftbtc-param.fee;
            if (colored_outputs.total_amount>param.amount && change>=0){
                let tmp2={}
                // @ts-ignore
                tmp2[param.changeto]=change;

                outputs.push(tmp2);
                asset_quantities.push(colored_outputs.total_amount-param.amount)
            }else if(change>0){
                let tmp3={}
                // @ts-ignore
                tmp3[param.changeto]=change;
                outputs.push(tmp3);
            }


        if (asset_quantities.length>0){
            let script=this._get_marker_output(asset_quantities,param.metadata);
            outputs.unshift({data:script.toString('hex')});
        }
        // @ts-ignore
        let finalinput=[];
        inputs.forEach((tmp,i)=>{
            finalinput.push({txid:tmp.txid,vout:tmp.vout})
        });
        // @ts-ignore
        let hash=await this.createrawtransaction(finalinput,outputs,POSTURL);
        return hash;

    }
    // @ts-ignore
    async createrawtransaction(inputs,outputs,POSTURL=SERVICE_URL){
        const id=new Date().getTime()+Math.floor(Math.random()*1000000);
        const postdata={'version':1.1,method:'createrawtransaction','params':[inputs,outputs],'id':id};
        let tmpret=await axios.post(POSTURL,postdata)
        let rawhex=tmpret.data.result;

        const id2=new Date().getTime()+Math.floor(Math.random()*1000000);
        const postdata2={'version':1.1,method:'signrawtransactionwithwallet','params':[rawhex],'id':id2};
        let tmpret2=await axios.post(POSTURL,postdata2)
        let rawhex2=tmpret2.data.result;
        console.log('sigined',rawhex2);

        const id3=new Date().getTime()+Math.floor(Math.random()*1000000);
        const postdata3={'version':1.1,method:'sendrawtransaction','params':[rawhex2.hex],'id':id3};

        let tmpret3=await axios.post(POSTURL,postdata3)

        let rawhex3=tmpret3.data.result;
        return rawhex3;
    }
     _collect_colored_outputs(unspent_outputs:uxto[],assetid:number,asset_quantity:number){
        let total_amount=0;
        let result:uxto[]=[];
        for (let tmpuxto of unspent_outputs){
            if (tmpuxto.assetid==assetid){
                result.push(tmpuxto)
                // @ts-ignore
                total_amount+=tmpuxto.assetamount;

            }
            if (total_amount>asset_quantity){
                return {result,total_amount};
            }
        }
        throw new Error('InsufficientAssetQuantityError');

    }
    async issue(issuanceSpec:issueparam, fees:feetype=0.0001){
        let POSTURL=SERVICE_URL+'/wallet/'+issuanceSpec.walletname;
        console.log("POSTURL:::",POSTURL);
        const id1=new Date().getTime()+Math.floor(Math.random()*1000000);
        const postdata1={'version':1.1,method:'listunspent','params':[],'id':id1};
        let uxtoresult=await axios.post(POSTURL,postdata1);
        console.log("uxtoresult:",uxtoresult);
        for(let tmpitem of uxtoresult.data.result){
            console.log("why",tmpitem);
            tmpitem['assetid']=(await CE.get_output(tmpitem.txid,tmpitem.vout)).assetId
        }
        issuanceSpec.uxto=uxtoresult.data.result;
        console.log("issuanceSpec:",issuanceSpec);
        let trbuilder=new TransactionBuilder();
        let outputInfo = this._collectUncoloredOutputs(issuanceSpec.uxto, 2 * this.dust_amount + fees);
        let input=[];
        let output=[];
        for(let tmp of outputInfo.outputs){
            input.push({txid:tmp.txid,vout:tmp.vout});
        }
        let tmp={};
        // @ts-ignore
        tmp[issuanceSpec.toscript]=this.dust_amount;
        output.push(tmp);
        let script=this._get_marker_output(issuanceSpec.asset_quantities,issuanceSpec.metadata);
        output.push({data:script.toString('hex')})
        let tmp2={};
        // @ts-ignore
        tmp2[issuanceSpec.changescript]=outputInfo.totalAmount-this.dust_amount-fees;
        output.push(tmp2);
        const id=new Date().getTime()+Math.floor(Math.random()*1000000);
        const postdata={'version':1.1,method:'createrawtransaction','params':[input,output],'id':id};
        let tmpret=await axios.post(POSTURL,postdata)
        let rawhex=tmpret.data.result;
        console.log('rawtransaction:',rawhex);

        const id2=new Date().getTime()+Math.floor(Math.random()*1000000);
        const postdata2={'version':1.1,method:'signrawtransactionwithwallet','params':[rawhex],'id':id2};
        let tmpret2=await axios.post(POSTURL,postdata2)
        let rawhex2=tmpret2.data.result;
        console.log('sigined',rawhex2);

        const id3=new Date().getTime()+Math.floor(Math.random()*1000000);
        const postdata3={'version':1.1,method:'sendrawtransaction','params':[rawhex2.hex],'id':id3};

        let tmpret3=await axios.post(POSTURL,postdata3)

        let rawhex3=tmpret3.data.result;
       return rawhex3;




    }

    _get_marker_output(asset_quantities:number[],metadata:Buffer):Buffer{
        console.log('metadata:',asset_quantities,metadata);
        let mk=new MarkerOutput(asset_quantities,metadata);
        let payload=mk.serialize_payload();
        let script=mk.buildScript(payload);
        return script;
    }

    /**
     * Return a list of uncolored outputs for the specified amount
     * @param  array(SpendableOutput) unspentOutputs  The list of available outputs
     * @param  int                    amount          The amount to collect
     * @return Object(outputs:array(SpendableOutput),totalAmount:int)
     **/

    _collectUncoloredOutputs (unspentOutputs:uxto[], amount:number):{outputs:uxto[],totalAmount:number} {
        let totalAmount = 0, result:uxto[]=[];

        unspentOutputs.some(function (spendableOutput:uxto) {

            if (!spendableOutput.assetid) {

                result.push(spendableOutput);
                totalAmount += spendableOutput.amount;

            }

            if (totalAmount >= amount) {
            return true;
            }


        });
        if(totalAmount>=amount){
            return {
                outputs: result,
                    totalAmount: totalAmount
            };
        }else

        throw new Error("Insufficient funds");


    };

/**
 * Create an uncolored output
 * @param Buffer   script  The output script
 * @param int      value   The satoshi value of the output
 * @return Object  An object representing the uncolored output
 **/
_getUncoloredOutput(script:any, value:number) {
    if (value < this.dust_amount) {
        throw Error('The value of the output would be too small, and the output would be considered "dust"');
    }

    return {v: value, s: script};
};

/**
 * Return a list of colored outputs for the specified quantity
 * @param array(SpendableOutput)  unspentOutputs  The list of available outputs
 * @param Buffer                  assetId         The ID of the asset to collect
 * @param int                     quantity        The asset quantity to collect
 * @return Object(outputs:array(SpendableOutput),quantity:int)
 **/
_collectColoredOutputs (unspentOutputs:any, assetId:any, assetQuantity:number) {
    let totalQuantity = 0;
    let result:any[] = [];

    unspentOutputs.forEach(function (spendableOutput:any) {
        if (spendableOutput.output.assetId == assetId) {
            result.push(spendableOutput);
            totalQuantity += spendableOutput.output.assetQuantity;
        }

        if (totalQuantity >= assetQuantity) {
            return {outputs: result, quantity: totalQuantity};
        }
    });

    throw new Error("An insufficient amount of assets is available");
};

/**
 * Create a colored output
 * @param Buffer   script  The output script
 * @return Object  An object representing the colored output
 **/
_getColoredOutput  (script:Uint8Array) {
    return {v: this.dust_amount, s: script};
};

/**
 * Create a marker output
 *
 * @param array(int)  assetQuantities  The asset quantity list
 * @param Buffer      metadata         The metadata contained in the output
 * @return Object     An object representing the marker output
 **/
_getMarkerOutput(assetQuantities:number[],metadata:Buffer){
    let output  = new MarkerOutput(assetQuantities,metadata);
    let payload = output.serialize_payload();
    let script  = output.buildScript(payload);
    return {v: 0, s: script}; // Marker output has value 0 satoshis
}
}
export default TransactionBuilder;
// @ts-ignore
import Put from "bufferput";
// @ts-ignore
import LEB128 from "./LEB128";
// @ts-ignore
import {script} from 'bitcoinjs-lib';
import {Mybufferwriter,Mybufferreader} from './mybuffer'
import Buffer from "buffer";
// @ts-ignore
import REVERSE_OPS from 'bitcoin-ops/map';
import {fromASM} from "bitcoinjs-lib/types/script";
// @ts-ignore
const byteToHex = [];

for (let n = 0; n <= 0xff; ++n)
{
    const hexOctet = n.toString(16).padStart(2, "0");
    byteToHex.push(hexOctet);
}



class MarkerOutput{
    static MAX_ASSET_QUANTITY = 2 ** 63 - 1;
    static OPEN_ASSETS_TAG = 0x4f41;
    static OPEN_ASSETS_VERSION = 0x0100;
    private _asset_quantities:number[];
    private _metadata:Buffer;
    constructor(asset_quantities:number[], metadata:Buffer) {
        asset_quantities.forEach((q,i)=>{
            if(q>MarkerOutput.MAX_ASSET_QUANTITY){
                throw Error('Asset quantity '
                    + asset_quantities[i]
                    + ' exceeds maximum allowed (' + MarkerOutput.MAX_ASSET_QUANTITY + ')');
            }
            }

        );
        this._asset_quantities=asset_quantities;
        this._metadata=metadata;
    }
    get asset_quantities(){
        return this._asset_quantities;
    }
    get metadata(){
        return this._metadata;
    }
    static deserialize_payload(payload:Buffer){
        try{
        let assetquantities:Array<number> = new Array<number>();
        var metadata;
       let parser=new Mybufferreader(payload);
       console.log('bufferinde:',payload);
       let openassetstag=parser.word16be();
       console.log('tag:',openassetstag)
       let openassetsversion = parser.word16be();
            console.log('v:',openassetsversion)
        let outputcount = parser.varInt();
        for (let i = 0; i < outputcount; i++) {
            // Decode an LEB128-encoded integer, and get stream metadata
            let decodeData = LEB128.decodeWithMetadata(payload, parser.pos);
            // Add the decoded value to the assetQuantities array
            assetquantities.push(decodeData.value);
            // Update the parser position to the next unseen byte
            parser.pos = decodeData.nextIndex;
        }
        const metadatalength = parser.varInt();
        metadata = parser.buffer(metadatalength );
        return new MarkerOutput(assetquantities, metadata);
        }catch (err) {
            throw new Error("Deserialization error: " + err.message)
        }
    }
    serialize_payload(){
        let buffer = (new Put())
            .word16be(MarkerOutput.OPEN_ASSETS_TAG)            // Add Open Assets tag
            .word16be(MarkerOutput.OPEN_ASSETS_VERSION);
        buffer.varint(this._asset_quantities.length);

        for(let i = 0; i < this._asset_quantities.length; i++) {

            buffer.put(LEB128.encode(this._asset_quantities[i]));

        }

        buffer.varint(this._metadata.byteLength);
        buffer.put(this._metadata);
        return buffer.buffer();
    }
    buildScript(data:Buffer){

        let tmp=script.fromASM("OP_RETURN "+data.toString('hex'));

        return tmp;
    }
    static parse_script(outputScript:Buffer){
        let tmpscript=script.decompile(outputScript);

        // @ts-ignore
        if (!tmpscript[0] || REVERSE_OPS[tmpscript[0]] != 'OP_RETURN') {

            return false;
        }

        // There must be exactly one data section following the opcode
        // @ts-ignore
        if (!tmpscript[1] || tmpscript.length > 2) {
            return false;
        }
        // @ts-ignore
       let  payload = tmpscript[1];

        // @ts-ignore
        if (payload.readUInt16BE(2)!= MarkerOutput.OPEN_ASSETS_TAG || payload.readUInt16BE(4)!=MarkerOutput.OPEN_ASSETS_VERSION) {

            return false;
        }
        // @ts-ignore
        return payload.slice(2);

    }

}
export default MarkerOutput;
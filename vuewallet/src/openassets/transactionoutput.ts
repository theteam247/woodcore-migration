import MarkerOutput from "@/openassets/markeroutput";
import {UNCOLORED ,MARKER_OUTPUT,ISSUANCE,TRANSFER,reverseMap} from './OutputType'
import {script} from 'bitcoinjs-lib'
import {_scriptPubKey} from './coloringengine'
class transactionoutput{
    public value;
    public script;
    public assetId;
    public assetQuantity;
    public outputType;
    public metadata:string;
    public txid:string;
    constructor(value:number=-1, script:_scriptPubKey, assetId=0, assetQuantity=0, outputType=UNCOLORED,metadata='',txid='') {
        if (assetQuantity && (assetQuantity < 0 || assetQuantity > MarkerOutput.MAX_ASSET_QUANTITY)) {
            throw new Error(
                "Asset quantity out of supported range (0-"
                + MarkerOutput.MAX_ASSET_QUANTITY + ")");
        }
        // Ensure outputType is a valid identifier
        if (outputType && (outputType < UNCOLORED || outputType >TRANSFER)) {
            throw new Error("Unsupported output type specified");
        }
        this.value = value;
        this.script = script;
        this.assetId = assetId;
        this.assetQuantity = assetQuantity;
        this.outputType = outputType;
        this.metadata=metadata;
        this.txid=txid;

    }

    toString(){
        return 'TransactionOutput(' +
            'value='         + this.value                                                   + ', ' +
            'script='        + ((this.script)  ? '0x' + this.script.toString() : null) + ', ' +
            'assetId='       + ((this.assetId) ? '0x' + this.assetId.toString(): null) + ', ' +
            'assetQuantity=' + this.assetQuantity                                           + ', ' +
            'outputType='    + reverseMap(this.outputType) + ')';
    }

}
export default transactionoutput;
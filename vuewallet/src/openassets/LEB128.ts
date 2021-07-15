// @ts-ignore
import leb from 'leb';
class LEB128{
    static encode(value:number){
        if (value<0){
            throw new Error('Negative values are not supported');
        }
        return leb.encodeUInt64(value);

    }
    static decode(data:ArrayBuffer,offset:number=0){
        return leb.decodeUInt64(data, offset).value;
    }
    static  decodeWithMetadata(data:ArrayBuffer,offset:number=0){



        return leb.decodeUInt64(data, offset);
    }

}
export default LEB128;
import Buffer from "buffer";

type word = {
    action:string,
    value: number,
    little:boolean,
}
class Mybufferreader{

    constructor(private buf: Buffer, public pos = 0 ) {

    }
    word8(){
        const tmp=this.buf.readUInt8(this.pos);
        this.pos++;
        return tmp;

    }
    word16be() {
        const tmp=this.buf.readUInt16BE(this.pos);
        this.pos+=2;
        return tmp;
    }
    buffer(l:any){
        let tmp=this.buf.slice(this.pos,this.pos+l);
       // const tmp= new Uint8Array(this.buf.buffer,this.pos,l);
        this.pos+=l;
        return tmp;
    }
    varInt() {
        let tmp;
        tmp=this.buf.readUInt8(this.pos);
        if(tmp<0xfd){
            this.pos++;
            return tmp;
        }else if(tmp==0xfd){
            tmp=this.buf.readUInt16BE(this.pos+1);
            this.pos+=3;
            return tmp;
        }else if(tmp==0xfe){
            tmp=this.buf.readUInt32BE(this.pos+1);
            this.pos+=5;
            return tmp;
        }else{
            tmp=this.buf.readBigUInt64BE(this.pos+1);
            this.pos+=9;
            return tmp;
        }

    }

}
class Mybufferwriter {

    constructor(private words: word[] = [], private len: number = 0) {

    }
    word8(_in:number){
        this.words.push({action:'setUint8', value:_in,little:false});
        this.len += 1;
        return this;
    }
    word16be(_in: number) {
        this.words.push({little:false, value: _in,action:'setUint16'});
        this.len += 16 / 8;
        return this;
    }
    word16le(_in: number) {
        this.words.push({value:_in,action:'setUint16', little:true});
        this.len += 16 / 8;
        return this;
    }
    word32le(x:number){
        this.words.push({action:'setUint32',value: x, little:true});
        this.len += 32 / 8;
        return this;
    }
    word64le(x:number){
        this.words.push({action:'setBigUint64',value: x, little:true});
        this.len += 64 / 8;
        return this;
    }

    varInt(i: number) {
        if(i < 0xFD) {
            this.word8(i);
        } else if(i <= 1<<16) {
            this.word8(0xFD);
            this.word16le(i);
        } else if(i <= 1<<32) {
            this.word8(0xFE);
            this.word32le(i);
        } else {
            this.word8(0xFF);
            this.word64le(i);
        }
    }
    put(buf:Uint8Array){

        for(let i=0;i<buf.byteLength;i++){
            this.word8(buf[i]);
        }


        return this;
    }
    pad(n:number){
        for(let i=0;i<n;i++){
            this.word8(0);
        }

        return this;
    }
    buffer():Uint8Array{
        const buf=new ArrayBuffer(this.len);
        const dataview=new DataView(buf);
        let offset=0;
        this.words.forEach(function(word) {
          switch (word.action) {
              case 'setInt8':
                  dataview.setInt8(offset,word.value);
                  offset+=1
                  break
              case 'setInt16':
                  dataview.setInt16(offset,word.value,word.little);
                  offset+=2
                  break
              case 'setInt32':
                  dataview.setInt32(offset,word.value,word.little);
                  offset+=4
                  break
              case 'setBigInt64':
                  dataview.setBigInt64(offset,BigInt(word.value),word.little);
                  offset+=8
                  break
          }
        });
        //<Uint8Array>buf
        return new Uint8Array(buf);
    }
}
export {Mybufferwriter,Mybufferreader};
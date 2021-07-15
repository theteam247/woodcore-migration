<template>
  <div>
    <h1 class="content-container--heading">Block #{{ blockinfo.height }}</h1>
    <p class="item-hash">
      <b>Block Hash</b> {{ blockinfo.hash }}
      <button tabindex="0" title="copy to clipboard" type="button" @click="copy(blockinfo.hash)">
        <i class="el-icon-document-copy"></i>
      </button>
    </p>

    <h1 class="u-font-large">Summary</h1>

    <!---->
    <ion-list class="list--summary list list-md">
      <ion-grid class="grid">
        <ion-row class="row">
          <ion-col class="allow-truncated-text col" col-12="" col-md="">
            <!---->
            <block-summary>
              <ion-item class="item item-block item-md">
                <div class="item-inner">
                  <div class="input-wrapper"><!---->
                    <ion-label class="label label-md">
                      Merkle Root

                    </ion-label>
                  </div>
                  <ion-note item-end="" class="note note-md">
                    {{ blockinfo.merkleroot }}
                  </ion-note><!----></div>
                <div class="button-effect"></div>
              </ion-item>
              <!---->
              <ion-item class="item item-block item-md">
                <div class="item-inner">
                  <div class="input-wrapper"><!---->
                    <ion-label class="label label-md">
                      Bits

                    </ion-label>
                  </div>
                  <ion-note item-end="" class="note note-md">
                    {{ blockinfo.bits }}
                  </ion-note><!----></div>
                <div class="button-effect"></div>
              </ion-item>
              <!---->
              <ion-item class="item item-block item-md">
                <div class="item-inner">
                  <div class="input-wrapper"><!---->
                    <ion-label class="label label-md">
                      Version

                    </ion-label>
                  </div>
                  <ion-note item-end="" class="note note-md">
                    {{ blockinfo.version }}
                  </ion-note><!----></div>
                <div class="button-effect"></div>
              </ion-item>
            </block-summary>
            <!---->
            <ion-item class="item item-block item-md">
              <div class="item-inner">
                <div class="input-wrapper"><!---->
                  <ion-label class="label label-md">
                    Number of Transactions

                  </ion-label>
                </div>
                <ion-note item-end="" class="note note-md">
                  {{ blockinfo.nTx }}
                </ion-note><!----></div>
              <div class="button-effect"></div>
            </ion-item>
            <ion-item class="item item-block item-md">
              <div class="item-inner">
                <div class="input-wrapper"><!---->
                  <ion-label class="label label-md">
                    Height

                  </ion-label>
                </div>
                <ion-note item-end="" class="note note-md">
                  {{ blockinfo.height }}
                  <span hidden="">(Mainchain)</span>
                </ion-note><!----></div>
              <div class="button-effect"></div>
            </ion-item>

            <ion-item class="item item-block item-md">
              <div class="item-inner">
                <div class="input-wrapper"><!---->
                  <ion-label class="label label-md">
                    Timestamp

                  </ion-label>
                </div>
                <ion-note item-end="" class="note note-md">
                  {{ blockinfo.time ? getisotime(blockinfo.time) : "" }}
                </ion-note><!----></div>
              <div class="button-effect"></div>
            </ion-item>

          </ion-col>
          <ion-col class="allow-truncated-text col" col-12="" col-md="">
            <ion-item class="item item-block item-md">
              <div class="item-inner">
                <div class="input-wrapper"><!---->
                  <ion-label class="label label-md">
                    Difficulty

                  </ion-label>
                </div>
                <ion-note item-end="" class="note note-md">
                  {{ blockinfo.difficulty }}
                </ion-note><!----></div>
              <div class="button-effect"></div>
            </ion-item>
            <ion-item class="item item-block item-md">
              <div class="item-inner">
                <div class="input-wrapper"><!---->
                  <ion-label class="label label-md">
                    Size (bytes)

                  </ion-label>
                </div>
                <ion-note item-end="" class="note note-md">
                  {{ blockinfo.size }}
                </ion-note><!----></div>
              <div class="button-effect"></div>
            </ion-item>
            <ion-item class="item item-block item-md">
              <div class="item-inner">
                <div class="input-wrapper"><!---->
                  <ion-label class="label label-md">
                    Nonce

                  </ion-label>
                </div>
                <ion-note item-end="" class="note note-md">
                  {{ blockinfo.nonce }}
                </ion-note><!----></div>
              <div class="button-effect"></div>
            </ion-item>
            <ion-item class="item item-block item-md">
              <div class="item-inner">
                <div class="input-wrapper"><!---->
                  <ion-label class="label label-md">
                    Previous Block

                  </ion-label>
                </div>
                <ion-note item-end="" class="note note-md">
                  <a role="button" tabindex="0" :class="(blockinfo.height+1>total || blockinfo.height-1<0) ? 'disabled-link' : ''" @click="jumptoblock(blockinfo.height - 1)">{{ blockinfo.height - 1 >= 0 ? blockinfo.height - 1 : 'null' }}</a>
                </ion-note><!----></div>
              <div class="button-effect"></div>
            </ion-item>
            <ion-item class="item item-block item-md">
              <div class="item-inner">
                <div class="input-wrapper"><!---->
                  <ion-label class="label label-md">
                    Next Block

                  </ion-label>
                </div>
                <ion-note item-end="" class="note note-md">
                  <a role="button" tabindex="0" :class="blockinfo.height+1>total || blockinfo.height-1<0 ? 'disabled-link' : ''" @click="jumptoblock(blockinfo.height + 1)">{{ blockinfo.height + 1 }}</a>
                </ion-note><!----></div>
              <div class="button-effect"></div>
            </ion-item>
            <ion-item class="item item-block item-md">
              <div class="item-inner">
                <div class="input-wrapper"><!---->
                  <ion-label class="label label-md">
                    Confirmations

                  </ion-label>
                </div>
                <ion-note item-end="" class="note note-md">
                  {{ blockinfo.confirmations }}
                </ion-note><!----></div>
              <div class="button-effect"></div>
            </ion-item>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-list>

    <h2>Transactions</h2>
    <transaction-list>
      <div>
        <ion-grid class="grid">
          <ion-row class="row" v-for="(transaction,i) in transactions">
            <ion-col class="col" col-12="">
              <transaction-details>
                <ion-grid class="grid">
                  <ion-row class="row">
                    <ion-col class="col" col-7="">
                      <div class="ellipsis">
                        <span>
                          <ion-icon name="add-circle" role="img" class="icon icon-md ion-md-add-circle" aria-label="add circle"></ion-icon>
                          <ion-icon name="remove-circle" role="img" class="icon icon-md ion-md-remove-circle" aria-label="remove circle" hidden=""></ion-icon>
                        </span>
                        <span>
                          <a role="button" tabindex="0" :href="gettransactionUrl(transaction.txid)">{{ transaction.txid }}</a>
                        </span>
                      </div>
                    </ion-col>
                    <ion-col class="col" col-5="" text-right="">
                      <!---->
                      <ion-note class="note note-md">
                        <span translate="">mined on</span>
                        <time>{{ getisotime(transaction.time) }}</time>
                      </ion-note>
                    </ion-col>
                  </ion-row>

                  <ion-row align-items-start="" class="row">
                    <ion-col class="col" col-12="" col-md-5="">

                      <ion-list class="list list-md"
                                v-show="transaction.vin.length==1 && transaction.vin[0].txid==undefined">
                        <ion-item class="item item-block item-md">
                          <div class="item-inner">
                            <div class="input-wrapper">
                              <ion-label class="label label-md">
                                "No Inputs (Newly Generated Coins)"
                              </ion-label>
                            </div><!----></div>
                          <div class="button-effect"></div>
                        </ion-item>
                      </ion-list>

                      <ion-list class="list list-md" v-show="!(transaction.vin.length==1 && transaction.vin[0].txid==undefined)">

                        <ion-item class="item item-block item-md"  v-for="(vin,vinn) in transaction.vin">
                          <div class="item-inner"><div class="input-wrapper"><ion-label class="label label-md">


                          <div class="ellipsis">
                            <p>
                              <a role="button" tabindex="0" class="disabled-link">{{ amount[vin.txid] && amount[vin.txid][vin.vout] ? amount[vin.txid][vin.vout]['address'] :''}}</a>
                            </p>
                          </div>
                          <div hidden="">
                            <!----><p>
                            <b>Confirmations</b> 1</p>
                            <p>
                              <b>Unlocking Script</b>
                            </p>
                            <!----><div>
                            <!---->
                          </div>
                          </div>


                        </ion-label></div><div item-end="">
                            {{ amount[vin.txid] && amount[vin.txid][vin.vout] ? amount[vin.txid][vin.vout]['amount'] :''}}LOG
                        </div><!----></div><div class="button-effect"></div></ion-item>

                        <!---->
                      </ion-list>

                    </ion-col>

                    <ion-col class="arrow-forward col" col-12="" col-md-1="" text-center="">
                      <ion-icon name="arrow-forward" role="img" class="icon icon-md ion-md-arrow-forward"
                                aria-label="arrow forward"></ion-icon>
                    </ion-col>

                    <ion-col class="col" col-12="" col-md-6="">
                      <ion-list class="list list-md">

                        <ion-item class="item item-block item-md" v-for="(vout,ai) in transaction.vout" v-if="vout.scriptPubKey.type!='nulldata'">
                          <div class="item-inner">
                            <div class="input-wrapper"><!---->
                              <ion-label class="label label-md">
                                <div>
                                  <div class="ellipsis">
                                    <p>
                                      <a role="button" tabindex="0" class="disabled-link">{{vout.scriptPubKey.addresses[0]}}</a>
                                    </p>
                                  </div>
                                  <!---->
                                </div>


                              </ion-label>
                            </div>
                            <div item-end="">
                              {{vout.value}} LOG
                              <span>(S)</span>
                              <span hidden="">(U)</span>
                            </div></div>
                          <div class="button-effect"></div>
                        </ion-item>

                      </ion-list>
                    </ion-col>
                  </ion-row>

                  <!---->
                  <ion-row align-items-start="" class="small row" text-uppercase="">
                    <ion-col class="col" col-6="" >
                      <!---->
                      <div v-show="!(transaction.vin.length==1 && transaction.vin[0].txid==undefined)">
                        <ion-chip class="chip chip-md">
                          <ion-label class="label label-md">Fee
                            <span text-nowrap="">{{amount[transaction.txid]==undefined ? '' : amount[transaction.txid]['fee'].toFixed(8)}}LOG</span>
                          </ion-label>
                        </ion-chip>
                      </div>
                    </ion-col>
                    <ion-col class="col" col-6="" text-right="">

                      <ion-chip color="primary" class="chip chip-md chip-md-primary">
                        <ion-label class="label label-md">{{transaction.confirmations}} Confirmations
                        </ion-label>
                      </ion-chip>
                      <!---->
                      <!---->
                      <ion-chip color="default" class="chip chip-md chip-md-default">
                        <ion-label class="label label-md">{{amount[transaction.txid]==undefined ? '' : amount[transaction.txid]['sended'].toFixed(8)}}
                          LOG
                        </ion-label>
                      </ion-chip>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </transaction-details>
              <!---->
            </ion-col>
          </ion-row>


        </ion-grid>
      </div>
    </transaction-list>
  </div>
</template>

<script>
const genesistransaction = {
  txid: "d508b7916ec00595c1f8e1c767dc3b37392a5e68adf98118bca80a2ed58331d6",
  "hash": "d508b7916ec00595c1f8e1c767dc3b37392a5e68adf98118bca80a2ed58331d6",
  version: 1,
  size: 118,
  vsize: 118,
  blockhash: "30758383eae55ae5c7752b73388c1c85bdfbe930ad25ad877252841ed1e734a4",
  blocktime: 1413817324,
  confirmations: 1499302,
  weight: 436,
  hex: 0,
  locktime: 0,
  time: 1413817324,

  vin: [
    {
      coinbase: "04e0c146540101062f503253482f",
      "raw_scriptSig": "04ffff001d010430426172756b204b68617a61642e202042544320426c6f636b20333236313733206e6f6e63653a20383738303136363536",
      "sequence": 4294967295,
      txid: undefined,
      vout: undefined,
    }
  ],

  "out": [

    {
      n: 0,
      value: 0,
      scriptPubKey: {
        addresses: ["Wf89qPnQWpccorFJbFJHqKVDKAJykztZf8"],
        asm: "0 CHECKSIG",
        hex: "00ac",
        reqSigs: 1,
        type: "pubkey"
      },

    }
  ],

};
export default {
  data() {
    return {
      componentKey: 0,
      blockinfo: {},
      transactions: [],
      amount:{},
      total:10000,
    };
  },


  methods: {

     getamount(txid,n,reftxid=undefined){
      if (txid==undefined) return false;
      this.rpc.getRawTransactionAsObject(txid).then(transaction => {

        transaction.vout.every((v,i)=>{

            if (v.n==n){
              if(this.amount[txid]==undefined){
                this.amount[txid]={};
                this.amount[txid][n]={};

              }
              try{
                this.amount[txid][n]['amount']=v.value;
                if(reftxid){
                  this.amount[reftxid]['fee']+=v.value;
                }
                try{
                this.amount[txid][n]['address']=v.scriptPubKey.addresses[0];
                }catch (e) {
                  this.amount[txid][n]['address']="unparsed address";
                }
               this.$forceUpdate();
              }catch (e) {

              }
              return v.value;
            }
        });
      })


    },
    jumptoblock(blockheight){
       if (blockheight>this.total || blockheight<0)
         return;
       try {
         console.log(blockheight);
         this.rpc.getBlockHashFromHeight(blockheight).then(ret=>{
           console.log(222222222222222);
           console.log(ret);
             this.$router.push('/block?hash='+ret);
               this.loadblockinfo(ret);
         }
         );
       }catch (e) {

       }
    },
    loadblockinfo(hash) {


      this.rpccall('getblockcount').then(ret=>{
        this.total=ret.data.result;

      });


      this.rpc.getBlockFromHash(hash).then(ret => {
        console.log("blockinfo:");
        console.log(ret);
        this.blockinfo = ret;
        this.transactions = [];
        this.amount={};



        for (let i = 0; i < this.blockinfo.tx.length; i++) {

          console.log(this.blockinfo.tx[i]);
          if (this.blockinfo.tx[i] == "d508b7916ec00595c1f8e1c767dc3b37392a5e68adf98118bca80a2ed58331d6") {
            this.transactions.push(genesistransaction);
          } else {
            this.rpc.getRawTransactionAsObject(this.blockinfo.tx[i]).then(transaction => {


              transaction.vout.forEach((vout,j)=>{
                if(this.amount[transaction.txid]==undefined){
                  this.amount[transaction.txid]={};
                  this.amount[transaction.txid]['fee']=0;
                  this.amount[transaction.txid]['sended']=0;
                }
                this.amount[transaction.txid]['fee']-=vout.value;
                this.amount[transaction.txid]['sended']+=vout.value;
              });
              console.log("fee!~");
              console.log(transaction);
              console.log(this.amount);
              transaction.vin.forEach((vin,i)=>{

                this.getamount(vin.txid,vin.vout,transaction.txid);
              });


              this.transactions.push(transaction);


              //this.transactions=tmptransactions.sort(function(a,b){return a.height-b.height});
            });
          }
        }
      });
    },


  },
  mounted() {
    this.loadblockinfo(this.$route.query.hash);
  }

  ,
}
</script>

<style>
</style>

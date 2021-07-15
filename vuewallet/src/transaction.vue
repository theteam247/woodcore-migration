<template>
  <div>
    <h1 class="content-container--heading text text-md" ion-text="">
      Transaction
      <!---->
    </h1>

    <p class="item-hash">
      <b>Transaction Hash</b> {{transaction.hash}} <button tabindex="0" title="copy to clipboard" type="button">
      <ion-icon md="md-copy" role="img" class="icon icon-md ion-md-copy" aria-label="copy" @click="copy(transaction.hash)"></ion-icon>
    </button>
    </p>

    <h2>Summary</h2>

    <!---->

    <ion-list class="list--summary list list-md">

      <!----><transaction-summary><ion-item class="item item-block item-md"><div class="item-inner"><div class="input-wrapper"><!----><ion-label class="label label-md">
      Size

    </ion-label></div><ion-note item-end="" class="note note-md">
      {{transaction.size}} (bytes)
    </ion-note><!----></div><div class="button-effect"></div></ion-item>
<!--      <ion-item class="item item-block item-md">-->

<!--        <div class="item-inner"><div class="input-wrapper"><ion-label class="label label-md">-->
<!--        Fee Rate-->

<!--      </ion-label></div>-->
<!--        -->
<!--        <ion-note item-end="" class="note note-md">-->
<!--        2.9 sats/byte-->
<!--      </ion-note>-->
<!--        -->
<!--       </div>-->

<!--        <div class="button-effect"></div></ion-item>-->

    </transaction-summary>
      <!---->

      <ion-item class="item item-block item-md"><div class="item-inner"><div class="input-wrapper"><!----><ion-label class="label label-md">
        Received Time

      </ion-label></div><ion-note item-end="" class="note note-md">
        {{getisotime(transaction.time)}}
      </ion-note><!----></div><div class="button-effect"></div></ion-item>
      <ion-item class="item item-block item-md"><div class="item-inner"><div class="input-wrapper"><!----><ion-label class="label label-md">
        Included in Block



      </ion-label></div><ion-note item-end="" class="note note-md">
        <a role="button" tabindex="0" @click="jumptoblock(transaction.blockhash)">{{transaction.blockhash}}</a>
      </ion-note><!----><!----><!----></div><div class="button-effect"></div></ion-item>
    </ion-list>

    <h2>Details</h2>

    <transaction-details>
      <ion-grid class="grid">
        <ion-row class="row">
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
                              v-show="transaction.vin && transaction.vin.length==1 && transaction.vin[0].txid==undefined">
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

                    <ion-list class="list list-md" v-show="!(transaction.vin && transaction.vin.length==1 && transaction.vin[0].txid==undefined)">

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
                    <div v-show="!(transaction.vin && transaction.vin.length==1 && transaction.vin[0].txid==undefined)">
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
    </transaction-details>
    <!---->
  </div>
</template>

<script>
export default {
	 data() {
	      return {
            transaction:{},
          amount:{},
	      };
	    },
  methods: {
    getamount(txid,n,reftxid=undefined){
      if (txid==undefined) return false;
      this.rpc.getRawTransactionAsObject(txid).then(transaction => {

        transaction.vout.some((v,i)=>{

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
    jumptoblock(blockhash){

      try {
              this.$router.push('/block/?hash='+blockhash);
              //this.loadblockinfo(ret);

      }catch (e) {

      }
    },
    loadtransactioninfo(hash){
      this.rpc.getRawTransactionAsObject(hash).then(transaction => {
        console.log('tranaxtion router');
        console.log(transaction);
        this.transaction=transaction;
        transaction.vout.forEach((vout,j)=> {
          if (this.amount[transaction.txid] == undefined) {
            this.amount[transaction.txid] = {};
            this.amount[transaction.txid]['fee'] = 0;
            this.amount[transaction.txid]['sended'] = 0;
          }
          this.amount[transaction.txid]['fee'] -= vout.value;
          this.amount[transaction.txid]['sended'] += vout.value;
        });
        transaction.vin.forEach((vin,i)=>{
          this.getamount(vin.txid,vin.vout,transaction.txid);
        });
        // transaction.vin.forEach((vin,i)=>{
        //   this.getamount(vin.txid,vin.vout);
        // });
        // this.transactions.push(transaction);


        //this.transactions=tmptransactions.sort(function(a,b){return a.height-b.height});
      });
    },
  },
  mounted() {
    this.loadtransactioninfo(this.$route.query.hash);
  }
}
</script>

<style>
</style>

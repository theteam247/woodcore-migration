<template>

<div style="text-align: center">

<div>
  <div><div><b class="walletbold">Availabel:</b><div class="walletnum">{{info.balance}}LOG</div></div></div>


  <div><div><b class="walletbold">Pending:</b><div class="walletnum">{{info.unconfirmed_balance}}LOG</div></div></div>

  <div><div><b class="walletbold">Total:</b><div class="walletnum">{{info.balance+info.unconfirmed_balance}}LOG</div></div></div>
  </div>
</div>
</template>
<script>

export default {
  data(){
    return {info:{},
      walletname:'',
    }
  },
  mounted() {
  this.init();


  },
  methods:{
    init(){
      this.walletname=this.$route.params.walletname==undefined ? '' : this.$route.params.walletname;
      this.rpccall('getwalletinfo',[],'/wallet/'+this.walletname).then(ret=>{
        console.log('walletinfo:');
        this.info=ret.data.result;
        console.log(this.info);
      });
    }


  }
}
</script>
<style>
.walletbold{
  display: inline-block;
  width: 150px;
  text-align: left;
}
.walletnum{
  display: inline-block;
  width: 150px;
  text-align: right;
}


</style>
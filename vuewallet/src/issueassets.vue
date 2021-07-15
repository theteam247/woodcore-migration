<template>

  <el-form id="issue">
<el-form-item label="toAddress:">
  <el-input v-model="toaddress" style="width: 500px;" placeholder="issue to this address"></el-input>
</el-form-item>

    <el-form-item label="assetsAmount:">
      <el-input v-model="assetamount" style="width: 500px;" placeholder="amount of the assets"></el-input>
    </el-form-item>

    <el-form-item label="changeAddress:">
      <el-input v-model="changeaddress" style="width: 500px;" placeholder="The woodcoin change is sent back to the this address"></el-input>
    </el-form-item>
    <el-form-item label="metaData:">
      <el-input v-model="metadata" style="width: 500px;" placeholder="metadata for the assets"></el-input>
    </el-form-item>
  <el-form-item label="Fee:" v-show="false">


    <el-input v-model="fee" style="width: 500px;">
      <template slot="append">per


        kilobyte</template>
    </el-input>
  </el-form-item>

<el-form-item>
  <el-button type="primary" @click="onSubmit" >issue</el-button>

<!--  <el-button type="primary" @click="clear" >Clear ALL</el-button><el-button type="primary" @click="dup" >Add Recipient</el-button>-->

</el-form-item>
</el-form>
</template>
<script>
import TransactionBuilder from './openassets/transactionbuilder'
import {issueparam,uxto} from './openassets/transactionbuilder'
import {AxiosResponse} from "axios";
import CE from './openassets/coloringengine'
export default {

  data() {
    return {
      fee:0.00010000,
      toaddress:'',
      changeaddress:'',
      assetamount:0,
      walletname:'',
      metadata:'',

    }
  },
mounted() {
    this.init();

},
  methods: {

    init(){
      this.walletname=this.$route.params.walletname==undefined ? '' : this.$route.params.walletname;
      this.rpccall('getnewaddress',[],'/wallet/'+this.walletname).then((ret)=>{
          this.toaddress=ret.data.result;
      });
      this.rpccall('getnewaddress',[],'/wallet/'+this.walletname).then((ret)=>{
        this.changeaddress=ret.data.result;
      });
    },

    onSubmit() {
      if(isNaN(parseInt(this.assetamount))){ return false;}
      let tb=new TransactionBuilder();
      let param={metadata:null,changescript: this.changeaddress,toscript:this.toaddress,asset_quantities:[this.assetamount],uxto:[],walletname:this.walletname};
      param.metadata=Buffer.from(this.metadata, 'utf8');
      try{
        let trbuilder=new TransactionBuilder();
      trbuilder.issue(param).then(ret=>{
        this.$message({
          message: ret,
          type: 'issue assets success!!'
        })
      },e=>{
        console.log('eeee:',e);
        this.$message({
        message: e,
        type: 'error'
      })})

      }catch (e) {
        this.$message({
          message: e,
          type: 'error'
        })
      }
    }
  }
}
</script>
<style>
.el-form{
  text-align: center;
}
.el-form-item__content{
  display: inline-block;
}
.el-form-item__content{
  display: inline-block;

}
#issue .el-form-item__label{
  float:none;
  display: inline-block;
  width: 120px;
}
</style>
<template>
<el-form  label-width="80px">
  <div :key='i' v-for="(payto,i) in paytos">
<el-form-item label="Pay to:">
  <el-input v-model="payto.payto" style="width: 500px;"></el-input>
</el-form-item>

<el-form-item label="Amount:">
  <el-input v-model="payto.amount" style="width: 500px;"></el-input>
</el-form-item>
  </div>
  <el-form-item label="Fee:" v-show="false">


    <el-input v-model="fee" style="width: 500px;">
      <template slot="append">per


        kilobyte</template>
    </el-input>
  </el-form-item>

<el-form-item>
  <el-button type="primary" @click="onSubmit" >send</el-button>

<!--  <el-button type="primary" @click="clear" >Clear ALL</el-button><el-button type="primary" @click="dup" >Add Recipient</el-button>-->

</el-form-item>
</el-form>
</template>
<script>

export default {

  data() {
    return {
      fee:0.00010000,
      paytos:[{
        payto: '',
        amount: '',
      }

      ]
    }
  },

mounted() {

  this.init();


},
  methods: {
    clear(){
      this.paytos=[{
        payto: '',
        amount: '',
      }

      ]
    } ,
    init(){
      this.walletname=this.$route.params.walletname==undefined ? '' : this.$route.params.walletname;

    },
    dup(){
      this.paytos.push({payto: '', amount: '',})
    },
    onSubmit() {
      if(isNaN(parseFloat(this.paytos[0].payto))){ return false;}
     this.rpccall('sendtoaddress',[this.paytos[0].payto,this.paytos[0].amount],'/wallet/'+this.walletname).then(
         ret=>{
           this.$message({
             message: 'commit the transaction to the mainnet successfully',
             type: 'success'
           })
         }
     ).catch(ret=>{
       console.log('error!!!',ret);
       if(ret.response.data.error!==null){
         this.$message({
           message: ret.response.data.error.message,
           type: 'error'
         })
       }
     });
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
.el-form-item__label{
  float:none;
  display: inline-block;
  width: 80px;
}
</style>
<template>
<div style="text-align: center">
  <img :src="dataurl" v-if="address">
  <div><span><B>ADDRESS:</B></span><span>{{address}}</span>       <button tabindex="0" title="copy to clipboard" type="button" @click="copy(address)">
    <i class="el-icon-document-copy"></i>
  </button></div>
</div>
</template>
<script>
import QRCode from 'qrcode';
export default {
  data() {
    return {
        address:'',
        label: '',
        amount: '',
        message:'',
        dataurl:'',
    }
  },
  mounted() {
    this.init();
  },
  methods: {

  init(){
    this.rpc.getNewAddress().then(ret=>{

      QRCode.toDataURL(ret)
          .then(url => {
            this.dataurl=url;

          })
          .catch(err => {
            console.error(err)
          })

      this.address=ret;

    });

  },
    onSubmit() {

      let ADDRESS="myaddress";
      this.rpc.getNewAddress().then(ret=>{ADDRESS=ret;



      let URI="woodcoin:"+ADDRESS;
      let tmpflag=0;
      let label='';
      let message='';
      let amount='';
      let address='<div><span><B>Address:</B></span><span>'+ADDRESS+'</span></div>';
      if(this.label){
        label='<div><span><B>Label:</B></span><span>'+this.label+'</span></div>';
        if (!tmpflag){
          URI+="?label="+this.label
          tmpflag=1;
        }else{
          URI+="&label="+this.label
        }
      }
      if(this.message){
        message='<div><span><B>Message:</B></span><span>'+this.message+'</span></div>';
        if (!tmpflag){
          URI+="?message="+this.message
          tmpflag=1;
        }else{
          URI+="&message="+this.message
        }
      }
      if(this.amount){
        amount='<div><span><B>Amount:</B></span><span>'+this.amount+'</span></div>';
        if (!tmpflag){
          URI+="?amount="+this.amount
          tmpflag=1;
        }else{
          URI+="&amount="+this.amount
        }
      }

      QRCode.toDataURL('I am a pony!www')
          .then(url => {
            this.dataurl=url;
            this.$alert('<div style="text-align: center"><img v-if="dataurl" src="'+url+'"></div><span>'+ADDRESS+'</span><h5>Payment information</h5><div><span><B>URI:</B></span><span>'+URI+'</span></div>'+address+label+amount+message, 'Request payment', {
              dangerouslyUseHTMLString: true
            });
          })
          .catch(err => {
            console.error(err)
          })
      });
    },
    clear(){
      this.label='';
      this.amount='';
      this.message='';
      this.dataurl='';
    }
  }
}
</script>
<style>
.el-form-item__content{
  display: inline-block;
  margin-left: 30px;
}
.el-form-item {
  text-align: center;
}
.el-form-item__label{
  float:none;
  display: inline-block;
}
</style>
<template>
  <el-form  label-width="80px">
    <el-form-item label="AssetId:">
      <el-select v-model="assetid" placeholder="请选择" style="width: 500px;">
        <el-option
            v-for="item in myassets"
            :key="item.assetId"
            :label="item.assetId+'(total:'+item.assetQuantity+',metadata:'+item.metadata+')'"
            :value="item.assetId">
        </el-option>
      </el-select>
    </el-form-item>

      <el-form-item label="Pay to:">
        <el-input v-model="payto" style="width: 500px;"></el-input>
      </el-form-item>

      <el-form-item label="Amount:">
        <el-input v-model="amount" style="width: 500px;"></el-input>
      </el-form-item>
    <el-form-item label="Change to:">
      <el-input v-model="changeto" style="width: 500px;"></el-input>
    </el-form-item>
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
import CE from './openassets/coloringengine'
import transactionoutput from "@/openassets/transactionoutput";
import TransactionBuilder from './openassets/transactionbuilder'
export default {
  data() {
    return {
     fee:0.0001,
      payto: 'GrRMKrgpTVUyUWqkyVJmDLQ6kCPUG88jv',
      amount:'',
      walletname:'',
      myassets:[],
      assetid:null,
      changeto:'',
      metaarr:{}
    };
  },


  methods: {

    onSubmit(){
      try{
        let trbuilder=new TransactionBuilder();
        if(parseInt(this.amount)==NaN){
          this.$message({
            message: "send amount need to be an interger.",
            type: 'error'
          })
        }
        let param={payto:this.payto,changeto:this.changeto,amount: parseInt(this.amount),assetid:this.assetid,fee:this.fee,walletname:this.walletname,metadata:this.metaarr[this.assetid]}
        if (!param.metadata){
          param['metadata']=new Buffer();
        }else{
          param['metadata']=Buffer.from(param['metadata'],'hex');
        }

        trbuilder.send_assets(param).then(ret=>{console.log("sendret:",ret);
          this.$message({
            message: ret,
            type: 'success'
          })

        });
      }catch (e) {
        console.log(e);
      }
    },
    init(){
      this.walletname=this.$route.params.walletname==undefined ? '' : this.$route.params.walletname;
      this.rpccall('getnewaddress',[],'/wallet/'+this.walletname).then(ret=>{this.changeto=ret.data.result;});
      this.rpccall('listunspent',[0,99999],'/wallet/'+this.walletname).then(
          ret=>{
            let arr=ret.data.result;
            // CE.get_output('f9a5bdf6f5f83ed57becb4c1bb701408ee6fdf7bfa3c1c70576640d7d6079330',0).then(ret=>{
            //   console.log('myassetsret:',ret);
            // });
            arr.forEach((item,i)=>{
              CE.get_output(item.txid,item.vout).then((ret)=>{

                if(ret.assetId && ret.assetId!=-1){
                    ret.txid=item.txid;
                    let exits=0;
                    this.myassets.some((item,i)=>{
                      if(item.assetId==ret.assetId){
                        item.assetQuantity+=ret.assetQuantity;
                        this.metaarr[item.assetId]=ret.metadata;
                        exits=1;
                        return 1;
                      }
                    });
                    if(!exits){
                      this.myassets.push(ret);
                    }


                }
              });

            });
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

    },
    ondetail(row, column, event){
      this.$router.push({path:'/block',query:{hash:row.hash}});

    },

    handleSizeChange(val) {
      this.pagesize=val;
      this.$router.push({path:'/blocks/',query:{p: this.currentPage,pagesize:this.pagesize}});
      this.loadpage();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.$router.push({path:'/blocks/',query:{p: this.currentPage,pagesize:this.pagesize}});
      this.loadpage();
    },
    loadpage:function(){
      let tmpdata=[];
      for(let i=0;i<this.pagesize;i++){
        if((this.total-(this.currentPage-1)*this.pagesize-i) <0){
          continue;
        }
        try{
          this.rpc.getBlockHashFromHeight(this.total-(this.currentPage-1)*this.pagesize-i).then(ret=>{
            return this.rpc.getBlockFromHash(ret);
          }).then(data=>{
            tmpdata.push(data);
            console.log(data);
            this.tableData=tmpdata.sort(function(a,b){return b.height-a.height});
          });
        }catch (e) {

        }
      }
    },
    // 表头样式设置
    headClass () {
      return 'text-align: center;background:rgb(242,242,242);color:rgb(140,138,140)'
    },
    // 表格样式设置
    rowClass () {
      return 'text-align: center;'
    }
  },
  mounted(){
   //this.pagesize=this.$route.query.pagesize ? this.$route.query.pagesize : 30;
   // this.currentPage=this.$route.query.p ? this.$route.query.p : 1;


      this.init();



   // this.rpccall('getblockcount').then(ret=>{
  //    this.total=ret.data.result;
      //this.currentPage=Math.ceil(this.total/this.pagesize)
  //    this.loadpage();
 //   });
  }

  ,
}
</script>

<style>
</style>

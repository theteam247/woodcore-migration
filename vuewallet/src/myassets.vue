<template>
  <div>

    <el-table style="width: 100%"  :cell-style="rowClass"  :header-cell-style="headClass"
              @row-click=ondetail
              :data="myassets"
    >
      <el-table-column
          prop="assetId"
          label="assetid"
          width="180"
      >
      </el-table-column>
      <el-table-column
          prop="metadata"
          label="assetmeta"
          width="180"
      >
      </el-table-column>

      <el-table-column
          prop="assetQuantity"
          label="assetamount"
      >
      </el-table-column>

      <el-table-column
          prop="txid"
          label="txid"
          width="580"
      >
        <template slot-scope="scope">

          <router-link :to="'/transaction?hash='+scope.row.txid"  >{{scope.row.txid}}</router-link>
        </template>
      </el-table-column>
<!--      <el-table-column-->
<!--          prop="blockhash"-->
<!--          label="blockhash"-->
<!--          width="180"-->
<!--      >-->
<!--      </el-table-column>-->
    </el-table>
  </div>
</template>

<script>
import CE from './openassets/coloringengine'
import transactionoutput from "@/openassets/transactionoutput";
export default {
  data() {
    return {
      tableData: [],
      currentPage:1,
      pagesize:30,
      total:300,
      walletname:'',
      myassets:[],
    };
  },


  methods: {
    init(){
      this.walletname=this.$route.params.walletname==undefined ? '' : this.$route.params.walletname;
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
                    this.myassets.push(ret)
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

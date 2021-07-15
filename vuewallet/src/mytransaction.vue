<template>

  <div style="text-align: center">

  <el-table style="display: inline-block;width: auto"
      :data="transactions"
      >
    <el-table-column
        prop="address"
        label="address"
        width="400">
    </el-table-column>
    <el-table-column
        prop="category"
        label="category"
        width="100">

    </el-table-column>
    <el-table-column
        prop="amount"
        label="amount"
        width="150"
    >
    </el-table-column>
    <el-table-column
        prop="label"
        label="label"
        width="100"
    >
    </el-table-column>

    <el-table-column
        label="txid"
        width="350px">
      <template slot-scope="scope">
        <router-link :to="'/transaction?hash='+scope.row.txid">{{scope.row.txid.substr(0,32)}}...</router-link>

      </template>
    </el-table-column>
  </el-table>
  </div>
</template>
<script>


export default {
  data() {
    return {
      transactions:[],
      walletname:'',
    };
  },
  methods: {

    init(){
      this.walletname=this.$route.params.walletname==undefined ? '' : this.$route.params.walletname;

      this.rpccall('listtransactions',[],'/wallet/'+this.walletname).then(ret=>{
        console.log(ret);
        this.transactions=ret.data.result;

      });


    },
  },
  mounted() {
    this.init();

  }
}
</script>
<style>

</style>
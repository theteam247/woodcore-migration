<template>
  <div style="text-align: center">
    <div style="width: 900px;text-align: left;display: inline-block">
  <el-button @click="createnewaddress" size="small">getnewaddress</el-button>
    </div>
  <el-table style="display: inline-block;width: auto"
      :data="addresses"
      >
    <el-table-column
        prop="address"
        label="address"
        width="500">
    </el-table-column>
    <el-table-column
        prop="amount"
        label="amount"
        width="200">

    </el-table-column>

    <el-table-column
        prop="label"
        label="label"
        width="100"
    >
    </el-table-column>

    <el-table-column

        label="operation"
        width="100">
      <template slot-scope="scope">
        <el-button @click="dumpprivkey(scope.row)" type="text" size="small">dumpprivkey</el-button>

      </template>
    </el-table-column>
  </el-table>
  </div>
</template>
<script>


export default {
  data() {
    return {
      addresses:[],
      walletname:'',
    };
  },
  methods: {
    createnewaddress(){
      this.rpc.getNewAddress().then(ret=>{

      this.addresses.unshift({address:ret,amount:0,label:''})

      });
    },
    dumpprivkey(row){
      this.rpccall('dumpprivkey',[row.address],'/wallet/'+this.walletname).then(ret=>{
        console.log('privatekey!');
        this.copy(ret.data.result,"privkey has been copy to clipbord");

      });
    },
    init(){
      this.walletname=this.$route.params.walletname==undefined ? '' : this.$route.params.walletname;

      this.rpccall('listaddressgroupings',[],'/wallet/'+this.walletname).then(ret=>{
        console.log('addresses');

        ret.data.result.forEach((item,i)=>{
          item.forEach((row,j)=>{
            if(row.length>=2){
              console.log('row:',row);
            let tmp={'address':row[0],'amount':row[1],'label':row.length>=3 ? row[2] : ''};
            this.addresses.push(tmp);
            }
          });
        });
        console.log(this.addresses);
      });


    },
  },
  mounted() {
    this.init();

  }
}
</script>

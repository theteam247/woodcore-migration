
<template>
  <div id="app">
    <el-dialog
        title="import privatekey"
        :visible.sync="importprivatekeyflag"
        width="30%"
        >

      <el-input placeholder="input privatekey" v-model="importprivatekey"></el-input>
      <el-input placeholder="input a label for this address" v-model="importprivatekeylabel"></el-input>
      <span slot="footer" class="dialog-footer">
    <el-button @click="importprivatekeyflag = false">cancle</el-button>
    <el-button type="primary" @click="handleimportprikey">import</el-button>
  </span>
    </el-dialog>
  <div style="text-align: center;margin-top: 50px;">
    <el-input style="width:500px;" v-model="searchinput" placeholder="Search for block, transaction"></el-input><el-button icon="el-icon-search" @click="search">search</el-button>
  </div>

    <div style="text-align: center;margin-top: 30px;">
      <div>
      <el-dropdown style="width:150px;text-align: left" trigger="click" @command="handleCommand">
      <span class="el-dropdown-link">
         file<i class="el-icon-arrow-down el-icon--right"></i>
  </span>
        <el-dropdown-menu slot="dropdown" >
          <el-dropdown-item  command="importprikey">import privkey(address) to current wallet</el-dropdown-item>
<!--          <el-dropdown-item>create new wallet</el-dropdown-item>-->

        </el-dropdown-menu>
      </el-dropdown>

      <el-select id='elwallet' v-model="walletname" placeholder="choose wallet" style="width:150px;height: 25px" @change="setdefaultwallet" v-show="wallets.length>1">
        <el-option
            v-for="item in wallets"
            :key="item"
            :label="item=='' ? 'default wallet': item"
            :value="item">
        </el-option>
      </el-select>
        <span style="width: 150px;display: inline-block;" v-show="wallets.length==1"></span>
    </div>
  </div>
    <div style="text-align: center;padding-top: 20px;vertical-align: middle;height:50px;" id="menu">
    <router-link :to="'/overview/'+walletname"  >Overview</router-link>
    <router-link :to="'/send/'+walletname"  >Send</router-link>
    <router-link :to="'/receive/'+walletname"  >Receive</router-link>
      <router-link :to="'/addresses/'+walletname"  >Addresses</router-link>
      <router-link :to="'/mytransaction/'+walletname"  >transactions</router-link>
    <router-link to="/blocks"  >Blocks</router-link>
    <router-link to="/issueassets/"  >IssueAssets</router-link>
      <router-link to="/sendassets/"  >SendAssets</router-link>
      <router-link to="/myassets/"  >MyAssets</router-link>
    </div>
    <router-view ref="routerview"></router-view>

  </div>
</template>

<script>
import Cookies from "js-cookie";

export default {

	 data() {
	      return {
          importprivatekeyflag:false,
          importprivatekeylabel:'',
          importprivatekey:'',
          walletname:'',
          searchinput:'',
          wallets:[],

	      };
	    },
  mounted() {
    this.loadwallet();

  },
  methods: {
	   handleCommand(command){
	     console.log('command',command);
        if (command=='importprikey'){
        this.importprivatekeyflag= true;
        }
     },
	   handleimportprikey(){
       this.importprivatekeyflag = false;
       console.log(this.importprivatekey);
       this.rpccall('importprivkey',[this.importprivatekey,this.importprivatekeylabel,true],'/wallet/'+this.walletname).then(
           ret=>{
             console.log(ret);
           }
       );

     },
    setdefaultwallet(v){
      Cookies.set('walletname', v);

      let tmppath=this.$route.matched[0].path.replace(':walletname?',v);
      console.log(this.$route);
      console.log(this.$route.path);
      console.log(tmppath);
      if(tmppath!=this.$route.path){
        this.$router.push({path:tmppath});
      this.$refs.routerview.init();
      }



    },
    search(){
      if(this.searchinput.length<64){
        //this.rpccall("")
      }else{
        try {
          this.rpc.getBlockFromHash(this.searchinput.trim()).then(ret => {
            //console.log('reusltsarch');
           // console.log(ret);
            this.$router.push('/block/?hash='+this.searchinput.trim());

            this.searchinput='';
          });
        }catch (e) {

        }
        try{
          this.rpc.getRawTransactionAsObject(this.searchinput.trim()).then(ret=>{this.$router.push('/transaction/?hash='+this.searchinput.trim());});
          this.searchinput='';
        }catch (e) {

        }

      }
    },
    loadwallet(){
      let tmp=Cookies.get("walletname");


      this.rpccall('listwallets').then(ret=>{
        console.log(ret.data.result);
        this.wallets=ret.data.result;
        tmp=  this.wallets.indexOf(tmp)!=-1 ? tmp : '';
        this.walletname=tmp;


      });
    },
  }
}
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;

}
#menu a{
  margin-left: 10px;
}
#elwallet{
  height: 25px;
}
.el-input__suffix{
  top:7px;
}
</style>

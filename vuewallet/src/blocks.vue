  <template>
	<div>

		<el-table style="width: 100%"  :cell-style="rowClass"  :header-cell-style="headClass"
		  @row-click=ondetail
		  :data="tableData"
		  >
		  <el-table-column
			prop="height"
			label="Height"
      width="180"
			>
		  </el-table-column>
		  <el-table-column
			prop="time"
			label="Time"
      width="180"
			>
		  </el-table-column>

		  <el-table-column
			prop="hash"
			label="Hash"
			>
		  </el-table-column>
		  
		  <el-table-column
			prop="Transactions"
			label="Transactions"
      width="180"
			>
				      <template slot-scope="scope">
				        {{scope.row.tx.length}}
				      </template>
		  </el-table-column>
		  <el-table-column
			prop="size"
			label="Size"
      width="180"
			>
		  </el-table-column>
		</el-table>
			<div class="pagination" style="text-align:center">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:page-sizes="[30, 90, 100]"
					:page-size="pagesize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total">
				</el-pagination>
			</div>
	</div>
  </template>

<script>
	
export default {
	 data() {
	      return {
	        tableData: [],
			currentPage:1,
			pagesize:30,
			total:300,	
	      };
	    },
	

  methods: {
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
  	this.pagesize=this.$route.query.pagesize ? this.$route.query.pagesize : 30;
    this.currentPage=this.$route.query.p ? this.$route.query.p : 1;

  	this.rpccall('getblockcount').then(ret=>{
  	  this.total=ret.data.result;
      //this.currentPage=Math.ceil(this.total/this.pagesize)
      this.loadpage();
    });
  }
  
  ,
}
</script>

<style>
</style>

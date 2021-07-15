
exports.install = function (Vue, options) {
    Vue.prototype.getisotime= function(timestamp) {
        try{
        var newDate = new Date();
        newDate.setTime(timestamp * 1000);
        return newDate.toISOString();
        }catch (e) {
            return '';
        }
    }

    Vue.prototype.gettransactionUrl=function(txid){
        return  "/#/transaction?hash="+txid;
    }

    Vue.prototype.rpccall=function(service_name,argsv=[],url=''){
        let args=typeof argsv !== 'undefined' ?  argsv : [];
      let id=new Date().getTime()+parseInt(Math.random()*1000000);
      let postdata={'version':1.1,method:service_name,'params':args,'id':id};

      return this.axios.post(this.SERVICE_URL+url,postdata);
    }
    Vue.prototype.copy=function(data,msg='copy success') {
        let url = data
        let oInput = document.createElement('input')
        oInput.value = url
        document.body.appendChild(oInput)
        oInput.select() // 选择对象
        document.execCommand("Copy") // 执行浏览器复制命令
        this.$message({
            message: msg,
            type: 'success'
        })
        oInput.remove()
    }
};
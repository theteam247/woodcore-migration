whenwoodcoin startup,main process start a rpc thread,listen on the port user defined in the conf file,and alose authed by the username and password user set in the password.woodcoin serves html assets when user access '/webgui/' path. so we can make a gui based on javascript and rpc call.

##### 1.overview menu.

![image-20210730123741247](https://i.loli.net/2021/07/30/rtoR2TOPSBeKMZ5.png)

use the GetBalance rpc call,show uxto of default wallet.

##### 2.send menu

![image-20210730124011167](https://i.loli.net/2021/07/30/PJjZdXlQyqaGxM3.png)

use the SendToAddress rpc call,send coin to a address.

##### 3.receive menu

![image-20210730124230646](https://i.loli.net/2021/07/30/waVDky5AnePMJdO.png)



use the GetNewAddress rpc call, get a new address from wallet's address pool for receiving coin.

##### 4.addresses menu

![image-20210730124536831](https://i.loli.net/2021/07/30/2h4jtDIZ6k7b18A.png)

use the listaddressgroupings rpccall,list the addresses where your coin are stored in. and use DumpPrivKey to copy the address's private key 

to clipbord.

##### 5.transaction menu



![image-20210730125046261](https://i.loli.net/2021/07/30/xuM3ZfiIBHJCqlc.png)

use ListTransactions rpccall. show the detail of recent transaction.

##### 6.blocks menu

![image-20210730125257769](https://i.loli.net/2021/07/30/aStf2eNOGrZDwx8.png)

useGetBlockHash,GetBlock,GetRawTransaction rpc call,show the infomation of blocks,transactions.

##### 7.IssueAssets menu

![image-20210730131050534](https://i.loli.net/2021/07/30/LdZ7mMU9iGn3TSr.png)

send 1 coin to the target address. and in one of transaction output,wirte a mark tag the assets's quantity and metadata.

##### 8.myassets menu

![image-20210730131538800](https://i.loli.net/2021/07/30/w1HBNhvcYis4SMT.png)

use listaddressgroupings rpccall  get all uxto's address,but filter the address which contain the assets tag.



##### 9.sendAssets menu

![image-20210730131821242](https://i.loli.net/2021/07/30/vwuzFiRl5EXVGyH.png)

send 1 coin to the targetaddress. and wirte assetid,quantity in the one of transaction's output.

##### 10.colored coin protocol.

we use javascript implement the protocol of open-assets-protocol(https://github.com/OpenAssets/open-assets-protocol )

you can visit the link to read more details.








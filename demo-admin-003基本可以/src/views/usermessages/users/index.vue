<template>
  <div style="padding:30px;">
    <el-row>
      <el-button type="primary" plain @click="handleAdd()">添加用户</el-button>
    </el-row>
    <el-table
      :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%"
    >
      <el-table-column label="ID" type="index" width="50"></el-table-column>
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="所属角色" prop="relationship"></el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="输入关键字搜索" class="searchstyle" />
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="paginations.pagesize"
        :page-sizes="[3, 10, 50, 100]"
        :current-page="paginations.currentPage"
        :total="paginations.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <el-dialog :title="formTitleValue==='edit'?'编辑用户':'添加用户'" :visible.sync="dialogFormVisible" :width="DialogWidth">
      <el-form :model="onlyUserInfo" :label-width="formLabelWidth">
        <el-form-item label="用户名：" >
          <el-input v-model="onlyUserInfo.name" label-width="50px" class="usernamestyle"></el-input>
        </el-form-item>
        <el-form-item label="密码：" >
          <el-input v-model="onlyUserInfo.password" class="passwordstyle"></el-input>
        </el-form-item>
        <el-form-item label="角色名称：" >
        <el-select v-model="onlyUserInfo.roles"   placeholder="请选择活动区域" class="selectstyle">
          <el-option  :key="index" v-for="(selectname,index) in rolenames" :label="selectname.rolename" :value="selectname.rolename">
          </el-option>
        </el-select>
      </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addUserInfo, getUserApi, deleteUserApi,editUserInfo } from "@/api/usermessages.js";
import { stringify } from "querystring";
import store from "@/store";
import Layout from '@/layout';
import path from "path";
import router from "@/router"
const defaultAddData = {
  name: "",
  password: "",
  roles:"",
};

const tableDataOnly = [];

export default {
  inject: ["reload"],
  data() {
    return {
      rolenames:[],
      search: "",
      formTitleValue:"New",
      tableData: [],
      paginations: {
        pagesize: 3,
        currentPage: 1,
        total: 100,
        searchMap: {}
      },
      dialogFormVisible: false,
      formLabelWidth: "100px",
      DialogWidth: "400px",
      onlyUserInfo: Object.assign({}, defaultAddData)
    };
  },
  methods: {
    //编辑用户
    handleEdit(index, row) {

      // console.log(index, row);
      editUserInfo(row.id).then(response=>{
        this.onlyUserInfo = Object.assign({}, defaultAddData);
        this.formTitleValue="edit";
        this.dialogFormVisible=true;
        this.onlyUserInfo.name=row.username;
        this.onlyUserInfo.roles=response.rolename;
        // console.log('response',response)
      })
    },
    //删除用户
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteUserApi(row.id).then(res => {
            this.paginations.total -= 1;
            this.getUserInfo();
            this.$message({
              type: "success",
              message: "删除成功!",
              duration: 1000
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除!",
            duration: 1000
          });
        });
    },
    //添加用户
    handleAdd() {
      this.onlyUserInfo = Object.assign({}, defaultAddData);
      this.dialogFormVisible = true;
      this.formTitleValue="New";
    },
    //确定认后送出
    confirm() {
      console.log('onlyUserInfo.roles',this.onlyUserInfo.roles)
      let newForm = new FormData();
      let data = {
        name: this.onlyUserInfo.name,
        password: this.onlyUserInfo.password,
        rolename:this.onlyUserInfo.roles
      };
      newForm.append("data", JSON.stringify(data));
      addUserInfo(newForm).then(res => {
        // console.log("res", res);
        let code = parseInt(res.code);
        if (res.code === 200) {
          this.dialogFormVisible = false;
          this.paginations.total += 1;
          this.getUserInfo();
          this.$message({
            message: "添加成功",
            type: "success",
            duration: 1000
          });
        }
      });
    },
    //页面返回的数据拼接
    ceshiData(data,basePath="/"){
      let allData=[]
      for(let temp of data){
        if(temp.ismenu !== true){continue}
        const tempUrl1=temp.url.substring(0,1)
        const tempUrl=null
        if (tempUrl1==="/"){
          tempUrl=temp.url.substring(1)
        }else{
          tempUrl=temp.url
        }
        let tempPath=path.resolve(basePath,tempUrl)
        let dict1={
          meta:{title:temp.title,icon:temp.icon}          
        }
        if (temp.level===1){
          dict1.path=temp.url
          dict1.component=Layout
        }else{
          dict1.path=temp.url.substring(1)
          console.log('tempath',tempPath)
          dict1.component=()=>import(`@/views${tempPath}`)
          // dict1.component=resolve => require([`@/views${tempPath}`],resolve)
          // console.log("888",dict1.component)
        }
        if(temp.children&&temp.children.length>=1){
          if(temp.children.length===1){
            let subPath=tempPath+temp.children[0].url
            dict1.redirect=subPath
          }
          dict1.children=this.ceshiData(temp.children,tempPath)
        }
        allData.push(dict1)
      }
      // console.log('alldata',allData)
      return allData
    },
    //页面加载后获取信息
    getUserInfo() {
      let paginationCtrol =
        this.paginations.total ===
        (this.paginations.currentPage - 1) * this.paginations.pagesize;
      if (paginationCtrol && this.paginations.total !== 0) {
        this.paginations.currentPage -= 1;
      }
      const page = this.paginations.currentPage;
      const size = this.paginations.pagesize;
      const searchmap = this.paginations.searchMap;
      getUserApi(page, size, searchmap).then(response => {
        // console.log('response.ceshi',response.ceshi)
        // let showUlr=this.ceshiData(response.ceshi)
        // console.log('showurl',showUlr)
        // let bbkk={}
        // bbkk.path="/sources"
        // bbkk.component=()=>import(`@/views/sources/sourcedata`)
        // let ccbb=[bbkk]
        // router.addRoutes(showUlr)
        // console.log(response.ceshi,'23123213')
        // let aacc="menu2"
        // let aaDict={
        //   component:resolve => require([`@/views/nested/${aacc}`],resolve)
        // }
        // console.log(aaDict)
        const res = response.data;
        this.tableData = res;
        this.paginations.total = response.total;
        // console.log(response.rolelist,'response.rolelist')
        // console.log(typeof(response.rolelist),'response.rolelist')
        this.rolenames=response.rolelist;
      });
      // if((this.pageval-1)*this.pagesize){}
      // let tempNum =
      //   parseInt(store.getters.totalcountget) <= parseInt(this.pagesize);
      // await store.dispatch("usermessages/getUserApiStore", {
      //   val: tempNum ? 1 : this.pageval,
      //   size: this.pagesize
      // });
      // this.updateUserInfo();
    },
    //当前页变动，自动更新数据
    handleCurrentChange(val) {
      this.paginations.currentPage = val;
      this.getUserInfo();
    },
    //页面范围变动，自动更新数据
    handleSizeChange(size) {
      this.paginations.pagesize = size;
      this.getUserInfo();
    },
    updateUserInfo() {
      this.tableData = Object.assign([], tableDataOnly);
      this.tableData = store.getters.alluserinfoone;
      this.totalcount = store.getters.totalcountget;
    }
  },
  //页面加载前获取信息
  created: function() {
    this.getUserInfo();
  }
};
</script>

<style scoped >
.block {
  text-align: center;
  padding-top: 19px;
}

.usernamestyle,.passwordstyle,.selectstyle {
  width: 250px
}

.searchstyle.el-input.el-input--mini /deep/ input {
  height: 35px;
  line-height: 35px;}


</style>>


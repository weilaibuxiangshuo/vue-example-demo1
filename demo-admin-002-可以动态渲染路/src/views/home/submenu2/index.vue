<template>
  <div>
    <el-button type="primary" @click="dialogVisible = true">点击打开 Dialog</el-button>
    <el-button type="primary" size="small" @click="handleEdit()">Edit</el-button>
    <el-button type="primary" size="small" @click="handleceshi()">测试</el-button>
    <el-button type="primary" size="small" @click="handlewww()">看数据</el-button>
    <el-button type="primary" showname="edit" size="small" @click="handleceshi()" v-has>测试2</el-button>

    <el-dialog
      :title="dialogType==='edit'?'Edit Role':'New Role'"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="Menus">
          <el-tree
            :data="routesData"
            show-checkbox
            :check-strictly="checkStrictly"
            node-key="path"
            ref="tree"
            highlight-current
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- <el-tree
      :data="routesData"
      show-checkbox
      default-expand-all
      node-key="id"
      ref="tree"
      highlight-current
      :props="defaultProps"
    ></el-tree>-->
  </div>
</template>


<script>
// import { on } from 'cluster';
import path, { parse } from "path";
import Cookies from "js-cookie";
const defaultRole = {
  key: "",
  name: "",
  description: "",
  routes: []
};

export default {
  inject: ['reload'],
  data() {
    return {
      role: Object.assign({}, defaultRole),
      serviceRoutes: null,
      dialogType: "new",
      dialogVisible: false,
      checkStrictly: false,
      alldata: "",
      showRes: [],
      routes: [],
      defaultProps: {
        children: "children",
        label: "title"
      }
    };
  },
  computed: {
    routesData() {
      return this.routes;
    }
  },
  created() {
    this.getRoutes();
  },
  methods: {
    getRoutes() {
      const res = this.$store.getters.routers;
      // localStorage.setItem('serviceRoutes',JSON.stringify(res));
      console.log("页面拿回来的路由", res);
      const allRouteShow = this.deepClone(res);
      this.serviceRoutes=allRouteShow
      console.log("页面拿回来的路由2", this.serviceRoutes);
      this.routes = this.generateRoutes(allRouteShow);
    },
    deepClone(source){
      // console.log('source',source)
      // if(source){
      const targetObj=Array.isArray(source)?[]:{}
      // console.log('targetObj',targetObj)
      Object.keys(source).forEach(keys=>{
        if(source[keys]&& typeof(source[keys])==='object'){
          targetObj[keys]=this.deepClone(source[keys])
        }else{
          targetObj[keys]=source[keys]
        }
      })
      return targetObj
    },    
    handlewww() {
      // let a={name:'999'},
      //     b=a;
      // console.log(a===b);
      // b["name"]="8888";
      // console.log(a,b);
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      console.log("999999999999", this.routes);
      this.$nextTick(() => {
      this.$refs.tree.setCheckedNodes(this.routes)
      this.checkStrictly = false
      })
    },
    // handleClose(done) {
    //   this.$confirm("确认关闭？")
    //     .then(_ => {
    //       done();
    //     })
    //     .catch(_ => {});
    // },
    generateRoutes(routes, basePath = "/") {
      let res = [];
      for (let route of routes) {
        // console.log(route,'查看明细')
        if (route.hidden) {
          continue;
        }
        const onlyOneShowingChild = this.onlyOneShowingChild(
          route.children,
          route
        );
        if (route.children && onlyOneShowingChild) {
          route = onlyOneShowingChild;
          // console.log('onlyOneChildmm',onlyOneChildmm)
        }
        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title
        };
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path);
        }
        if (
          route.meta &&
          route.meta.btnPermissions &&
          route.meta.btnPermissions.length > 0
        ) {
          let btnData = [];
          route.meta.btnPermissions.forEach(btnroute => {
            let subbtnroute = {
              path: path.resolve(data.path, btnroute),
              title: btnroute
            };
            btnData.push(subbtnroute);
          });
          // console.log("btnData", btnData);
          data.children = btnData;
        }
        res.push(data);
      }
      // console.log('res最终成形',res)
      return res;
    },
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null;
      if (children.length === 1) {
        onlyOneChild = children[0];
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path);
        return onlyOneChild;
      }
      return false;
    },
    setCheckedKeys() {
      this.dialogVisible = false;
      // this.$refs.tree.setCheckedKeys(['/nested']);
    },
    handleceshi() {
      this.dialogVisible = true;
      this.checkStrictly = true;
      let thisroleroutes=JSON.parse(localStorage.getItem('thisroleroutes'))
      console.log("this.role.rou", thisroleroutes);
      let showcallbackdata=this.deepClone(thisroleroutes)
      console.log('showcallbackdata',showcallbackdata)
      let showdatamenu=this.generateArr(showcallbackdata)
      console.log('showdatamenu',showdatamenu)
      this.$nextTick(() => {
        this.$refs.tree.setCheckedNodes(showdatamenu);
        this.checkStrictly = false;
      });
    },
    generateArr(routes, basePath = "/") {
      let data = [];
      routes.forEach(route => {
        console.log("进入后route", route);
        let newpath = path.resolve(basePath, route.path);
        console.log("newpath", newpath);
        if (route.children) {
          const temp = this.generateArr(route.children, newpath);
          if (temp.length > 0) {
            data = [...data, ...temp];
          }
        }
        route.path=newpath
        data.push(route);
      });
      // console.log('data',data)
      return data;
    },
    handleEdit() {
      this.dialogVisible = true;
    },
    confirmRole() {
      const isEdit = this.dialogType === "edit";
      console.log("99999999999988", this.serviceRoutes);
      const checkedKeysone = this.$refs.tree.getCheckedKeys();
      const checkhalfkeystwo = this.$refs.tree.getHalfCheckedKeys();
      let checkedKeys = checkedKeysone.concat(checkhalfkeystwo);
      console.log("checkedKeys", checkedKeys);
      let treeshowdata=this.deepClone(this.serviceRoutes)
      this.role.routes = this.ceshidata(treeshowdata,"/",checkedKeys);
      console.log('role.routes',this.role.routes)
      localStorage.setItem('thisroleroutes',JSON.stringify(this.role.routes))
      this.dialogVisible = false
      // this.reload()
    },

    ceshidata(routes,basePath="/",checkedKeys){
      console.log('传递进来的routes',routes)
      const res=[]
      for (let route of routes){
        const resPath=path.resolve(basePath,route.path)
        if(route.children){
          route.children=this.ceshidata(route.children,resPath,checkedKeys)
        }
        // console.log('respath',resPath)
        // res.push(route)
        if(route.meta&&route.meta.btnPermissions&&route.meta.btnPermissions.length>0){
          let data=[]
          for(let temp of route.meta.btnPermissions){
            const subresPath=path.resolve(resPath,temp)
            let tmp={
              path:subresPath,
              title:temp
            }
            data.push(tmp)
          }
          // route.children=data
          route.children=this.ceshidata(data,resPath,checkedKeys)
        }
        if(checkedKeys.includes(resPath)|| (route.children && route.children.length >= 1)){
          // console.log('真',resPath)
          // data.push(route)
          res.push(route)
        }
      }
      return res
    },
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
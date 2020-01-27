<template>
  <div style="padding:30px;">
    <el-row>
      <el-button type="primary" plain @click="handleAddRole('roleRuleForm')">添加角色</el-button>
    </el-row>
    <template>
      <el-table
        :data="roletableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%"
      >
        <el-table-column label="ID" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="name"></el-table-column>
        <el-table-column align="right">
          <template slot="header" slot-scope="scope">
            <el-input v-model="search" size="mini" placeholder="输入关键字搜索" class="searchstyle" />
          </template>
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">权限编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-dialog
      :title="dialogtype==='edit'?'编辑角色':'添加角色'"
      :visible.sync="dialogFormVisibleRole"
      :width="DialogWidthRole"
      :before-close="dialogRoleClose"
    >
      <el-form :model="formRole" :rules="rules" ref="roleRuleForm">
        <el-form-item label="角色名称" :label-width="formLabelWidthRole" prop="name">
          <el-input v-model="formRole.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色权限" :label-width="formLabelWidthRole">
          <el-tree
            :data="data"
            show-checkbox
            node-key="path"
            ref="tree"
            highlight-current
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRoleClose">取 消</el-button>
        <el-button type="primary" @click="confilmRole('roleRuleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paginations.currentPage"
        :page-sizes="[3, 20, 50, 100]"
        :page-size="paginations.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paginations.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { deepcloneRole } from "./userpublic.js";
import store from "@/store";
import path from "path";
import {
  roleControlApi,
  getroleinfoApi,
  getRoleEditApi,
  deleteRoleEditApi
} from "@/api/usermessages.js";

const defaultFormRole = {
  name: ""
};

const defroletableData = [];

const defaultdata = [];

export default {
  data() {
    var validateName = (rule, value, callback) => {
      let valueStr = String(value);
      if (valueStr.trim() === "") {
        callback(new Error("内容不能为空"));
      } else {
        callback();
      }
    };
    return {
      formRole: Object.assign({}, defaultFormRole),
      dialogtype: "New Role",
      paginations: {
        currentPage: 1,
        pagesize: 3,
        total: 100,
        searchMap: { a: 1 }
      },
      DialogWidthRole: "450px",
      formLabelWidthRole: "85px",
      dialogFormVisibleRole: false,
      roletableData: Object.assign([], defroletableData),
      search: "",
      data: Object.assign([], defaultdata),
      defaultProps: {
        children: "children",
        label: "title"
      },
      routes: [],
      isChildren: "",
      rules: {
        name: [{ validator: validateName, trigger: "blur" }]
      }
    };
  },
  methods: {
    //编辑权限
    handleEdit(index, row) {
      // console.log(index, row, row.id);
      this.dialogtype = "edit";
      let _newform = new FormData();
      _newform["id"] = row.id;
      getRoleEditApi(_newform).then(response => {
        let editRoleRoutes = deepcloneRole(this.routes);
        this.data = Object.assign([], defaultdata);
        this.data = this.generatorRole(editRoleRoutes);
        // const res = eval("(" + response.data + ")");
        const res = eval(response.data);
        // console.log('res',res)
        // console.log('res',typeof(res))
        this.formRole.name = row.name;
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(res);
        });
        this.dialogFormVisibleRole = true;
      });
    },
    //删除角色
    async handleDelete(index, row) {
      // console.log(index, row);
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteRoleEditApi(row.id).then(response => {
            this.paginations.total = parseInt(this.paginations.total) - 1;
            this.getRoleListData();
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
    //添加角色
    handleAddRole(roleRuleForm) {
      this.formRole = Object.assign({}, defaultFormRole);
      // this.$nextTick(() => {
      //   this.$refs[roleRuleForm].resetFields();
      // });
      this.dialogRoleClose();
      this.dialogFormVisibleRole = true;
      let newRoleRoutes = deepcloneRole(this.routes);
      let kkk = this.generatorRole(newRoleRoutes);
      this.data = kkk;
    },
    //清除输入框以及树形的选中项
    dialogRoleClose(done) {
      this.formRole = Object.assign({}, defaultFormRole);
      this.dialogFormVisibleRole = false;
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys([]);
      });
      console.log("关闭中");
    },
    //tree树结构的生成
    generatorRole(routes, basePath = "/") {
      const res = [];
      for (let route of routes) {
        if (route.hidden) {
          continue;
        }
        if (route.children && route.children.length <= 1) {
          route = this.onlyOneChildrenFunc(route.children, route);
        }
        let _roleDict = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title
        };
        if (route.children) {
          // console.log('route.children',route.children)
          _roleDict.children = this.generatorRole(route.children, route.path);
        }
        res.push(_roleDict);
      }
      return res;
    },
    //判断路由下面是否有一个子路由或者没有，如果只有一个tree中直接拼接它为路径
    onlyOneChildrenFunc(oneroutes, parent) {
      let oneChildren = null;
      if (oneroutes.length === 1) {
        oneChildren = oneroutes[0];
        oneChildren.path = path.resolve(parent.path, oneChildren.path);
      }
      if (oneroutes.length === 0) {
        oneChildren = { ...parent };
        delete oneChildren.children;
      }
      return oneChildren;
    },
    //确定之后向后台发送数据
    async confilmRole(roleRuleForm) {
      this.$refs[roleRuleForm].validate(valid => {
        if (valid) {
          this.dialogFormVisibleRole = false;
          let conFilemRoutes = deepcloneRole(this.routes);
          let getRouteList = this.$refs.tree.getCheckedKeys();
          // console.log("getRouteList", getRouteList);
          let basePath = "/";
          let temp_p = this.filterRoleRouters(
            conFilemRoutes,
            basePath,
            getRouteList
          );
          let data = JSON.stringify({
            rolename: this.formRole.name,
            rolepermiss: getRouteList
          });
          roleControlApi(data);
          this.dialogRoleClose();
          this.paginations.total = parseInt(this.paginations.total) + 1;
          this.getRoleListData();
        } else {
          return false;
        }
      });
    },
    //执行用户选择路由跟系统路由匹配生成新路由
    filterRoleRouters(conFilemRoutes, basePath, getRouteList) {
      const dataRoutes = [];
      for (let route of conFilemRoutes) {
        if (route.hidden) {
          continue;
        }
        const routePath = path.resolve(basePath, route.path);
        const data = route;
        if (route.children) {
          data.children = this.filterRoleRouters(
            route.children,
            (basePath = routePath),
            getRouteList
          );
        }

        if (
          getRouteList.includes(routePath) ||
          (data.children && data.children.length > 0)
        ) {
          dataRoutes.push(data);
        }
      }
      return dataRoutes;
    },
    //首次进入请求
    async getRoleListData() {
      //如果总数等于页码倍数，当前页自动跳上一页
      if (
        this.paginations.total ==
          (this.paginations.currentPage - 1) * this.paginations.pagesize &&
        this.paginations.total != 0
      ) {
        this.paginations.currentPage -= 1;
      }
      const page = this.paginations.currentPage;
      const size = this.paginations.pagesize;
      const searchItems = this.paginations.searchMap;
      let newform = new FormData();
      Object.keys(searchItems).forEach(item => {
        newform[item] = searchItems[item];
      });
      await getroleinfoApi(page, size, newform).then(response => {
        // console.log(response,'99');
        this.roletableData = Object.assign([], defroletableData);
        this.roletableData = response.data;
        this.paginations.total = response.total;
      });
    },
    //每页显示条数改变
    handleSizeChange(val) {
      this.paginations.pagesize = val;
      this.getRoleListData();
    },
    //当前前往的页面
    handleCurrentChange(val) {
      this.paginations.currentPage = val;
      this.getRoleListData();
    }
  },
  //页面加载前数据获取
  created() {
    this.getRoleListData();
    this.routes = store.getters.newrouters;
  }
};
</script>

<style scoped>
.el-tree.el-tree--highlight-current {
  padding-top: 8px;
}

.block {
  text-align: center;
  padding-top: 19px;
}

.searchstyle.el-input.el-input--mini /deep/ input {
  height: 35px;
  line-height: 35px;}
</style>
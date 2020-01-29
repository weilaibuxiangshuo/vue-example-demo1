<template>
  <div>
    <el-row></el-row>

    <!-- Form -->
    <el-button type="primary" @click="btnControl">主要按钮</el-button>
    <el-button type="primary" @click="ceshi">测试专用</el-button>
    <el-dialog title="添加菜单" :visible.sync="dialogFormVisible" :width="dialogwidth">
      <el-form :model="form">
        <el-form-item label="菜单名称" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" :label-width="formLabelWidth">
          <el-input v-model="form.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单地址" :label-width="formLabelWidth">
          <el-input v-model="form.path" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单顺序" :label-width="formLabelWidth">
          <el-input v-model="form.order" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" :label-width="formLabelWidth">
          <el-select v-model="form.parent" placeholder="请选择活动区域">
            <el-option label="父类菜单" :value="defaultSelect"></el-option>
            <el-option :label="line.title+line.level" :key="index" v-for="(line,index) in selectData" :value="line.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { addMenuData, getMenuData } from "@/api/subjects";

const menus = {
  title: "",
  icon: "",
  path: "",
  order: null,
  parent: ""
};

export default {
  inject: ["reload"],
  data() {
    return {
      gridData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
      ],
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: Object.assign({}, menus),
      formLabelWidth: "80px",
      dialogwidth: "450px",
      selectData: "",
      defaultSelect:0,
    };
  },
  methods: {
    btnControl() {
      this.form = Object.assign({}, menus);
      this.dialogFormVisible = true;
    },
    confirm() {
      this.dialogFormVisible = false;
      console.log(this.form.title);
      let newForm = new FormData();
      const formData = JSON.stringify({
        title: this.form.title,
        icon: this.form.icon,
        path: this.form.path,
        order: this.form.order,
        parent: this.form.parent
      });
      newForm.append("data", formData);
      addMenuData(newForm).then(response => {
        console.log(response);
        // this.reload();
        // window.location.reload()
      });
    },
    getMenuAllData() {
      let allData = getMenuData().then(response => {
        console.log(response);
        let dataList = this.filterData(response.data);
        console.log("klkl", dataList);
        this.selectData=dataList
        // this.form.parent=dataList
        // console.log('父类',this.form.parent)
      });
    },
    filterData(data,baseLevel=0) {
      let list1 = [];
      for (let temp of data) {
        let _level = baseLevel+1
        let list2 = [];
        if (temp.submenu && temp.submenu.length > 0) {
        //   console.log("有没有执行");
          list2 = this.filterData(temp.submenu,_level);
        }
        temp['level'] = "  "+_level+" 级"
        list1.push(temp, ...list2);
      }
      return list1;
    },
    ceshi(){
        this.dialogFormVisible = true;
        // this.form.parent=0
    }
  },
  created() {
    this.getMenuAllData();
  }
};
</script>
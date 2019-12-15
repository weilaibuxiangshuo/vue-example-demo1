<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <div>
      <button @click="temptest()">点击测试</button>
    </div>
    <input type="text" placeholder="你打算做什么" class="new-todo" />
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="用户管理" name="first">
        <alltext />
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import alltext from './subdashboard/alltext'
export default {
  name: "Dashboard",
  data() {
    return {
      activeName: "first"
    };
  },
  methods: {
    temptest() {
      let test1 = ["1"];
      console.log(...test1, "test1");
    },
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },
  computed: {
    ...mapGetters(["name"]),
  },
  components:{
    alltext,
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.new-todo {
  width: 300px;
  height: 35px;
  font-size: 18px;
}
</style>

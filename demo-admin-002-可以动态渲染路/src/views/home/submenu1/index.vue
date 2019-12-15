<template>
  <div style="padding:30px;">
    <el-alert :closable="false" title="menu 2" />
    <el-form
      :label-position="labelPosition"
      label-width="80px"
      :model="defaultruleForm"
      ref="ruleForm"
    >
      <el-row :gutter="20">
        <el-col style="float:left">
          <div class="grid-content bg-purple">
            <el-form-item label="路径" prop="path">
              <el-input v-model="defaultruleForm.path"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input v-model="defaultruleForm.name" ></el-input>
            </el-form-item>
            <el-form-item label="组件" prop="component">
              <el-input v-model="defaultruleForm.component" ></el-input>
            </el-form-item>
            <el-form-item label="跳转" prop="redirect">
              <el-input v-model="defaultruleForm.redirect" ></el-input>
            </el-form-item>
            <el-form-item label="标签" prop="meta">
              <el-input v-model="defaultruleForm.meta" ></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col>
          <div class="grid-content bg-purple"></div>
        </el-col>
      </el-row>
      <el-form-item size="large">
        <el-button type="primary" @click.prevent="submitFrom">立即创建</el-button>
        <el-button @click.prevent="restartForm('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import request from '@/utils/request'
// import { request } from 'http';
export default {
  data() {
    return {
      labelPosition: "right",
      number: 8,
      defaultruleForm: {
        path: "",
        name: "",
        component: "",
        redirect: "",
        meta: ""
      }
    };
  },
  methods: {
    submitFrom() {
      console.log(this.defaultruleForm);
      let formData=new FormData()
      for(var key in this.defaultruleForm){
        formData.append(key,this.defaultruleForm[key])
      }
      console.log('formdata',formData)
      request({
        // url:'http://127.0.0.1:8000/home/',
        url:'/home/',
        method:'post',
        data:JSON.stringify(this.defaultruleForm)
        // data:formData
      }).then(res=>{
        console.log(res)
        let obj=JSON.parse(res.text)
        let listobj=[{
          path:obj.path,
          name:obj.name,
          component:()=>import(`@/views/${obj.component}`)
        }]
        // this.$refs['ruleForm'].resetFields()     
        console.log('map',listobj)
      })
    },
    restartForm(formName){      
      // console.log('allruleForm',this.$refs.ruleForm.resetFields())
      console.log('ruleForm',this.$refs[formName])
      // this.$refs[formName].resetFields();
      
    }
  }
};
</script>

<style lang="" scoped>
</style>
<template>
  <div>
    <el-form :rules="rules" ref="dataForm" :model="form" label-position="left" label-width="70px" >
      <el-form-item :label="$t('user.account')" :label-width="formLabelWidth" prop="account">
        <el-input v-model="form.account" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.name')" :label-width="formLabelWidth" prop="name">
        <el-input v-model="form.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.password')" :label-width="formLabelWidth" prop="password">
        <el-input v-model="form.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.checkPass')" :label-width="formLabelWidth" prop="checkPass">
        <el-input v-model="form.checkPass" auto-complete="off"></el-input>
      </el-form-item>
      <el-transfer v-model="form.roles" :data="roleList"></el-transfer>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close(false)">{{$t('common.cancel')}}</el-button>
      <el-button type="primary" v-if="status==='create'" @click="createUser">{{$t('common.confirm')}}</el-button>
      <el-button type="primary" v-if="status==='edit'" @click="editUser">{{$t('common.confirm')}}</el-button>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    id: String | Number,
    status: String
  },
  data () {
    const validatePass = (rule, value, callback) => {
      console.log("rule",rule)
      if (value === '') {
        callback(new Error(this.$t('validation.pass') + this.$t(rule.field)))
      } else {
        if (this.form.checkPass !== '') {
          this.$refs.dataForm.validateField('checkPass')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('validation.checkPass')))
      } else if (value !== this.form.password) {
        callback(new Error(this.$t('validation.passDiff')))
      } else {
        callback()
      }
    }
    return {
      form: {
        account: '',
        name: '',
        password: '',
        checkPass: '',
        roles: []
      },
      roleList: [],
      rules: {
        account: [
          {required: true, message: this.$t('validation.require') + this.$t('common.space') + this.$t('user.account')},
          {min: 3, max: 12, message: '3-12' + this.$t('validation.characters')}
        ],
        name: [
          {required: true, message: this.$t('validation.require') + this.$t('common.space') + this.$t('user.name')},
          {min: 3, max: 12, message: '3-12' + this.$t('validation.characters')}
        ],
        password: [
          {validator: validatePass, trigger: 'blur'}
        ],
        checkPass: [
          {validator: validatePass2, trigger: 'blur'}
        ]
      },
      formLabelWidth: '120px'
    }
  },
  created(){
    this.resetForm();
    // 如果dialog没有销毁掉, 需要重设数据校验
    /*
     this.$nextTick(() => {
     this.$refs['dataForm'].clearValidate()
     })
     */

    // 判断类型
    if(this.status === 'edit'){
      this.getForm(this.id).then(() => {
        this.getRoleList();
      })
    }else{
      this.getRoleList();
    }

  },
  methods: {
    resetForm () {
      this.form = {
        name: '',
        account: ''
      }
    },
    getRoleList () {
      return this.$store.dispatch('role/getListAll').then((res) => {
        this.$formatMessage(res, '获取角色列表', this.$showErrorType.none);
        this.roleList = []
        res.result.result.forEach((item) => {
          this.roleList.push({
            key: item.id.toString(),
            label: item.name
          })
        })
      })
    },
    getForm (id) {
      return this.$store.dispatch('user/getDetail', id).then((res) => {
        this.form = res.result || {};
        this.$formatMessage(res, '获取用户详情');
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        return Promise.resolve();
      }, () => {
        return Promise.reject();
      })
    },


    createUser () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const params = {
            name: this.form.name,
            account: this.form.account,
            password: this.form.password,
            roles: this.form.roles
          }
          this.$store.dispatch('user/create', params).then((res) => {
            this.$formatMessage(res, '创建用户');
            this.close(true);
          })
        }
      })
    },
    editUser () {
      this.$refs['dataForm'].validate((valid) => {
        console.log(this.form.roles)
        if (valid) {
          const params = {
            name: this.form.name,
            account: this.form.account,
            password: this.form.password,
            roles: this.form.roles
          }
          this.$store.dispatch('user/update', {id: this.form.id, params}).then((res) => {
            this.$formatMessage(res, '编辑用户');
            this.close(true);
          })
        }
      })
    },
    close (fresh) {
      this.$emit('close', fresh)
    }
  }
}
</script>

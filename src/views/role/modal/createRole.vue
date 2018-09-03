<template>
    <div>
        <el-form :rules="rules" ref="dataForm" :model="form" label-position="left" label-width="120px">
            <el-form-item :label="$t('role.name')" prop="name">
                <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>
            <role-resource :allows="form.allows"></role-resource>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close(false)">{{$t('common.cancel')}}</el-button>
            <el-button type="primary" v-if="status==='create'" @click="createRole">{{$t('common.confirm')}}</el-button>
            <el-button type="primary" v-if="status==='edit'" @click="editRole">{{$t('common.confirm')}}</el-button>
        </div>
    </div>
</template>

<script>
    import * as api from '@/services/role'
    import * as api2 from '@/services/resource'
    import roleResource from '../roleResource.vue'
    export default {
        components: {
            roleResource
        },
        props: {
            id: String | Number,
            status: String
        },
        data () {
            return {
                form: {
                    name: '',
                    allows: []
                },
                rules: {
                    name: [
                        {required: true, message: this.$t('validation.require') + this.$t('common.space') + this.$t('role.name')},
                        {min: 3, max: 12, message: '3-12' + this.$t('validation.characters')}
                    ]
                },
                formLabelWidth: '120px'
            }
        },
        created(){
            this.resetForm();
            // 判断类型
            if(this.status === 'edit'){
                this.getForm(this.id).then(() => {})
            }
        },
        methods: {
            resetForm () {
                this.form = {
                    name: '',
                    allows: []
                }
            },
            getForm (id) {
                return this.$doRequest(api.getRole(id), '获取指定角色', this.$showErrorType.none).then((res) => {
                    this.form = res || {}
                    this.$nextTick(() => {
                        this.$refs['dataForm'].clearValidate()
                    })
                })
            },
            createRole () {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        const params = {
                            name: this.form.name,
                            allows: this.form.allows
                        }
                        this.$doRequest(api.addRole(params), '增加角色').then(() => {

                            this.close(true);
                        })
                    }
                })
            },
            editRole () {
                console.log('click')
                this.$refs['dataForm'].validate((valid) => {
                    console.log('valid')
                    if (valid) {
                        const params = {
                            name: this.form.name,
                            allows: this.form.allows
                        }
                        this.$doRequest(api.editRole(this.form.id, params), '编辑角色').then(() => {
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
<template>
    <div>
        <el-form :rules="rules" ref="dataForm" :model="form" label-position="left" label-width="70px" >
            <el-form-item :label="$t('resource.id')" :label-width="formLabelWidth" prop="id">
                <el-input v-model="form.id" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('resource.name')" :label-width="formLabelWidth" prop="name">
                <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close(false)">{{$t('common.cancel')}}</el-button>
            <el-button type="primary" v-if="status==='create'" @click="createResource">{{$t('common.confirm')}}</el-button>
            <el-button type="primary" v-if="status==='edit'" @click="editResource">{{$t('common.confirm')}}</el-button>
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
            return {
                form: {
                    id: '',
                    name: ''
                },
                rules: {
                    id: [
                        {required: true, message: this.$t('validation.require') + this.$t('common.space') + this.$t('resource.id')},
                        {min: 3, max: 12, message: '3-12' + this.$t('validation.characters')}
                    ],
                    name: [
                        {required: true, message: this.$t('validation.require') + this.$t('common.space') + this.$t('resource.name')},
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
                this.getForm(this.id).then(() => {

                })
            }
        },
        methods: {
            resetForm () {
                this.form = {
                    name: '',
                    id: ''
                }
            },
            getForm (id) {
                return this.$store.dispatch('resource/getDetail', id).then((res) => {
                    this.form = res.result || {};
                    this.$formatMessage(res, '获取资源详情');
                    this.$nextTick(() => {
                        this.$refs['dataForm'].clearValidate()
                    })
                    return Promise.resolve();
                }, () => {
                    return Promise.reject();
                })
            },
            createResource () {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        const params = {
                            name: this.form.name,
                            id: this.form.id
                        }
                        this.$store.dispatch('resource/create', params).then((res) => {
                            this.$formatMessage(res, '创建资源');
                            this.close(true);
                        })
                    }
                })
            },
            editResource () {
                this.$refs['dataForm'].validate((valid) => {
                    console.log(this.form.roles)
                    if (valid) {
                        const params = {
                            name: this.form.name,
                            id: this.form.id
                        }
                        this.$store.dispatch('resource/update', {id: this.form.id, params}).then((res) => {
                            this.$formatMessage(res, '编辑资源');
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

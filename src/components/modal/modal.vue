<template>
    <div>
        <el-form :rules="rules" ref="dataForm" :model="form" label-position="left" label-width="70px" >
            <template v-for="ele in elements">
                <!-- 文本类型 -->
                <el-form-item v-if="ele.type==='text'" :key="ele.key" :label="ele.label" :label-width="formLabelWidth" :prop="ele.key">
                    <el-input v-model="form[ele.key]" auto-complete="off" :disabled="ele.disabled ? ele.disabled.includes(status) : false"></el-input>
                </el-form-item>
                <!-- 文本域 -->
                <el-form-item v-if="ele.type==='textarea'" :key="ele.key" :label="ele.label" :label-width="formLabelWidth" :prop="ele.key">
                    <el-input type="textarea" v-model="form[ele.key]" auto-complete="off" :disabled="ele.disabled ? ele.disabled.includes(status) : false"></el-input>
                </el-form-item>
                <!-- 插槽类型 -->
                <template v-if="ele.type==='slot'">
                    <slot :name="ele.slot" v-bind:form="form"></slot>
                </template>
                <!-- 密码定义类型 -->
                <template v-if="ele.type==='pswdDefine'">
                    <el-form-item :key="ele.key + '0'" :label="ele.label" :label-width="formLabelWidth" :prop="ele.key">
                        <el-input v-model="form[ele.key]" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item :key="ele.key + '1'" :label="$t('user.checkPass')" :label-width="formLabelWidth" :prop="ele.key + '_check'">
                        <el-input v-model="form[ele.key + '_check']" auto-complete="off"></el-input>
                    </el-form-item>
                </template>
            </template>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close(false)">{{$t('common.cancel')}}</el-button>
            <el-button type="primary" v-if="status==='create'" @click="create">{{$t('common.confirm')}}</el-button>
            <el-button type="primary" v-if="status==='edit'" @click="edit">{{$t('common.confirm')}}</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            id: String | Number,
            status: String,
            options: Object
        },
        data () {
            let form = {};
            let _pswdDefineDic = {};
            let _pswdDefineRules = {}
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(this.$t('validation.pass') + this.$t(rule.field)))
                } else {
                    if (this.form[this.pswdDefineDic[rule.field]] !== '') {
                        this.$refs.dataForm.validateField(rule.field + '_check')
                    }
                    callback()
                }
            }
            const validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(this.$t('validation.checkPass')))
                } else if (value !== this.form[this.pswdDefineDic[rule.field]]) {
                    callback(new Error(this.$t('validation.passDiff')))
                } else {
                    callback()
                }
            }
            this.options.elements.map((ele) => {
                // 密码定义类型的数据
                if(ele.type==='pswdDefine'){
                    form[ele.key + '_check'] = ele.initValue;
                    _pswdDefineDic[ele.key] = ele.key + '_check';
                    _pswdDefineDic[ele.key + '_check'] = ele.key;
                    _pswdDefineRules[ele.key] = [{validator: validatePass, trigger: 'blur'}];
                    _pswdDefineRules[ele.key + '_check'] = [{validator: validatePass2, trigger: 'blur'}];
                }
                form[ele.key] = ele.initValue;
            })
            return {
                rules: {
                    ...this.options.rules,
                    ..._pswdDefineRules
                },
                pswdDefineDic: _pswdDefineDic,
                formLabelWidth: '120px',
                elements: this.options.elements,
                form: form,
                module: this.options.module
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
                let form = {};
                this.elements.map(function(ele){
                    form[ele.key] = ele.initValue;
                })
                this.form = form;
            },
            getForm (id) {
                return this.$store.dispatch(`${this.module}/getDetail`, id).then((res) => {
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
            create () {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        let params = {};
                        this.elements.map((ele) => {
                            if(!ele.absent || !ele.absent.includes('create')){
                                params[ele.key] = this.form[ele.key];
                            }
                        })
                        this.$store.dispatch(`${this.module}/create`, params).then((res) => {
                            this.$formatMessage(res, '创建资源');
                            this.close(true);
                        })
                    }
                })
            },
            edit () {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        let params = {};
                        this.elements.map((ele) => {
                            if(!ele.absent || !ele.absent.includes('edit')){
                                params[ele.key] = this.form[ele.key];
                            }
                        })
                        this.$store.dispatch(`${this.module}/update`, {id: this.form.id, params}).then((res) => {
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

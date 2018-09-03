<template>
    <div>
        <el-form-item
                v-for="(resource, index) in allows"
                :label="'资源' + index"
                :key="resource.key"
                label-width="120px"
        >
            <el-col :span="8">
                <el-form-item
                        :prop="'allows.' + index + '.resources'"
                        :rules="{
                required: true, message: '资源不能为空', trigger: 'blur'
              }">
                    <el-select v-model="resource.resources" placeholder="选择资源">
                        <el-option
                                v-for="item in resourceOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="1">
                -
            </el-col>
            <el-col :span="8">
                <el-form-item
                        :prop="'allows.' + index + '.permissions'"
                        :rules="{
                required: true, message: '操作不能为空', trigger: 'blur'
              }">
                    <el-select v-model="resource.permissions" multiple  placeholder="选择权限">
                        <el-option
                                v-for="item in operationOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="3">
                -
            </el-col>
            <el-col :span="4">
                <el-form-item>
                    <el-button @click.prevent="removeResource(resource)" style="float:right">删除</el-button>
                </el-form-item>
            </el-col>
        </el-form-item>
        <el-form-item label-width="120px">
            <el-button @click="addResource">新增资源</el-button>
        </el-form-item>
    </div>
</template>

<script>
    import * as api2 from '@/services/resource'
    export default {
        props: {
            allows: Array
        },
        data(){
            return {
                resourceOptions: [],
                operationOptions: [{
                    value: 'show',
                    label: '查看'
                }, {
                    value: 'operate',
                    label: '操作'
                }],
            }
        },
        created(){
            this.getResourceList();
        },
        methods: {
            getResourceList(){
                this.$doRequest(api2.getResourceAll(), '获取资源列表', this.$showErrorType.none).then((res) => {
                    this.resourceOptions = []
                    res.result.forEach((item) => {
                        this.resourceOptions.push({
                            value: item.id,
                            label: item.name
                        })
                    })
                })
            },
            removeResource (item) {
                var index = this.allows.indexOf(item)
                if (index !== -1) {
                    this.allows.splice(index, 1)
                }
            },
            addResource () {
                this.allows.push({
                    resources: '',
                    permissions: [],
                    key: this.$uuid()
                })
            },
        }
    }
</script>
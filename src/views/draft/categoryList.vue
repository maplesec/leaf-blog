<template>
    <el-select v-model="selected" placeholder="请选择分类">
        <el-option
            v-for="item in categoryList"
            :label="item.name"
            :value="item.id"
            :key="item.id">
        </el-option>
    </el-select>
</template>

<script>
    export default {
        model: {
            prop: 'categoryId',
            event: 'change'
        },
        props: {
            categoryId: String
        },
        data(){
            return {
                
            }
        },
        computed: {
            selected: {
                get: function(){
                    return this.categoryId
                },
                set: function(newValue){
                    this.$emit('change', newValue);
                }
            },
            categoryList(){
                return this.$store.state.category.list.data;
            }
        },
        created(){
            this.getCategory()
        },
        methods: {
            getCategory () {
                return this.$store.dispatch('category/getList').then((res) => {
                    this.$formatMessage(res, '获取角色列表', this.$showErrorType.none);
                })
            },
        }
    }
</script>
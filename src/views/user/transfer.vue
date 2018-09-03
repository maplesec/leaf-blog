<template>
    <el-transfer v-model="selected" :data="roleList"></el-transfer>
</template>
<script>
export default {
    model: {
        prop: 'selectprop',
        event: 'change'
    },
    props: {
        selectprop: Array
    },
    data() {
        return {
            roleList: []
        }
    },
    computed: {
        selected: {
            get: function(){
                return this.selectprop;
            },
            set: function(newValue){
                this.$emit('change', newValue);
            }
        }
    },
    created () {
        this.getRoleList();
    },
    methods: {
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
        }
    }
}
</script>

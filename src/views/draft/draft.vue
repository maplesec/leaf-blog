<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="searchValue" style="width: 200px;"></el-input>
      <el-button class="filter-item" @click="handleSearch()" type="promary">搜索</el-button>
      <el-button class="filter-item" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('common.add')}}</el-button>
    </div>

    <el-dialog :title="$t('common.add') + $t('common.space') + $t('resource.resource')" :visible.sync="dialog.dialogVisible" @open="dialog.contentVisible = true" @closed="dialog.contentVisible = false">
      <!--<create-resource v-if="dialog.contentVisible" :status="dialog.status" :id="dialog.id" @close="handleClose"></create-resource>-->
      <modal-custom v-if="dialog.contentVisible" :status="dialog.status" :id="dialog.id" :options="dialog.options" @close="handleClose">
          <template slot-scope="slotProps" slot="selectCategory">
              <!-- <el-select v-model="slotProps.form.category" placeholder="请选择分类">
                  <el-option
                    v-for="item in categoryList"
                    :label="item.name"
                    :value="item.id"
                    :key="item.id">
                </el-option>
              </el-select> -->
              <category-select v-model="slotProps.form.category"></category-select>
          </template>
      </modal-custom>
    </el-dialog>

    <table-custom :module="table.module" :cols="table.cols" :btns="table.btns" @operation="handleOperation"></table-custom>
  </div>

</template>

<script>

    import tableCustom from '../../components/table/table.vue'
    import modalCustom from '../../components/modal/modal.vue'
    import categorySelect from './categoryList.vue'
    const module = 'draft'
    export default {
        components: {
            tableCustom,
            modalCustom,
            categorySelect
        },
        data () {
            return {
                searchValue: '',
                dialog: {
                    dialogVisible: false,
                    contentVisible: false,
                    status: 'create',
                    id: '',
                    options: {
                        rules: {
                            title: [
                                {required: true, message: this.$t('validation.require') + this.$t('common.space') + this.$t('draft.title')},
                                {min: 3, max: 12, message: '3-12' + this.$t('validation.characters')}
                            ]
                        },
                        elements: [
                            {
                                key: 'title',
                                type: 'text',
                                label: this.$t('draft.title'),
                                initValue: ''
                            },
                            {
                                key: 'content',
                                type: 'textarea',
                                label: this.$t('draft.content'),
                                initValue: ''
                            },
                            {
                                key: 'category',
                                type: 'slotoc',
                                label: this.$t('draft.category'),
                                initValue: '',
                                slot: 'selectCategory'
                            }
                        ],
                        module: module
                    }
                },
                table: {
                    module: module,
                    cols: [
                        {
                            prop: 'title',
                            label: this.$t('resource.title'),
                            width: '180',
                            sortable: 'custom'
                        },
                        {
                            prop: 'createTime',
                            label: this.$t('resource.createTime'),
                            width: '180',
                            sortable: 'custom'
                        },
                        {
                            prop: 'lastEditTime',
                            label: this.$t('resource.lastEditTime'),
                            width: '180',
                            sortable: 'custom'
                        },
                    ],
                    btns: [
                        {
                            type: 'edit',
                            name: this.$t('common.edit'),
                            color: 'default'
                        },
                        {
                            type: 'delete',
                            name: this.$t('common.delete'),
                            color: 'danger'
                        }
                    ]
                }
            }
        },
        created () {
            this.initTable();
        },
        asyncData({store}){
            return store.dispatch(`${module}/getList`)
        },
        methods: {
            initTable (isSearch) {
                if (isSearch) {
                    this.$store.dispatch(`${module}/setPagination`, {page: 1});
                }
                this.$store.dispatch(`${module}/getList`).then((e)=>{
                    //TODO: 出错的提示
                    this.$formatMessage(e, '获取用户列表', 'none');
                })
            },
            handleSearch () {
                this.$store.dispatch(`${module}/setPagination`, {filter: this.searchValue});
                this.initTable();
            },
            handleCreate () {
                this.dialog.status = 'create';
                this.dialog.id = '';
                this.dialog.dialogVisible = true
            },
            handleEdit (id) {
                this.dialog.status = 'edit';
                this.dialog.id = id;
                this.dialog.dialogVisible = true
            },
            handleClose (fresh) {
                if (fresh) {
                    this.initTable();
                }
                this.dialog.dialogVisible = false
            },
            handleDelete (id, row) {
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch(`${module}/delete`, id).then(() => {
                        this.initTable()
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    })

                }).catch(() => {
                    // 取消删除
                });
            },
            handleOperation ({type, row}) {
                switch(type){
                    case 'edit':
                        this.handleEdit(row.id);
                        break;
                    case 'delete':
                        this.handleDelete(row.id, row);
                        break;
                }
            }
        }
    }
</script>
<style>
  .demo-dynamic .el-input {
    /*margin-right: 10px;*/
    /*width: 270px;*/
    /*vertical-align: top;*/
  }
</style>

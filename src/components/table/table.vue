<template>
  <div class="app-container calendar-list-container">
    <el-table
      v-loading="loading"
      :data="tableData"
      @sort-change="handleSortChange"
      style="width: 100%">
      <el-table-column v-for="col in cols"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
        :sortable="col.sortable"
        :key="col.prop">
      </el-table-column>
      <el-table-column :label="$t('common.operation')">
        <template slot-scope="scope">
          <el-button v-for="btn in btns"
            size="mini"
            @click="handleOperation(btn.type, scope.row)"
            :type="btn.color"
            :key="btn.type">
            {{btn.name}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.page"
      :page-sizes="[5, 12, 20]"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.totalCount">
    </el-pagination>
  </div>
</template>

<script>

export default {
  props:{
    module: String,
    cols: Array,
    btns: Array
  },
  data () {
    return {
      searchValue: ''
    }
  },
  computed: {
    tableData(){
      return this.$store.state[this.module].list.data;
    },
    loading(){
      return this.$store.state[this.module].list.loading;
    },
    pagination() {
      return this.$store.state[this.module].list.pagination;
    }
  },
  methods: {
    initTable (isSearch) {
      this.$store.dispatch(`${this.module}/getList`).then((e) => {
        //TODO: 出错的提示
        this.$formatMessage(e, '获取用户列表', 'none');
      })
    },
    handleSizeChange (val) {
      this.$store.dispatch(`${this.module}/setPagination`, {pageSize: val});
      this.initTable()
    },
    handleCurrentChange (val) {
      this.$store.dispatch(`${this.module}/setPagination`, {page: val});
      this.initTable()
    },
    handleSortChange (val) {
      this.$store.dispatch(`${this.module}/setPagination`, {sortBy: val.prop});
      if (val.order) {
        this.$store.dispatch(`${this.module}/setPagination`, {sort: val.order === 'ascending' ? 'asc' : 'desc'});
      } else {
        this.$store.dispatch(`${this.module}/setPagination`, {sort: null});
      }
      this.initTable()
    },
    handleOperation(type, row){
        this.$emit('operation', {type, row});
    }
  }
}
</script>

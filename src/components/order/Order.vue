<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表区域 -->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格(元)" prop="order_price" width="120" align="center"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="120" align="center">
          <template slot-scope="scope" width="100" align="center">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="100" align="center"></el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="150" header-align="center">
          <template slot-scope="scope">{{scope.row.create_time | dataFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" prop width="140" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="showProgressBox(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 修改地址的对话框 -->
      <el-dialog
        title="修改地址"
        :visible.sync="addressVisible"
        width="50%"
        @close="addressDialogClosed"
      >
        <el-form
          :model="addressForm"
          :rules="addressFormRules"
          ref="addressFormRef"
          label-width="100px"
        >
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader
              :options="cityData"
              v-model="addressForm.address1"
              :props="addressProps"
              @change="handleChange"
              ref="cascaderRef"
              @expand-change="cascaderClick"
              @visible-change="cascaderClick"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addressVisible = false">取 消</el-button>
          <el-button type="primary" @click="addressVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 展示物流进度的对话框 -->
      <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
        <span>最新地址信息：</span>
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            color="#0bbd87"
            size="large"
            :timestamp="activity.time"
            placement="top"
          >
            <el-card>
              <p>{{activity.context}}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import cityData from './citydata.js'

export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      orderlist: [],
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          {
            required: true,
            message: '请选择省市区/县',
            trigger: 'blur'
          }
        ],
        address2: [
          {
            required: true,
            message: '请填写详细地址',
            trigger: 'blur'
          }
        ]
      },
      /* 中国省市区县数据绑定，ES6：key 值和 value值 变量名一样，可只写一个变量名
      如：cityData : cityData 可写成一个 cityData 绑定数据对象 */
      cityData,
      // 级联选择器的配置对象
      addressProps: {
        expandTrigger: 'hover',
        checkStrictly: false
      },
      progressVisible: false,
      // timeline 时间线组件数据源，物流信息数据
      progressInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表数据失败！')
      }

      this.total = res.data.total
      this.orderlist = res.data.goods
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 展示修改地址的对话框
    showBox() {
      this.addressVisible = true
    },
    /* 级联选择器：当展开节点发生变化时触发
    解决bug：点击圆圈后是自动收起下拉；点击文字label同样实现效果 */
    cascaderClick() {
      const that = this
      setTimeout(function() {
        document.querySelectorAll('.el-cascader-node__label').forEach(el => {
          el.onclick = function() {
            // this.previousElementSibling.click()
            that.$refs.cascaderRef.dropDownVisible = false
          }
        })
        document.querySelectorAll('.el-cascader-panel .el-radio').forEach(el => {
          el.onclick = function() {
            that.$refs.cascaderRef.dropDownVisible = false
          }
        })
      }, 100)
    },
    // 级联选择器 '省市区/县' 选中项变化时，会触发这个函数
    handleChange() {
      // 省市区/县不能只选择第一级省或市，至少要选择区或县，否则直接return
      if (this.addressForm.address1.length < 1) {
        this.addressForm.address1 = []
        return
      }

      const allAddress = this.addressForm.address1.toString() + ',' + this.addressForm.address2

      console.log('地址:', allAddress)
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    async showProgressBox(row) {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')

      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败！')
      }

      this.progressInfo = res.data
      this.progressVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}

.el-timeline {
  margin-top: 15px;
  padding-inline-start: 5px;
  padding-right: 25px;
  height: 430px;
  overflow: auto;
}
</style>

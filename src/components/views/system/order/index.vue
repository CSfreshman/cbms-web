<template>
  <div class="main">
    <Header></Header>
    <el-container class="content">
      <MyMenu></MyMenu>
      <el-main>
        <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="订单号" prop="code">
            <el-input
                v-model="queryParams.code"
                placeholder="请输入订单号"
                clearable
                @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="支付订单号" prop="payCode">
            <el-input
                v-model="queryParams.payCode"
                placeholder="请输入支付订单号"
                clearable
                @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="订单状态" prop="payState">
            <el-input
                v-model="queryParams.payState"
                placeholder="请输入订单状态"
                clearable
                @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input
                v-model="queryParams.phone"
                placeholder="请输入联系电话"
                clearable
                @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="车牌号" prop="carCode">
            <el-input
                v-model="queryParams.carCode"
                placeholder="请输入车牌号"
                clearable
                @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="订单总价格" prop="totalPrice">
            <el-input
                v-model="queryParams.totalPrice"
                placeholder="请输入订单总价格"
                clearable
                @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="订单实际价格" prop="realPrice">
            <el-input
                v-model="queryParams.realPrice"
                placeholder="请输入订单实际价格"
                clearable
                @keyup.enter.native="handleQuery"
            />
          </el-form-item>
<!--          <el-form-item label="用户id" prop="userId">-->
<!--            <el-input-->
<!--                v-model="queryParams.userId"-->
<!--                placeholder="请输入用户id"-->
<!--                clearable-->
<!--                @keyup.enter.native="handleQuery"-->
<!--            />-->
<!--          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
                v-hasPermi="['system:order:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
                type="success"
                plain
                icon="el-icon-edit"
                size="mini"
                :disabled="single"
                @click="handleUpdate"
                v-hasPermi="['system:order:edit']"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
                type="danger"
                plain
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermi="['system:order:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
                type="warning"
                plain
                icon="el-icon-download"
                size="mini"
                @click="handleExport"
                v-hasPermi="['system:order:export']"
            >导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange" @expand-change="rowExpand">
          <el-table-column type="selection" width="55" align="center" />
<!--          子表-->
          <el-table-column type="expand" prop="">
            <template slot-scope="scope">
              <el-table v-loading="loading" :data="scope.row.orderDetails" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
<!--                <el-table-column label=" 主键" align="center" prop="id" />-->
                <el-table-column label="主表订单号" align="center" prop="orderCode" />
                <el-table-column label="项目" align="center" prop="projectName" />
                <el-table-column label="数量" align="center" prop="count" />
                <el-table-column label="价格" align="center" prop="price" />
                <el-table-column label="实际价格" align="center" prop="realPrice" />
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                  <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['system:detail:edit']"
                    >修改</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['system:detail:remove']"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
<!--          <el-table-column label="主键" align="center" prop="id" />-->
          <el-table-column label="订单号" align="center" prop="code" />
          <el-table-column label="支付类型" align="center" prop="payType" />
          <el-table-column label="支付订单号" align="center" prop="payCode" />
          <el-table-column label="订单状态" align="center" prop="payState" />
          <el-table-column label="用户" align="center" prop="userId" />
          <el-table-column label="联系电话" align="center" prop="phone" width="110px"/>
          <el-table-column label="车牌号" align="center" prop="carCode" />
          <el-table-column label="订单总价格" align="center" prop="totalPrice" />
          <el-table-column label="订单实际价格" align="center" prop="realPrice" />
          <el-table-column label="创建时间" align="center" prop="createTimeStr"/>
          <el-table-column label="更新时间" align="center" prop="updateTimeStr"/>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:order:edit']"
              >修改</el-button>
              <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-s-shop"
                  @click="pay(scope.row)"
                  v-show="scope.row.payState === 1"
              >支付</el-button>
              <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:order:remove']"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
        />

        <!-- 添加或修改订单主对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="订单号" prop="code">
              <el-input v-model="form.code" placeholder="请输入订单号" />
            </el-form-item>
            <el-form-item label="支付订单号" prop="payCode">
              <el-input v-model="form.payCode" placeholder="请输入支付订单号" />
            </el-form-item>
            <el-form-item label="订单状态" prop="payState">
              <el-input v-model="form.payState" placeholder="请输入订单状态" />
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>
            <el-form-item label="车牌号" prop="carCode">
              <el-input v-model="form.carCode" placeholder="请输入车牌号" />
            </el-form-item>
            <el-form-item label="订单总价格" prop="totalPrice">
              <el-input v-model="form.totalPrice" placeholder="请输入订单总价格" />
            </el-form-item>
            <el-form-item label="订单实际价格" prop="realPrice">
              <el-input v-model="form.realPrice" placeholder="请输入订单实际价格" />
            </el-form-item>
            <el-form-item label="用户id" prop="userId">
              <el-input v-model="form.userId" placeholder="请输入用户id" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
      </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { listOrder, getOrder, delOrder, addOrder, updateOrder } from "@/api/system/order";
import { pay } from "@/api/system/shop";
import Header from "@/components/common/Header";
import MyMenu from "@/components/common/Menu";
import {Message, MessageBox} from "element-ui";
export default {
  name: "Order",
  components: {MyMenu, Header},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 订单主表格数据
      orderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        code: null,
        payType: null,
        payCode: null,
        payState: null,
        phone: null,
        carCode: null,
        totalPrice: null,
        realPrice: null,
        userId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        code: [
          { required: true, message: "订单号不能为空", trigger: "blur" }
        ],
        payType: [
          { required: true, message: "支付类型不能为空", trigger: "change" }
        ],
        payCode: [
          { required: true, message: "支付订单号不能为空", trigger: "blur" }
        ],
        payState: [
          { required: true, message: "订单状态不能为空", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
        carCode: [
          { required: true, message: "车牌号不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        updateTime: [
          { required: true, message: "修改时间不能为空", trigger: "blur" }
        ],
        totalPrice: [
          { required: true, message: "订单总价格不能为空", trigger: "blur" }
        ],
        realPrice: [
          { required: true, message: "订单实际价格不能为空", trigger: "blur" }
        ],
        userId: [
          { required: true, message: "用户id不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 支付
    pay(row) {
      window.open("http://localhost:8081/shop/pay?orderCode=" + row.code)
    },
    /** 查询订单主列表 */
    getList() {
      this.loading = true;
      listOrder(this.queryParams).then(response => {
        this.orderList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        code: null,
        payType: null,
        payCode: null,
        payState: null,
        phone: null,
        carCode: null,
        createTime: null,
        updateTime: null,
        totalPrice: null,
        realPrice: null,
        userId: null
      };
      //this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加订单主";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOrder(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改订单主";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateOrder(this.form).then(response => {
              Message.success("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOrder(this.form).then(response => {
              Message.success("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除订单主编号为"' + ids + '"的数据项？').then(function() {
        return delOrder(ids);
      }).then(() => {
        this.getList();
        Message.success("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/order/export', {
        ...this.queryParams
      }, `order_${new Date().getTime()}.xlsx`)
    },
    rowExpand(row, expandeRows) {
      console.log('点开了' + row.orderId)
      console.log(row.orderDetails)
      const _this = this
      _this.orderDetailData = row.orderDetails
    }
  }
};
</script>

<style>
.content{
  height: 700px;
}

</style>

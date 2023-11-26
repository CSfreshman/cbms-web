<template>
  <div class="main">
    <Header></Header>
    <el-container class="content">
      <MyMenu></MyMenu>
      <el-main>
        <div class="app-container">
          <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="项目名称" prop="name">
              <el-input
                  v-model="queryParams.name"
                  placeholder="请输入项目名称"
                  clearable
                  @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="项目价格" prop="price">
              <el-input
                  v-model="queryParams.price"
                  placeholder="请输入项目价格"
                  clearable
                  @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <!--            <el-form-item label="项目介绍" prop="desc">-->
            <!--              <el-input-->
            <!--                  v-model="queryParams.desc"-->
            <!--                  placeholder="请输入项目介绍"-->
            <!--                  clearable-->
            <!--                  @keyup.enter.native="handleQuery"-->
            <!--              />-->
            <!--            </el-form-item>-->
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>

          <el-table v-loading="loading" :data="projectList">

            <!--            <el-table-column label="主键" align="center" prop="id" />-->
            <el-table-column label="项目名称" align="center" prop="name" />
            <el-table-column label="项目价格" align="center" prop="price" />
            <el-table-column label="项目介绍" align="center" prop="desc" >
              <template slot-scope="scope">
                <el-tooltip placement="top">
                  <div slot="content">{{scope.row.desc}}</div>
                  <span>{{scope.row.desc.substring(0,10)}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-goods"
                    @click="handleAddToCart(scope.row)"
                    v-hasPermi="['system:project:edit']"
                >选购</el-button>

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

<!--          购物车-->
          <el-row style="padding-top: 100px">
            <span>已选 {{testData == '' ? 0 : testData.totalNum}} 项项目，共计 {{testData == '' ? 0 : testData.totalPrice}} 元</span>
            <el-button @click="drawer = true" type="primary" style="margin-left: 16px;">
              查看购物车
            </el-button>
          </el-row>

          <el-drawer
              title="我的购物车"
              :visible.sync="drawer"
              :with-header="false">
            <span>购物车</span>
            <el-table :data="testData.projects" style="padding-top: 30px">
              <el-table-column label="项目名称" align="center" prop="name" />
              <el-table-column label="项目价格" align="center" prop="price" />
              <el-table-column align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-minus"
                      @click="handleRemove(scope.row)"
                  ></el-button>
                </template>
              </el-table-column>

              <el-table-column label="项目数量" align="center" prop="num" />

              <el-table-column align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-plus"
                      @click="handlePlus(scope.row)"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-row style="padding-top: 40px">
              <span>合计: {{testData.totalPrice}} 元</span>
            </el-row>

            <el-input
                v-model="carCard"
                placeholder="请输入您的车牌号"
                clearable
                style="padding-top: 50px"
            />
            <el-input
                v-model="phone"
                placeholder="请输入您的手机号"
                clearable
                style="padding-top: 20px"
            />
            <el-row style="padding-top: 60px">
              <el-button type="primary" @click="doOrder()">下单并支付</el-button>
            </el-row>


          </el-drawer>

          <!-- 添加或修改美容项目对话框 -->
          <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
              <el-form-item label="项目名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入项目名称" />
              </el-form-item>
              <el-form-item label="项目价格" prop="price">
                <el-input v-model="form.price" placeholder="请输入项目价格" />
              </el-form-item>
              <el-form-item label="项目介绍" prop="desc">
                <el-input v-model="form.desc" placeholder="请输入项目介绍" />
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
import { listProject, getProject, delProject, addProject, updateProject, addToCart, doOrder, getAll, updateNum} from "@/api/system/shop";
import Header from "@/components/common/Header";
import MyMenu from "@/components/common/Menu";
import {Message, MessageBox} from "element-ui";

import data from "@/components/views/system/shop/test.json"

export default {
  name: "Shop",
  components: {Header, MyMenu},
  data() {
    return {
      // 车牌号
      carCard: '',
      // 手机号
      phone: '',
      // 测试数据
      testData: "",
      // 右侧抽屉
      drawer: false,
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
      // 美容项目表格数据
      projectList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        price: null,
        desc: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "项目名称不能为空", trigger: "blur" }
        ],
        price: [
          { required: true, message: "项目价格不能为空", trigger: "blur" }
        ],
        desc: [
          { required: true, message: "项目介绍不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    //this.testData = data;
    this.getList();
    this.getShopCart();
  },
  methods: {
    doOrder() {
      console.log("下单");
      // 需要参数：1.购物车数据 2.用户信息，包括车牌号、手机号
      doOrder(this.testData,this.carCard,this.phone).then(response => {
        this.testData = "";
        this.carCard = "";
        this.phone = "";

        Message.success("下单成功，即将跳转至支付界面。")
      });
    },
    handlePlus(row) {
      row.num++;
      this.testData.totalNum++;
      this.testData.totalPrice+=row.price

      updateNum(row.id,1)
    },
    handleRemove(row) {
      if(row.num <= 0){
        Message.info("不可以再扣减了")
        return;
      }
      row.num--;
      this.testData.totalNum--;
      this.testData.totalPrice-=row.price

      updateNum(row.id,-1)
    },
    handleAddToCart(row) {
      addToCart(row).then(response=>{
        this.getShopCart();
      });
    },
    getShopCart(){
      getAll().then(response=>{
        console.log(response);
        this.testData = response.data
      })
    },

    /** 查询美容项目列表 */
    getList() {
      this.loading = true;
      listProject(this.queryParams).then(response => {
        this.projectList = response.rows;
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
        name: null,
        price: null,
        desc: null
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
      this.title = "添加美容项目";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      console.log("执行修改,id = " + id);
      getProject(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改美容项目";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateProject(this.form).then(response => {
              Message.success("修改成功")
              this.open = false;
              this.getList();
            });
          } else {
            addProject(this.form).then(response => {
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

      MessageBox.confirm('是否确认删除美容项目编号为"' + ids + '"的数据项？', "系统提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: "warning",
      })
          .then(function() {
            return delProject(ids);
          }).then(() => {
        this.getList();
        Message.success("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/project/export', {
        ...this.queryParams
      }, `project_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>

<style>
.content{
  height: 700px;
}

</style>

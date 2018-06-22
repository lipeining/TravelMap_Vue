<template>
  <el-row>
    <app-header/>
    <h1>plans</h1>
    <el-row class="search">
      <el-col :span="5">
        <el-input placeholder="search plan"
                  v-model="search" size="medium" clearable>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-tooltip class="item" effect="dark" content="new plan" placement="right">
          <el-button type="success" @click="addPlanForm()" icon="el-icon-plus" circle>
          </el-button>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-row class="table">
      <el-table :data="plans" border size="medium">
        <el-table-column prop="name" label="name" align="center">
        </el-table-column>
        <el-table-column prop="intro" label="intro" align="center">
        </el-table-column>
        <el-table-column prop="cost" label="cost" align="center">
        </el-table-column>
        <el-table-column prop="startTime" label="startTime" align="center">
        </el-table-column>
        <el-table-column prop="endTime" label="endTime" align="center">
        </el-table-column>
        <el-table-column label="edit" align="center">
          <template slot-scope="scope">
            <router-link :to="{name:'plan',query:{id:scope.row.id}}">
              <el-button type="info" size="mini" icon="el-icon-document">
              </el-button>
            </router-link>
            <el-button type="success" size="mini" icon="el-icon-edit-outline"
                       @click="editPlanForm(scope.row)">
            </el-button>
            <el-button
              size="mini" type="danger" icon="el-icon-delete"
              @click="handleDelPlan(scope.$index, scope.row)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <!-- form for new plan-->
    <div>
      <el-dialog title="new plan" :visible.sync="planFormVisible" :before-close="handleDialogClose">
        <div>
          <el-form :model="plan" label-width="70px" auto-complete="on"
                   :rules="rules" ref="planForm">
            <el-form-item label="name" prop="name">
              <el-input v-model="plan.name" type="text"></el-input>
            </el-form-item>
            <el-form-item label="intro" prop="intro">
              <el-input v-model="plan.intro" type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"></el-input>
            </el-form-item>
            <el-form-item label="cost" prop="cost">
              <!--<el-input v-model.number="plan.cost"-->
              <!--type="number" min="0" max="10000"></el-input>-->
              <el-input-number v-model="plan.cost"
                               :min="0" :max="10000" label="">
              </el-input-number>
            </el-form-item>
            <el-form-item label="status" prop="status">
              <el-input-number v-model="plan.status"
                               :min="0" :max="5" label="">
              </el-input-number>
              <!--<el-input v-model.number="plan.status"-->
              <!--type="number" min="0" max="5"></el-input>-->
            </el-form-item>
            <el-form-item label="start to end" label-width="100px">
              <el-date-picker
                v-model="start2end"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="to"
                start-placeholder="startTime"
                end-placeholder="endTime"
                :picker-options="picker">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelPlanForm()">cancel</el-button>
          <el-button type="primary" @click="submitPlanForm('planForm')">submit</el-button>
        </div>
      </el-dialog>
    </div>
  </el-row>
</template>

<script>
  import {getPlans, delPlan, createPlan, updatePlan} from '../api/plan';
  import _ from 'lodash';
  import AppHeader from '../components/header';

  export default {
    name      : "plans",
    components: {
      AppHeader
    },
    data() {
      let plans     = [];
      let pageSize  = 10;
      let pageIndex = 1;
      let total     = 100;
      let search    = '';
      let picker    = {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end   = new Date();
            const start = new Date();
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end   = new Date();
            const start = new Date();
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end   = new Date();
            const start = new Date();
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      };
      const rules   = {
        name : [
          {required: true, message: 'please input plan name'},
          {min: 5, max: 16, message: '长度在 5 到 16 个字符'}
        ],
        intro: [
          {required: true, message: 'please input plan intro'},
          {min: 20, max: 120, message: '长度在 20 到 120 个字符'}
        ]
      };
      let plan      = {
        id: 0, name: '', intro: '', cost: 0, status: 0, startTime: '', endTime: ''
      };
      return {
        plans          : plans,
        rules          : rules,
        total          : total,
        plan           : plan,
        picker         : picker,
        start2end      : '',
        search         : search,
        pageIndex      : pageIndex,
        pageSize       : pageSize,
        planFormVisible: false
      }
    },
    created() {
      this.getPlans();
    },
    watch     : {
      search: function () {
        this.getPlans();
      }
    },
    methods   : {
      getPlans: _.debounce(function () {
        return getPlans({
          pageIndex: this.pageIndex,
          pageSize : this.pageSize,
          search   : this.search
        })
          .then(result => {
            this.plans = result.plans;
            this.total = result.total;
          })
          .catch(err => {
            this.$notify.error({
              title  : 'error',
              message: err
            });
          });
      }, 500),
      handleDelPlan(index, row) {
        this.$confirm('it would delete the plan, go ahead?', 'warning', {
          confirmButtonText: 'yes',
          cancelButtonText : 'no',
          type             : 'warning',
          center           : true
        }).then(() => {
          delPlan({
            id: row.id
          })
            .then(() => {
              this.plans.splice(index, 1);
              this.$message({
                type   : 'success',
                message: 'delete!' + row.name
              });
            });
        }).catch(() => {
          this.$message({
            type   : 'info',
            message: 'cancel'
          });
        });
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getPlans();
        // this.$notify({
        //   type   : 'success',
        //   title  : 'pageChange',
        //   message: val,
        // });
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getPlans();
        // this.$notify({
        //   type   : 'success',
        //   title  : 'sizeChange',
        //   message: val,
        // });
      },
      handleDialogClose(done) {
        this.cancelPlanForm();
        done();
      },
      cancelPlanForm() {
        this.planFormVisible = false;
        this.plan            = {
          id: 0, name: '', intro: '', cost: 0, status: 0, startTime: '', endTime: ''
        };
      },
      addPlanForm() {
        this.planFormVisible = true;
      },
      editPlanForm(plan) {
        // console.log(JSON.stringify(plan));
        this.plan            = {
          id       : plan.id, name: plan.name, intro: plan.intro,
          cost     : plan.cost, status: plan.status,
          startTime: plan.startTime, endTime: plan.endTime
        };
        this.start2end       = [
          this.plan.startTime,
          this.plan.endTime
        ];
        this.planFormVisible = true;
      },
      submitPlanForm(formName) {
        this.$refs[formName].validate(valid => {
          if (!valid) {
            return false;
          } else {
            // create plan
            if (this.plan.id === 0) {
              this.plan.startTime = this.start2end[0];
              this.plan.endTime   = this.start2end[1];
              console.log(JSON.stringify(this.plan));
              createPlan(this.plan)
                .then(result => {
                  this.cancelPlanForm();
                  this.getPlans();
                })
                .catch(err => {
                  this.$notify.error({
                    title  : 'create plan error',
                    message: err
                  });
                  console.log(err);
                });
            } else {
              // edit plan
              this.plan.startTime = this.start2end[0];
              this.plan.endTime   = this.start2end[1];
              console.log(JSON.stringify(this.plan));
              updatePlan(this.plan)
                .then(result => {
                  this.cancelPlanForm();
                  this.getPlans();
                })
                .catch(err => {
                  this.$notify.error({
                    title  : 'update plan error',
                    message: err
                  });
                  console.log(err);
                });
            }
          }
        });
      },
    }
  }
</script>

<style scoped>
  .search {
    margin: 1em;
  }

  .table {
    margin: 1em;
  }

  .pagination {
    margin: 1em;
  }
</style>

<template>
  <el-row>
    <app-header/>
    <el-row>
      <h3>plan id : {{id}}</h3>
    </el-row>
    <el-row>
      <el-row :gutter="18">
        <el-col :span="10" class="plan-content">
          <!--left plan content -->
          <el-row>
            <el-checkbox v-model="editPlan" class="edit-checkbox"
                         @change="editPlanForm" size="medium" border>edit
            </el-checkbox>
          </el-row>
          <el-row>
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
              <el-button v-if="editPlan" type="primary" @click="submitPlanForm('planForm')">submit</el-button>
            </el-form>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row class="user-list">
            <!--right plan user-->
            <el-row>
              user list
            </el-row>
            <el-row :gutter="6">
              <el-col v-for="user in Users" :span="6" class="user" :key="user.id">
                <!--{{user.name}}-->
                <el-tooltip placement="top" effect="light">
                  <div slot="content">
                    <el-button @click="" icon="el-icon-delete"></el-button>
                  </div>
                  <el-button :type="userType(user['UserPlan.type'])">
                    {{user.name}}
                  </el-button>
                </el-tooltip>
              </el-col>
              <!--<el-button-group v-for="user in Users" :key="user.id">-->
              <!--<el-button :type="userType(user['UserPlan.type'])">{{user.name}}</el-button>-->
              <!--<el-button type="primary" @click="" icon="el-icon-delete"></el-button>-->
              <!--</el-button-group>-->
            </el-row>
            <el-row class="add-user">
              <el-tooltip class="item" effect="dark" content="add a user" placement="right">
                <el-button type="success" @click="addUserForm()" icon="el-icon-plus" circle>
                </el-button>
              </el-tooltip>
            </el-row>
          </el-row>
          <el-row class="group-list">
            <!--right plan group-->
            <el-row>
              group list
            </el-row>
          </el-row>
        </el-col>
      </el-row>
      <el-row v-if="Spots.length" :gutter="10">
        <!--here for the spots-->
        <el-col v-for="spot in Spots" :span="4" :key="spot.id">
          {{spot}}
        </el-col>
      </el-row>
      <el-row :gutter="10" v-else>
        no spots right now!
      </el-row>
    </el-row>

    <!--form for new user-->
    <div>
      <el-dialog title="new user" :visible.sync="userFormVisible" :before-close="handleDialogClose">
        <div>
          <el-form :model="newUser" label-width="70px" auto-complete="on"
                   ref="userForm">
            <el-form-item>
              <el-checkbox-group v-model="newUser.userIds">
                <el-checkbox v-for="userI in userNames" :min="1" :max="2"
                             :label="userI.id" :key="userI.id">
                  {{userI.name}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="type" prop="type">
              <el-input-number v-model="newUser.type"
                               :min="0" :max="5" label="">
              </el-input-number>
            </el-form-item>
            <el-form-item label="status" prop="status">
              <el-input-number v-model="newUser.status"
                               :min="0" :max="5" label="">
              </el-input-number>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelUserForm()">cancel</el-button>
          <el-button type="primary" @click="submitUserForm('userForm')">submit</el-button>
        </div>
      </el-dialog>
    </div>
  </el-row>
</template>

<script>
  import AppHeader from '../components/header';
  import {getPlan, updatePlan, addUser} from "../api/plan";
  import {getUserNames} from "../api/user";

  export default {
    name      : "plan",
    components: {
      AppHeader
    },
    data() {
      // let plan = {
      //   id: 0, name: '', intro: '', cost: 0, status: 0, startTime: '', endTime: '',
      // };
      let plan      = {};
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
      let newUser   = {id: 0, userIds: [], type: 0, status: 0};
      let userNames = [];
      return {
        id       : 0,
        plan     : plan,
        rules    : rules,
        picker   : picker,
        newUser  : newUser, userNames: userNames,
        start2end: '',
        Spots    : [],
        Users    : [],
        editPlan : false, userFormVisible: false,
      }
    },
    created() {
      this.id = this.$route.query.id;
      this.getPlan();
    },
    methods   : {
      getPlan: _.debounce(function () {
        return getPlan({
          id: this.id
        })
          .then(result => {
            this.plan      = result.plan;
            this.Users     = result.Users;
            this.Spots     = result.Spots;
            this.start2end = [
              this.plan.startTime,
              this.plan.endTime
            ];
          })
          .catch(err => {
            this.$notify.error({
              title  : 'error',
              message: err
            });
          });
      }, 500),
      userType(type) {
        switch (type) {
          case 0:
            return 'info';
          case 1:
            return 'success';
          case 2:
            return 'warning';
          default:
            return 'info';
        }
      },
      editPlanForm(val) {
        if (val) {

        } else {

        }

      },
      submitPlanForm(formName) {
        this.$refs[formName].validate(valid => {
          if (!valid) {
            return false;
          } else {
            // edit plan
            this.plan.startTime = this.start2end[0];
            this.plan.endTime   = this.start2end[1];
            console.log(JSON.stringify(this.plan));
            updatePlan(this.plan)
              .then(result => {
              })
              .catch(err => {
                this.$notify.error({
                  title  : 'update plan error',
                  message: err
                });
                console.log(err);
              });
          }
        });
      },
      handleDialogClose(done) {
        this.cancelUserForm();
        done();
      },
      cancelUserForm() {
        this.userFormVisible = false;
        this.newUser         = {id: 0, userId: 0, type: 0, status: 0};
      },
      addUserForm() {
        this.userFormVisible = true;
        this.newUser.id      = this.plan.id;
        this.getUserNames();
      },
      getUserNames() {
        getUserNames()
          .then(result => {
            this.userNames = result.userNames;
          })
          .catch(err => {
            this.$notify.error({
              title  : 'get user name',
              message: err
            });
          });
      },
      submitUserForm(formName) {
        console.log(JSON.stringify(this.newUser));
        addUser(this.newUser)
          .then(result => {
            this.cancelUserForm();
            this.$notify({
              type   : 'info',
              title  : 'new user',
              message: this.newUser
            });
          })
          .catch(err => {
            this.$notify({
              type   : 'error',
              title  : 'new user',
              message: err
            });
          });
      }
    }
  }
</script>

<style scoped>
  .edit-checkbox {
    float: right;
  }

  .plan-content {
    border-right: 1px dashed goldenrod;
    margin: 1em;
  }

  .user-list {
    /*border-left: 1px dashed indianred;*/
    margin: 1em;
    border-bottom: 1px dashed goldenrod;
  }

  .user {
    /*margin-left: 1em;*/
  }

  .add-user {
    /*margin-left: 1em;*/
  }

  .group-list {
    /*border-left: 1px dashed indianred;*/
    margin: 1em;
  }
</style>

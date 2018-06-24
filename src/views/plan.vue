<template>
  <el-row>
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
                    <el-button-group v-if="user['UserPlan.type']">
                      <el-button @click="setUser(user.id, 1)"
                                 :type="userType(1)"
                                 v-if="user['UserPlan.type']===2"
                                 icon="el-icon-edit"></el-button>
                      <el-button @click="setUser(user.id, 2)"
                                 v-else-if="user['UserPlan.type']===1"
                                 :type="userType(2)"
                                 icon="el-icon-edit-outline"></el-button>
                      <el-button @click="removeUser(user.id)" icon="el-icon-delete"></el-button>
                    </el-button-group>
                    <span v-else>creator</span>
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
            <el-row :gutter="6">
              <el-col v-for="group in Groups" :span="6" :key="group.id">
                <!--{{user.name}}-->
                <el-tooltip placement="top" effect="light">
                  <div slot="content">
                    <el-button-group v-if="group['GroupPlan.type']">
                      <el-button @click="setGroup(group.id, 1)"
                                 :type="getGroupType(1)"
                                 v-if="group['GroupPlan.type']===2"
                                 icon="el-icon-edit"></el-button>
                      <el-button @click="setGroup(group.id, 2)"
                                 v-else-if="group['GroupPlan.type']===1"
                                 :type="getGroupType(2)"
                                 icon="el-icon-edit-outline"></el-button>
                      <el-button @click="setGroup(group.id)" icon="el-icon-delete"></el-button>
                    </el-button-group>
                    <span v-else>creator</span>
                  </div>
                  <el-button :type="getGroupType(group['GroupPlan.type'])"
                             size="mini" icon="el-icon-document"
                             @click="getGroupUsers(group.id)">
                    {{group.name}}|({{group.number}})
                  </el-button>
                </el-tooltip>
              </el-col>
              <!--<el-button-group v-for="user in Users" :key="user.id">-->
              <!--<el-button :type="userType(user['UserPlan.type'])">{{user.name}}</el-button>-->
              <!--<el-button type="primary" @click="" icon="el-icon-delete"></el-button>-->
              <!--</el-button-group>-->
            </el-row>
            <el-row class="">
              <el-tooltip class="item" effect="dark" content="add a group" placement="right">
                <el-button type="success" @click="addGroupForm()" icon="el-icon-plus" circle>
                </el-button>
              </el-tooltip>
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

    <!-- form for new group-->
    <div>
      <el-dialog title="new group" :visible.sync="groupFormVisible" :before-close="handleDialogClose">
        <div>
          <el-form :model="group" label-width="70px" auto-complete="on"
                   :rules="rules" ref="groupForm">
            <el-form-item label="name" prop="name">
              <el-input v-model="group.name" type="text"></el-input>
            </el-form-item>
            <el-form-item label="intro" prop="intro">
              <el-input v-model="group.intro" type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"></el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox-group v-model="group.userIds">
                <el-checkbox v-for="userI in userNames" :min="1" :max="2"
                             :label="userI.id" :key="userI.id">
                  {{userI.name}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="type" prop="type">
              <el-input-number v-model="group.type"
                               :min="0" :max="5" label="">
              </el-input-number>
            </el-form-item>
            <el-form-item label="status" prop="status">
              <el-input-number v-model="group.status"
                               :min="0" :max="5" label="">
              </el-input-number>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelGroupForm()">cancel</el-button>
          <el-button type="primary" @click="submitGroupForm('groupForm')">submit</el-button>
        </div>
      </el-dialog>
    </div>

  </el-row>
</template>

<script>
  import {
    getPlan, updatePlan,
    addUser, setUser, removeUser, getPlanUsers,
    addGroup, setGroup, removeGroup, getPlanGroups,
  } from "../api/plan";
  import {getUserNames} from "../api/user";
  import _ from 'lodash';

  export default {
    name   : "plan",
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
      let group     = {userIds: [], planId: 0, type: 0, status: 0, name: '', intro: ''};
      return {
        id       : 0, plan: plan, rules: rules, picker: picker,
        newUser  : newUser, userNames: userNames,
        start2end: '',
        Spots    : [], Users: [], Groups: [], group: group,
        editPlan : false, userFormVisible: false, groupFormVisible: false,
      }
    },
    created() {
      this.id = this.$route.query.id;
      this.getPlan();
    },
    methods: {
      getPlan: _.debounce(function () {
        return getPlan({
          id: this.id
        })
          .then(result => {
            this.plan      = result.plan;
            this.Users     = result.Users;
            this.Spots     = result.Spots;
            this.Groups    = result.Groups;
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
      getGroupType(type) {
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
        this.newUser         = {id: 0, userIds: [], type: 0, status: 0};
      },
      addUserForm() {
        this.userFormVisible = true;
        this.newUser.id      = this.plan.id;
        this.getPlanUsers();
      },
      setUser(userId, type) {
        // for edit user
        let planuser = {
          id    : this.id,
          userId: userId,
          type  : type,
          status: 0,
        };
        setUser(planuser)
          .then(result => {
            let index                          = this.Users.findIndex((user) => {
              return user.id === userId;
            });
            this.Users[index]['UserPlan.type'] = type;
            this.$notify({
              type   : 'info',
              title  : 'set user',
              message: result
            });
          })
          .catch(err => {
            this.$notify({
              type   : 'error',
              title  : 'set user',
              message: err
            });
          });
      },
      removeUser(userId) {
        // for edit user
        let planuser = {
          id    : this.id,
          userId: userId
        };
        removeUser(planuser)
          .then(result => {
            let index = this.Users.findIndex((user) => {
              return user.id === userId;
            });
            this.Users.splice(index, 1);
            this.$notify({
              type   : 'info',
              title  : 'remove user',
              message: result
            });
          })
          .catch(err => {
            this.$notify({
              type   : 'error',
              title  : 'remove user',
              message: err
            });
          });
      },
      getPlanUsers() {
        getPlanUsers({
          planId: this.id,
          inOut : 0
        })
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
        // for add user
        addUser(this.newUser)
          .then(result => {
            this.cancelUserForm();
            this.getPlan();
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
      },
      submitGroupForm(formName) {
        this.$refs[formName].validate(valid => {
          if (!valid) {
            return false;
          } else {
            // for add group to this plan
            console.log(this.group);
            addGroup(this.group)
              .then(result => {
                this.cancelGroupForm();
                this.getPlan();
              })
              .catch(err => {
                this.$notify({
                  type   : 'error',
                  title  : 'new group',
                  message: err
                });
              });
          }
        });
      },
      cancelGroupForm() {
        this.groupFormVisible = false;
        this.group            = {
          planId: 0, userIds: [], type: 0, status: 0,
          name  : '', intro: ''
        };
      },
      addGroupForm() {
        this.groupFormVisible = true;
        this.group.planId     = this.plan.id;
        this.getUsersForGroup();
      },
      setGroup(groupId, type) {
        // for edit plan group
        let plangroup = {
          planId : this.plan.id,
          groupId: groupId,
          type   : type,
          status : 0,
        };
        setGroup(plangroup)
          .then(result => {
            let index                            = this.Groups.findIndex((group) => {
              return group.id === groupId;
            });
            this.Groups[index]['GroupPlan.type'] = type;
            this.$notify({
              type   : 'info',
              title  : 'set group',
              message: result
            });
          })
          .catch(err => {
            this.$notify({
              type   : 'error',
              title  : 'set group',
              message: err
            });
          });
      },
      removeGroup(groupId) {
        // for edit user
        let plangroup = {
          planId : this.plan.id,
          groupId: groupId
        };
        removeGroup(plangroup)
          .then(result => {
            let index = this.Groups.findIndex((group) => {
              return group.id === groupId;
            });
            this.Groups.splice(index, 1);
            this.$notify({
              type   : 'info',
              title  : 'remove group',
              message: result
            });
          })
          .catch(err => {
            this.$notify({
              type   : 'error',
              title  : 'remove group',
              message: err
            });
          });
      },
      getGroupNames() {
        // only get the group from the creator!
        // getGroupNames({
        //
        // })
        //   .then(result => {
        //   })
        //   .catch(err => {
        //     this.$notify.error({
        //       title  : 'get group name',
        //       message: err
        //     });
        //   });
      },
      getUsersForGroup() {
        // get name from user table!
        getUserNames({})
          .then(result => {
            this.userNames = result.userNames;
            this.$notify({
              type   : 'info',
              title  : 'get  users',
              message: result
            });
          })
          .catch(err => {
            this.$notify({
              type   : 'error',
              title  : 'get  users',
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

<template>
  <el-row :gutter="20">
    <el-row class="group-name-intro" :gutter="10">
      <!--for group name and intro-->
      <el-col :span="3">{{group.name}}</el-col>
      <el-col :span="1">|</el-col>
      <el-col :span="5">{{group.intro}}</el-col>
    </el-row>
    <el-row>
      <!--for group user-->
      <el-row v-if="Users.length">
        <!--<el-col :span="3" v-for="user in Users" :key="user.id">-->
          <!--<el-tag :type="getUserType(user['UserGroup.type'])">-->
            <!--{{user.name}}-->
          <!--</el-tag>-->
        <!--</el-col>-->

        <el-col v-for="user in Users" :span="3" class="user" :key="user.id">
          <!--{{user.name}}-->
          <el-tooltip placement="top" effect="light">
            <div slot="content">
              <el-button-group v-if="user['UserGroup.type']">
                <el-button @click="setUser(user.id, 1)"
                           :type="getUserType(1)"
                           v-if="user['UserGroup.type']===2"
                           icon="el-icon-edit"></el-button>
                <el-button @click="setUser(user.id, 2)"
                           v-else-if="user['UserGroup.type']===1"
                           :type="getUserType(2)"
                           icon="el-icon-edit-outline"></el-button>
                <el-button @click="removeUser(user.id)" icon="el-icon-delete"></el-button>
              </el-button-group>
              <span v-else>creator</span>
            </div>
            <el-button :type="getUserType(user['UserGroup.type'])">
              {{user.name}}
            </el-button>
          </el-tooltip>
        </el-col>

        <el-col :span="3">
          <el-tooltip class="item" effect="dark" content="add a user" placement="right">
            <el-button type="success" @click="addUserForm()" icon="el-icon-plus" circle>
            </el-button>
          </el-tooltip>
        </el-col>

      </el-row>
      <el-row v-else>
        no user in this group
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
  import {getGroup, getGroupUsers, addUser, setUser, removeUser} from '../api/group';

  export default {
    name   : "group",
    data() {
      let group     = {name: '', intro: ''};
      let userNames = [];
      let newUser   = {groupId: 0, userIds: [], type: 0, status: 0};
      return {
        id             : 0,
        group          : group,
        userNames      : userNames,
        Users          : [],
        newUser        : newUser,
        userFormVisible: false,
      }
    },
    created() {
      this.id = this.$route.query.id;
      this.getGroup();
    },
    methods: {
      getUserType(type) {
        switch (type) {
          case 0:
            return 'success';
          case 1:
            return 'info';
          case 2:
            return 'warning';
          default:
            return 'danger';
        }
      },
      getGroup() {
        return getGroup({
          id: this.id
        })
          .then(result => {
            this.group = result.group;
            this.Users = result.Users;
          })
          .catch(err => {
            this.$notify.error({
              title  : 'error',
              message: err
            });
          });
      },
      handleDialogClose(done) {
        this.cancelUserForm();
        done();
      },
      cancelUserForm() {
        this.userFormVisible = false;
        this.newUser         = {groupId: 0, userIds: [], type: 0, status: 0};
      },
      addUserForm() {
        this.userFormVisible = true;
        this.newUser.groupId = this.group.id;
        this.getUserNames();
      },
      getUserNames() {
        getGroupUsers({
          groupId: this.id,
          inOut  : 0
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
            this.getGroup();
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
      setUser(userId, type) {
        // for edit user
        let groupuser = {
          groupId: this.group.id,
          userId : userId,
          type   : type,
          status : 0,
        };
        setUser(groupuser)
          .then(result => {
            let index                           = this.Users.findIndex((user) => {
              return user.id === userId;
            });
            this.Users[index]['UserGroup.type'] = type;
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
        let groupuser = {
          groupId: this.group.id,
          userId : userId
        };
        removeUser(groupuser)
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
    }
  }
</script>

<style scoped>
  .group-name-intro {
    margin: 1em;
    border: 1px;
  }
</style>

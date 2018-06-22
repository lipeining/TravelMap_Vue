<template>
  <el-row>
    <app-header/>
    <h1>groups</h1>
    <el-row class="search">
      <el-col :span="5">
        <el-input placeholder="search group"
                  v-model="search" size="medium" clearable>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-tooltip class="item" effect="dark" content="new group" placement="right">
          <el-button type="success" @click="addGroupForm()" icon="el-icon-plus" circle>
          </el-button>
        </el-tooltip>
      </el-col>
    </el-row>

    <el-row class="table">
      <el-table :data="groups" border size="medium">
        <el-table-column prop="name" label="name" align="center">
        </el-table-column>
        <el-table-column prop="intro" label="intro" align="center">
        </el-table-column>
        <el-table-column label="edit" align="center">
          <template slot-scope="scope">
            <router-link :to="{name:'group',query:{id:scope.row.id}}">
              <el-button type="info" size="mini" icon="el-icon-document">
              </el-button>
            </router-link>
            <el-button type="success" size="mini" icon="el-icon-edit-outline"
                       @click="editGroupForm(scope.row)">
            </el-button>
            <el-button
              size="mini" type="danger" icon="el-icon-delete"
              @click="handleDelGroup(scope.$index, scope.row)">
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
  import {getGroups, delGroup, createGroup, updateGroup} from '../api/group';
  import _ from 'lodash';
  import AppHeader from '../components/header';

  export default {
    name      : "groups",
    components: {
      AppHeader
    },
    data() {
      let groups    = [];
      let pageSize  = 10;
      let pageIndex = 1;
      let total     = 100;
      let search    = '';
      const rules   = {
        name : [
          {required: true, message: 'please input group name'},
          {min: 5, max: 16, message: '长度在 5 到 16 个字符'}
        ],
        intro: [
          {required: true, message: 'please input group intro'},
          {min: 20, max: 120, message: '长度在 20 到 120 个字符'}
        ]
      };
      let group     = {id: 0, name: '', intro: ''};
      return {
        groups          : groups,
        rules           : rules,
        total           : total,
        group           : group,
        search          : search,
        pageIndex       : pageIndex,
        pageSize        : pageSize,
        groupFormVisible: false
      }
    },
    created() {
      this.getGroups();
    },
    watch     : {
      search: function () {
        this.getGroups();
      }
    },
    methods   : {
      getGroups: _.debounce(function () {
        return getGroups({
          pageIndex: this.pageIndex,
          pageSize : this.pageSize,
          search   : this.search
        })
          .then(result => {
            this.groups = result.groups;
            this.total  = result.total;
          })
          .catch(err => {
            this.$notify.error({
              title  : 'error',
              message: err
            });
          });
      }, 500),
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getGroups();

      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getGroups();
      },
      handleDelGroup(index, row) {
        this.$confirm('it would delete the group, go ahead?', 'warning', {
          confirmButtonText: 'yes',
          cancelButtonText : 'no',
          type             : 'warning',
          center           : true
        }).then(() => {
          delGroup({
            id: row.id
          })
            .then(() => {
              this.groups.splice(index, 1);
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
      handleDialogClose(done) {
        this.cancelGroupForm();
        done();
      },
      cancelGroupForm() {
        this.groupFormVisible = false;
        this.group            = {id: 0, name: '', intro: ''};
      },
      addGroupForm() {
        this.groupFormVisible = true;
      },
      editGroupForm(group) {
        this.group            = {
          id: group.id, name: group.name, intro: group.intro
        };
        this.groupFormVisible = true;
      },
      submitGroupForm(formName) {
        this.$refs[formName].validate(valid => {
          if (!valid) {
            return false;
          } else {
            // create group
            if (this.group.id === 0) {
              console.log(JSON.stringify(this.group));
              createGroup(this.group)
                .then(result => {
                  this.cancelGroupForm();
                  this.getGroups();
                })
                .catch(err => {
                  this.$notify.error({
                    title  : 'create group error',
                    message: err
                  });
                  console.log(err);
                });
            } else {
              // edit group
              console.log(JSON.stringify(this.group));
              updateGroup(this.group)
                .then(result => {
                  this.cancelGroupForm();
                  this.getGroups();
                })
                .catch(err => {
                  this.$notify.error({
                    title  : 'update group error',
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
</style>

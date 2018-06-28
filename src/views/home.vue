<template>
  <el-row>
    <h1>home</h1>
    <el-row>
      <baidu-map class="map"
                 :center="{lng: 116.404, lat: 39.915}"
                 :zoom="14"
                 :scroll-wheel-zoom="false"
                 @click="addSpot">
        <bm-marker v-if="spot.location.lng!==116.404 && spot.location.lat!==39.915"
                   :position="spot.location"
                   :dragging="true" animation="BMAP_ANIMATION_BOUNCE"
                   @dragstart="dragstart" @dragend="dragend" @click="click">
          <bm-label content="spot" :labelStyle="{color: 'red', fontSize : '24px'}"
                    :offset="{width: -35, height: 30}"/>
        </bm-marker>

        <bm-marker v-for="spotI in Spots" :key="spotI.name"
                   :position="spotI.location"
                   :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
          <bm-label :content="spotI.name" :labelStyle="{color: 'blue', fontSize : '24px'}"
                    :offset="{width: -35, height: 30}"/>
        </bm-marker>
        <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></bm-navigation>
      </baidu-map>
    </el-row>

    <!-- form for new spot-->
    <div>
      <el-dialog title="new spot" :visible.sync="spotFormVisible" :before-close="handleDialogClose">
        <div>
          <el-form :model="spot" label-width="70px" auto-complete="on"
                   :rules="rules" ref="spotForm">
            <el-form-item label="name" prop="name">
              <el-input v-model="spot.name" type="text"></el-input>
            </el-form-item>
            <el-form-item label="intro" prop="intro">
              <el-input v-model="spot.intro" type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"></el-input>
            </el-form-item>
          </el-form>
          <p>location:lng-lat</p>
          <p>{{spot.location.lng}}-{{spot.location.lat}}</p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelSpotForm()">cancel</el-button>
          <el-button type="primary" @click="submitSpotForm('spotForm')">submit</el-button>
        </div>
      </el-dialog>
    </div>
  </el-row>
</template>

<script>

  export default {
    name   : "home",
    data() {
      let spot    = {
        id: 0, location: {lng: 116.404, lat: 39.915}, name: '', intro: '', planId: 0,
      };
      const rules = {
        name : [
          {required: true, message: 'please input group name'},
          {min: 5, max: 16, message: '长度在 5 到 16 个字符'}
        ],
        intro: [
          {required: true, message: 'please input group intro'},
          {min: 20, max: 120, message: '长度在 20 到 120 个字符'}
        ]
      };
      return {
        spot           : spot,
        rules          : rules,
        Spots          : [],
        spotFormVisible: false,
      }
    },
    methods: {
      click(evt) {
        console.log('click -begin-');
        console.log(evt.type);
        console.log(evt.target);
        console.log('click -end-');
      },
      dragstart(evt) {
        console.log('dragstart -begin-');
        console.log(evt.type);
        console.log(evt.target);
        console.log('dragstart -end-');
      },
      dragend(evt) {
        console.log('dragend -begin-');
        console.log(evt.type);
        console.log(evt.target);
        console.log(evt.pixel);
        console.log(evt.point);
        console.log('dragend -end-');
      },
      addSpot(evt) {
        this.spot.location   = evt.point;
        this.spotFormVisible = true;
      },
      handleDialogClose(done) {
        this.cancelSpotForm();
        done();
      },
      cancelSpotForm() {
        this.spotFormVisible = false;
        this.spot            = {
          id: 0, location: {lng: 116.404, lat: 39.915}, name: '', intro: '', planId: 0,
        };
      },
      submitSpotForm(formName) {
        this.$refs[formName].validate(valid => {
          if (!valid) {
            return false;
          } else {
            // create spot
            if (this.spot.id === 0) {
              console.log(JSON.stringify(this.spot));
              // createGroup(this.spot)
              //   .then(result => {
              //     this.cancelSpotForm();
              //   })
              //   .catch(err => {
              //     this.$notify.error({
              //       title  : 'create spot error',
              //       message: err
              //     });
              //     console.log(err);
              //   });
            } else {
              // edit group
              console.log(JSON.stringify(this.spot));
              // updateGroup(this.spot)
              //   .then(result => {
              //     this.cancelSpotForm();
              //   })
              //   .catch(err => {
              //     this.$notify.error({
              //       title  : 'update spot error',
              //       message: err
              //     });
              //     console.log(err);
              //   });
            }

            this.Spots.push(this.spot);
            this.cancelSpotForm();
          }
        });
      },
    }
  }
</script>

<style scoped>
  .bm-view {
    width: 80%;
    height: 300px;
  }

  .map {
    width: 80%;
    height: 400px;
  }
</style>

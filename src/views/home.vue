<template>
  <el-row>
    <app-header/>
    <h1>home</h1>
  </el-row>
</template>

<script>
  import AppHeader from '../components/header';

  export default {
    name      : "home",
    components: {
      'app-header': AppHeader
    },
  }
</script>

<style scoped>

</style>

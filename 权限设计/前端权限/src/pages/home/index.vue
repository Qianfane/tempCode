<template>
    <div>
      home 
      <el-button v-if="usePermission('/home/index','editor')">可编辑的</el-button>  
      <userInfo></userInfo>
    </div>
</template>
<script setup>
import {usePermission} from '@/hook/usePermission'
import userInfo from './loader!./component/userInfo?path=/home/index&permission=editor'


const name = "/home/index"


</script>
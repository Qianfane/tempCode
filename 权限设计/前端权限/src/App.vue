<template>
    <div>
        <div>1 -- {{menus}}</div>
        <el-menu  @select="handleSelect">
            <subMenu v-for="item in menus" 
            :data="item">{{item.name}}</subMenu>
        </el-menu>
        <router-view>
        </router-view>
    </div>
</template>
<script setup>
import {ref} from 'vue'
import { useRouter } from 'vue-router';
import {getMenus} from '@/data/permission'
import subMenu from '@/components/subMenu'

const menus = ref([])
async function getData(){
    const data = await getMenus()
    menus.value = data
}

getData()


const router = useRouter()

function handleSelect(path){
    
    router.push(path)
}
</script>
  

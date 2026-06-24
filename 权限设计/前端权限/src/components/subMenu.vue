<template>
    <template v-if="data.children">
        <el-sub-menu :index="data.path">
            <template #title>{{data.title}}</template>
            <subMenu :data="item" v-for="item in data.children"></subMenu>
        </el-sub-menu>

    </template>
    <template v-else>
        <el-menu-item :index="data.path">{{ data.title }}</el-menu-item>
    </template>
</template>
<script setup name="subMenu">
const { data } = defineProps(["data"])
</script>
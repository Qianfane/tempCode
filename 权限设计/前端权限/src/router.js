import { createMemoryHistory, createWebHashHistory, createRouter } from 'vue-router'
import { getRouter ,getUser} from '@/data/permission'


const routes = [
    { path: '/404', component: () => import("@/pages/404/index") },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

// 用来远程获取权限信息
// 第一种结构：类似于若依，内容是由后端决定的【对前端工程化有一定影响】

router.beforeEach(async (to, from, next) => {
    if (!flag) {
        flag = true
        await addRouter()
        // 动态新增的路由，在本次不会找到，需要重新进程查询
        // 而next包含参数后，会进行beforEach的查询
        next({ 
            ...to, 
            // replace:true
        })
    }
    // 判断是否有路由权限
    const user = await getUser()
    if(!to.meta.permission || user.permission.includes(to.meta.permission)){
        next()
    }else{
        next({
            path:'/404'
        })
    }
})


let flag = false
async function addRouter() {
    const routers = await getRouter()
    routers.forEach((route) => {
        router.addRoute(route)
    })
}


export default router
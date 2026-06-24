import _ from 'lodash'

/**
 * 后端设计的结构有好几种
 * - 类似于ry 
 *  - 返回menus 
 *  - 返回权限【个人权限接口或user接口】
 * 
 * - ry2
 *  - 返回menus + meta:permission
 * 
 * - rbac
 */
const api = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                status: 200,
                data: [{
                    title: "个人",
                    children: [{
                        title: "个人看板",
                        meta: { // 路由权限
                            permission: 'admin'
                        },
                        path: "/my/index"
                    }, {
                        title: "设置",
                        path: "/my/setting"
                    }]
                }, {
                    title: "首页",
                    children: [{
                        title: "首页",
                        path: "/home/index"
                    }]
                }]
            })
        }, 1000)
    })
}

const api2 = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                status: 200,
                data: {
                    id: 123,
                    name: "程源",
                    permission: ["admin", "editor"],// 个人角色
                    list: [{ // 按钮权限
                        path: "/home/index",
                        permission: { // 随意配置，类似于埋点信息平台
                            editor: true, // 
                            xxx_xx: ""
                        }
                    }]
                }
            })
        }, 1000)
    })
}



// 代理请求，整个逻辑只需要请求一次
function proxyApi(api) {
    let cache
    return () => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!cache) {
                    cache = api()
                }
                const res = await cache
                resolve(res)
            } catch (error) {
                reject(error)
            }
        })
    }
}

const proxyMenu = proxyApi(api)
const proxyUser = proxyApi(api2)

// 获取菜单信息
export async function getMenus() {
    const { data } = await proxyMenu()
    return data
}

function flatByChildren(data) {
    if (data.children) {
        return [...data.children]
    }
    return data
}
// 有一个loadsh的方法可以处理
function flat(arr) {
    return arr.map(item => {
        return flatByChildren(item)
    }).flat()
}

// 获取菜单信息
export async function getRouter() {
    const { data } = await proxyMenu()

    return _.chain(flat(data))
        // 根据meta信息，进行过滤，不存在就不进行注册 
        // .filter((item)=>{ // 可以无视
        //     return !item.path
        // })
        .map(({ path, title, ...item }) => {
            return {
                ...item,
                path,
                component: () => import(`@/pages${path}.vue`)
            }
        })
        .value()
}

export  let mapping = {}


export async function getUser() {
    const { data } = await proxyUser()
    data.list.forEach(item => {
        mapping[item.path] = item 
    });
   
    return data
}


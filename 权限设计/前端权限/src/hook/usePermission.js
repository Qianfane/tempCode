import {mapping} from '@/data/permission'

// 很多人称他为hook，个人认为为utils
/**
 * 设计的方式同样好几种
 * 1. 只处理角色，不做精细化细分
 * 
 * 2. 有精细化处理，需要一个page的内容
 * 此处的权限，是聚合后的权限，由很多业务逻辑更痛组合而成
 user:[{
    path:"/home/index",
    // id:"xx"
    // name:  "home_index"
    permission:{ // 随意配置，类似于埋点信息平台
        editor:"xxx",
        xxx_xx:""
    }
 }]
 */


// 按钮级别的权限
// 在路由中，保证user接口一定会进行读取
export  function  usePermission(path,permission){
    // const mapping = await getMapping()
    
    return mapping[path].permission[permission] === true
}
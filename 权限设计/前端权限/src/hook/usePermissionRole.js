import {mapping} from '@/data/permission'
// 此处用来获取 是否包含某个角色的信息，实现略
export  function  usePermissionRole(path,permission){
    // const mapping = await getMapping()
    
    return mapping[path].permission[permission] === true
}
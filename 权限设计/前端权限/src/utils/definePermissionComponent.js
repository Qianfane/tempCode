import {usePermission} from '@/hook/usePermission'

export function definePermissionComponent(component,path,permission){
    if(usePermission(path,permission)){
        return component
    }
}
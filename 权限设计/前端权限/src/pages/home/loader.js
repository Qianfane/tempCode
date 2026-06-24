const qs = require('qs')

exports.default = function (source){
    const ls = source.split("\n")
    ls.pop()
    
    const query = qs.parse(this.resourceQuery.slice(1))

    ls.push(`
    import {definePermissionComponent} from '@/utils/definePermissionComponent'
    export default definePermissionComponent(__exports__,"${query.path}","${query.permission}")
    `)

    return ls.join("\n")
}
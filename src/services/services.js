import * as draft from './draft'
import * as resource from './resource'
import * as role from './role'
import * as user from './user'

const services = {
    draft,
    resource,
    role,
    user,
    article: draft,
}

export default services;
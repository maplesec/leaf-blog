'use strict';

import acL_resource from './acl_resource';
import acl_role from './acl_role';
import acl_user from './acl_user';
import draft from './draft';
import category from './category';

export default app => {
    app.use('/api/acL_resource', acL_resource);
    app.use('/api/acl_role', acl_role);
    app.use('/api/acl_user', acl_user);
    app.use('/api/draft', draft);
    app.use('/api/category', category);
}
export default 
{
    name: 'admin-role',
    allows: [
        {
            resources: 'user',
            permissions: ['show', 'operate']
        },
        {
            resources: 'role',
            permissions: ['show', 'operate']
        },
        {
            resources: 'resource',
            permissions: ['show', 'operate']
        }
    ]
}

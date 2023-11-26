import request from '@/utils/request'

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/cbmsUser/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(id) {
  return request({
    url: '/cbmsUser/' + id,
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/cbmsUser',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/cbmsUser',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(id) {
  return request({
    url: '/cbmsUser/' + id,
    method: 'delete'
  })
}

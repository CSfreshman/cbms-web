import request from '@/utils/request'

// 查询美容项目列表
export function listProject(query) {
  //return service.get("/cbmsProject/list?pageNum=" + query.pageNum + "&pageSize=" + query.pageSize)
  return request({
    url: '/cbmsProject/list',
    method: 'get',
    params: query
  })
}

// 查询美容项目详细
export function getProject(id) {
  return request({
    url: '/cbmsProject/' + id,
    method: 'get'
  })
}

// 新增美容项目
export function addProject(data) {
  return request({
    url: '/cbmsProject',
    method: 'post',
    data: data
  })
}

// 修改美容项目
export function updateProject(data) {
  return request({
    url: '/cbmsProject',
    method: 'put',
    data: data
  })
}

// 删除美容项目
export function delProject(id) {
  return request({
    url: '/cbmsProject/' + id,
    method: 'delete'
  })
}

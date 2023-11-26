import request from '@/utils/request'

// 查询订单主列表
export function listOrder(query) {
  return request({
    url: '/cbmsOrder/list',
    method: 'get',
    params: query
  })
}

// 查询订单主详细
export function getOrder(id) {
  return request({
    url: '/cbmsOrder/' + id,
    method: 'get'
  })
}

// 新增订单主
export function addOrder(data) {
  return request({
    url: '/cbmsOrder',
    method: 'post',
    data: data
  })
}

// 修改订单主
export function updateOrder(data) {
  return request({
    url: '/cbmsOrder',
    method: 'put',
    data: data
  })
}

// 删除订单主
export function delOrder(id) {
  return request({
    url: '/cbmsOrder/' + id,
    method: 'delete'
  })
}

import request from '@/utils/request'

export function pay(orderCode) {
  return request({
    url: '/shop/pay?orderCode=' + orderCode,
    method: 'get',

  })

}

export function updateNum(id,plusNum) {
  return request({
    url: '/shop/updateNum',
    method: 'post',
    data: {
      "id": id,
      "plusNum": plusNum
    }
  })
}


export function getAll() {
  return request({
    url: '/shop/getAll',
    method: 'post'
  })
}

export function addToCart(row) {
  return request({
    url: '/shop/addToCart',
    method: 'post',
    data: row
  })
}

export function doOrder(cartData,carCard,phone){
  return request({
    url: '/shop/doOrder',
    method: 'post',
    data: {
      "cartData" : cartData,
      "carCard" : carCard,
      "phone" : phone
    }
  })
}

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

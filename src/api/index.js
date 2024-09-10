import request from "@/utils/request";

// 登录
export const getLogin = (data) => {
  return request({
    url: "/login",
    method: "post",
    data
  });
};


// 获取路由
export const getRouters = () => {
  return request({
    url: "/getRouters",
    method: "get",
  });
};

// 获取天气预报
export const getWeather = (data) => {
  return request({
    url: "/business/weather/getWeatherByTime",
    method: "POST",
    data,
  });
};

// 获取路径详情
export const getLineDetail = (params) => {
  return request({
    url: "/business/plan/detail",
    method: "get",
    params,
  });
};

// 获取运输量
export const getSumInfo = (params) => {
  return request({
    url: "/business/homePage/getHomePageSumInfo",
    method: "get",
    params,
  });
};

// 获取门机
export const getMjInfo = (params) => {
  return request({
    url: "/business/homePage/getMjInfo",
    method: "get",
    params,
  });
};

// 获取警告信息
export const getWarningInfo = (params) => {
  return request({
    url: "/warning/list",
    method: "get",
    params,
  });
};

// 获取计划列表
export const getPlanInfoList = (data) => {
  return request({
    url: "/business/plan/getPlanInfoList",
    method: "post",
    data,
  });
};
// 获取计划详情
export const getPlanInfo = (data) => {
  return request({
    url: "/business/plan/getPlanInfo",
    method: "post",
    data,
  });
};
export const getArShipInfo = (data) => {
  return request({
    url: "/business/plan/getArShipInfo",
    method: "post",
    data,
  })
}
// 查询设备详细信息
export const getMachineDetail = (params) => {
  return request({
    url: "/business/plan/getMachineDetail",
    method: "get",
    params,
  })
}
// 查询某个点位对应圈数
export const getPointQuanList = (params) => {
  return request({
    url: "/business/plan/allDetail",
    method: "get",
    params,
  })
}
// 查询某个点位具体对应的详细信息和路径
export const getPointInfo = (params) => {
  return request({
    url: "/business/plan/detail",
    method: "get",
    params,
  })
}
// 查询某一个时刻地图上所有点位
export const getAllTypesPointsNow = (params) => {
  return request({
    url: "/business/plan/getNowInfo",
    method: "get",
    params,
  })
}
// 查询货垛信息
export const getBaYardPosition = (data) => {
  return request({
    url: "/business/plan/getBaYardPosition",
    method: "post",
    data,
  })
}
// 查询磅房信息
export const getWeightRoomInfo = (data) => {
  return request({
    url: "/business/plan/getWeightRoomInfo",
    method: "post",
    data,
  })
}
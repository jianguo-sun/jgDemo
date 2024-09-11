import { createRouter, createWebHistory } from "vue-router";
import { usePermissStore } from "../store/permiss";
import Home from "@/views/home/home.vue";

const routes = [
  {
    path: "/",
    redirect: "/bigScreen",
  },
  {
    path: "/bigScreen",
    name: "bigScreen",
    meta: {
      title: "bigScreen",
      permiss: "1",
    },
    component: () =>
      import(/* webpackChunkName: "dashboard" */ "@/views/bigScreen/index.vue"),
  },
  // {
  //   path: "/",
  //   name: "Home",
  //   component: Home,
  //   children: [
  //     {
  //       path: "/dashboard",
  //       name: "dashboard",
  //       meta: {
  //         title: "系统首页",
  //         permiss: "1",
  //       },
  //       component: () =>
  //         import(
  //           /* webpackChunkName: "dashboard" */ "@/views/dashboard/dashboard.vue"
  //         ),
  //     },
  //   ],
  // },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登录",
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/login/login.vue"),
  },
  // {
  //     path: '/403',
  //     name: '403',
  //     meta: {
  //         title: '没有权限',
  //     },
  //     component: () => import(/* webpackChunkName: "403" */ '../views/403.vue'),
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const TokenKey = 'Admin-Token'
router.beforeEach((to, from, next) => {
  document.title = `demo`;
  const token = localStorage.getItem(TokenKey)
  const permiss = usePermissStore();
  if (!token && to.path !== "/login") {
    next("/login");
  } else if (to.meta.permiss && permiss.key.includes(to.meta.permiss)) {
    // 如果没有权限，则进入403
    next("/403");
  } else {
    next();
  }
});

export default router;

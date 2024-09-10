import { defineStore } from "pinia";
import { getLogin } from "@/api/index.js";

const TokenKey = 'Admin-Token'
export const useUserStore = defineStore("user", {
  state: () => ({
    token: "",
    userName: "",
    password: "",
  }),
  actions: {
    login(username, password) {
      return new Promise((resolve, reject) => {
        getLogin({
          username,
          password,
        })
          .then((res) => {
            this.username = username;
            this.password = password;
            this.token = res.token;
            localStorage.setItem(TokenKey, res.token);
            // Cookies.set(TokenKey, token)
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    logout() {
      this.username = "";
      this.password = "";
    },
  },
  persist: true,
});

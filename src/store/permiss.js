import { defineStore } from "pinia";

export const usePermissStore = defineStore('permiss', {
    state: () => {
        const keys = localStorage.getItem('premissList');
        return {
            key: keys ? JSON.parse(keys) : [],
            defaultList: {
                admin: ['1', '2', '3']
            }
        }
    },
    actions: {
        updatePermiss(permiss) {
            localStorage.setItem(JSON.stringify(permiss))
        }
    }
})
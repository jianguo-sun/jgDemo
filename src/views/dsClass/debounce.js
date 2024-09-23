import { customRef } from "vue";
export function debounceRef(value, delay = 1000) {
  let timer;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value
      },
      set(val) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          value = val
          trigger()
        }, delay);

      }
    }
  })
}
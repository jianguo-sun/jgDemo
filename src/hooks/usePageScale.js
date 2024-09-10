import { ref, onMounted, onBeforeUnmount, watchEffect } from "vue";

export function usePageScale(rootDom, fullScreen) {
  // 计算和设置页面缩放
  const setPage = () => {
    // 获取真实视口尺寸
    const currentWidth = document.body.clientWidth;
    const currentHeight = document.body.clientHeight;
    const realWidth = 1920;
    const realHeight = 1080;
    // 计算缩放比例
    const widthScale = currentWidth / +realWidth
    const heightScale = currentHeight / +realHeight
    if (fullScreen) {
      rootDom.value.style.transform = `scale(${widthScale},${heightScale})`
      return false
    }
    const scale = Math.min(widthScale, heightScale)
    autoScale(scale)
  };

  const autoScale = (scale) => {
    const domWidth = rootDom.value.clientWidth
    const domHeight = rootDom.value.clientHeight
    const currentWidth = document.body.clientWidth
    const currentHeight = document.body.clientHeight
    rootDom.value.style.transform = `scale(${scale},${scale})`
    let mx = Math.max((currentWidth - domWidth * scale) / 2, 0)
    let my = Math.max((currentHeight - domHeight * scale) / 2, 0)
    // if (typeof props.autoScale === 'object') {
    //   !props.autoScale.x && (mx = 0)
    //   !props.autoScale.y && (my = 0)
    // }
    rootDom.value.style.margin = `${my}px ${mx}px`
  }

  // 防抖函数
  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
  const debouncedSetPage = debounce(setPage, 200);

  // 页面加载时初始化设置
  onMounted(() => {
    // 监听窗口大小变化
    window.addEventListener("resize", debouncedSetPage);
    // 初始调用
    setPage();
  });

  // 在组件卸载时移除事件监听
  onBeforeUnmount(() => {
    window.removeEventListener("resize", debouncedSetPage);
  });

  return { rootDom };
}

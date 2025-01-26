<template>
  <van-nav-bar
    title="伙伴匹配"
    left-text="返回"
    right-text="按钮"
    left-arrow
    @click-left="onClickLeft"
    @click-right="onClickRight"
    safe-area-inset-top
  >
    <template #right>
      <van-icon name="search" size="18" />
    </template>
  </van-nav-bar>

  <div class="content">
    <RouterView />
  </div>

  <van-tabbar route @change="onChange">
    <van-tabbar-item to="/" icon="home-o">主页</van-tabbar-item>
    <van-tabbar-item to="/team" icon="search">团队</van-tabbar-item>
    <van-tabbar-item to="/search" icon="friends-o">查找</van-tabbar-item>
    <van-tabbar-item to="/user" icon="setting-o">个人</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { showToast } from "vant";
import { ref } from "vue";
import { RouterView, useRouter } from "vue-router";

const router = useRouter();

const onClickLeft = () => history.back();
const onClickRight = () => {
  router.push({
    path:'/searchResult'
  })
}

const onChange = () => {

};
</script>

<style lang="css" scoped>

.content {
  /* flex: 1; 
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100vh; */
}
</style>

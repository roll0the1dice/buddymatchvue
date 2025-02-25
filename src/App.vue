<script setup lang="ts">
import BasicLayout from "./layout/BasicLayout.vue";
import type { ApiResponseBuddyUser } from "./openapi";
import { buddyUserControllerApi } from "./services/request";
import router from "./route";
import { useUserStore } from "./store/userStore";
import { storeToRefs } from "pinia";

const store = useUserStore();
const { user } = storeToRefs(store);
/**
 * 全局权限校验
 */
router.beforeEach(async (to, from, next) => {
  const toUrl = to.fullPath;
  if (!toUrl.startsWith("/user/login")) {
    try {
      const res = await buddyUserControllerApi.getCurrent();
      const _user = JSON.parse(localStorage.getItem("user.value") as string);
      if (!_user) {
        throw new Error("");
      }
      user.value = _user;
    } catch (error) {
      next(`/user/login?redirect=${to.fullPath}`);
      return;
    }
  }
  next();
});
</script>

<template>
  <BasicLayout />
</template>

<style scoped>
#body {
}
</style>

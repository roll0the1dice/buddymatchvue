<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model="username"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
    </van-cell-group>
    <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "../store/userStore";
import { useRoute, useRouter } from "vue-router";
import { buddyUserControllerApi } from "../services/request";
import type { ApiResponseBuddyUser, BuddyUserLoginRequest } from "../openapi";
import { showToast } from "vant";

const password = ref("");
const username = ref("");

const store = useUserStore();
const { user, isLogin } = storeToRefs(store);

const route = useRoute();
const router = useRouter();

const onSubmit = async () => {
  (async function () {
    const req: BuddyUserLoginRequest = {
      username: username.value,
      password: password.value,
    };
    const res = await buddyUserControllerApi.userLogin(req);
    const { data, statusCodeValue }: ApiResponseBuddyUser = res.data;
    if (statusCodeValue === 200 && data) {
      console.log("data", data);
      user.value = data;
      user.value.userId = data.id;
      localStorage.setItem("user.value", JSON.stringify(user.value));
      isLogin.value = true;
      showToast("登录成功");

      // 跳转到之前的页面
      const redirectUrl = (route.query?.redirect as string) ?? "/";
      const baseUrl = window.location.origin;
      const path = redirectUrl.replace(baseUrl, "");
      router.replace({
        path,
      });
    }
  })();
};

onMounted(() => {
  if (isLogin.value) {
    // 跳转到之前的页面
    router.push({
      path: "/user",
    });
  }
});
</script>

<template>
  <div v-if="isCurrentUser">
    <van-cell-group inset>
      <van-cell
        title="昵称"
        size="large"
        is-link
        @click="() => onUserEdit('displayName', '昵称', user.displayName)"
        arrow-direction="right"
        :value="user.displayName"
      />
      <van-cell
        title="账号"
        size="large"
        is-link
        arrow-direction="right"
        :value="user.username"
      />
      <van-cell
        title="个人简介"
        is-link
        @click="() => onUserEdit('personalBio', '个人简介', user.personalBio)"
        arrow-direction="right"
        :value="user.personalBio"
      />
      <van-cell
        title="注册时间"
        is-link
        arrow-direction="right"
        :value="user.createTime"
      />
    </van-cell-group>
    <van-button plain block type="primary" style="padding: 15px" @click="logout"
      >登出</van-button
    >
  </div>
  <div class="loading" v-else>
    <van-loading color="#0094ff"> 加载中 </van-loading>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { type UserType } from "../models/user";
import { onMounted, ref, type Ref } from "vue";
import { useUserStore } from "../store/userStore";
import { storeToRefs } from "pinia";
import { showToast } from "vant";
import { buddyUserControllerApi } from "../services/request";
import type { ApiResponseBuddyUser, ApiResponseObject } from "../openapi";

const router = useRouter();

const store = useUserStore();
const { user, isLogin, isCurrentUser } = storeToRefs(store);

//const isFetch = ref(false);

onMounted(async () => {
  if (isCurrentUser.value == false) {
    const res = await buddyUserControllerApi.getCurrent();
    const { data, statusCodeValue }: ApiResponseBuddyUser = res.data;
    if (statusCodeValue === 200 && data) {
      user.value = data;
      user.value.userId = data.id;
      
      isCurrentUser.value = true;
      console.log(typeof user.value, "res");
    }
  }
});

const onUserEdit = (editKey: string, editName: string, editValue: any) => {
  router.push({
    path: "/user/edit/",
    query: { editKey, editName, editValue },
  });
};

const logout = async () => {
  const res = await buddyUserControllerApi.userLogout();
    const { data, statusCodeValue }: ApiResponseObject = res.data;
    if (statusCodeValue === 200 && data) {
      showToast("退出成功");
      window.location.reload();
    }
};
</script>

<style lang="css" scoped>
.loading {
  text-align: center;
}
</style>

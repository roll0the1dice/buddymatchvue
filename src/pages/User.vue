<template>
  <div  v-if="isCurrentUser">
    
    <van-cell-group inset>
      <van-cell title="昵称" size="large" is-link @click="() => onUserEdit('displayName', '昵称', user.displayName)"
        arrow-direction="right" :value="user.displayName" />
      <van-cell title="账号" size="large" is-link
        arrow-direction="right" :value="user.username" />
      <van-cell title="个人简介" is-link @click="() => onUserEdit('personalBio', '个人简介', user.personalBio)"
        arrow-direction="right" :value="user.personalBio" />
      <van-cell title="注册时间" is-link
        arrow-direction="right" :value="new Date(user.createTime).toLocaleDateString()" />
    </van-cell-group>
    <van-button plain block type="primary" style="padding: 15px;" @click="logout">登出</van-button>
  </div>
  <div class="loading" v-else>
    <van-loading color="#0094ff"> 加载中 </van-loading>
  </div>

</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { type UserType } from "../models/user";
import { onMounted, ref, type Ref } from "vue";
import myAxios from "../request/request";
import { useUserStore } from "../store/userStore";
import { storeToRefs } from "pinia";
import { showToast } from "vant";

const router = useRouter();

const store = useUserStore();
const { user, isLogin, isCurrentUser } = storeToRefs(store);

//const isFetch = ref(false);

onMounted(async () => {
  if (isCurrentUser.value == false)
    myAxios
      .get("/buddyuser/current")
      .then((res) => {
        user.value =  res.data.data;
        isCurrentUser.value = true;
        console.log(typeof user.value, 'res');
      })
      .catch((err) => {
        console.log(err);
      });
});

const onUserEdit = (editKey: string, editName: string, editValue: any) => {
  router.push({
    path: "/user/edit/",
    query: { editKey, editName, editValue },
  });
};

const logout = async () => {
  myAxios.get('/buddyuser/logout')
  .then((res) => {
    const { statusCodeValue } = res.data;
    if(statusCodeValue === 200)
      showToast("退出成功");
      window.location.reload();
  })
  .catch((err) => {
    showToast("退出失败");
  })
}

</script>

<style lang="css" scoped>
.loading {
  text-align: center;
}
</style>

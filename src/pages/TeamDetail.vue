<template>
  <div v-if="userList.length > 0">
    <van-card
      v-for="_user in userList"
      :desc="_user.personalBio"
      :title="`${_user.displayName}`"
      :thumb="_user.avatar"
    >
      <template #tags>
        <van-tag plain type="danger" v-for="tag in _user.tagName">
          <span> {{ tag }} </span>
        </van-tag>
      </template>
      <template #footer>
        <van-button
          v-if="user.userId == _user.userId"
          size="small"
          plain
          @click="doQuitTeam(_user.userId)"
          >退出队伍
        </van-button>
      </template>
    </van-card>
    <van-empty description="后面没有啦" />
  </div>
  <div v-else>
    <van-empty description="队伍中不存在队员">
      <!-- <van-button round type="primary" class="bottom-button" @click="goBack">返回</van-button> -->
    </van-empty>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast } from 'vant';
import { useUserStore } from '../store/userStore';
import { storeToRefs } from 'pinia';
import { teamControllerApi, teamUserControllerApi } from '../services/request';
import type { ApiResponseListBuddyUser, BuddyUser } from '../openapi';

const userList: Ref<BuddyUser[]> = ref<BuddyUser[]>([] as BuddyUser[]);

const route = useRoute();
const id = route.query?.id;

const router = useRouter();

const store = useUserStore();
const { user } = storeToRefs(store);

const newFunction = async () => {
  
    const res = await teamUserControllerApi.findUserForTheTeam(Number(id)); //myAxios.get(`/teamuser/detail/${id}`);
    const {data, statusCodeValue}: ApiResponseListBuddyUser = res.data;
    if (statusCodeValue === 200 && data) {
      userList.value = data.map((user: BuddyUser) => {
        const tagList = JSON.parse(user.tagName as string);
        user.tagName = tagList;
        return user;
      });
    }

}

onMounted(async () => {
  console.log('user.userId', user.value.userId);
  await newFunction();


});

const goBack = () => {
  router.back();
}

/**
 * 退出队伍
 * @param id
 */
const doQuitTeam = async (userId: any) => {
  console.log('userId    user.userId', userId, user.value.userId);
  try {
    const res = await teamUserControllerApi.userLeaveTeam(Number(userId)); //myAxios.post(`/teamuser/leave/${id}`);
    const { data, statusCodeValue } = res.data;
  if (statusCodeValue === 200 && data) {
    showToast('操作成功');
    await newFunction();
  }
  } catch (error) {
    showToast('操作失败');
  }

  
  //refreshKey.value += 1;

}
</script>

<style lang="css" scoped>
span {
  margin-right: 10px;
}

.loading {
  text-align: center;
}
</style>

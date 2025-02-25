<template>
  <van-cell center title="心动模式">
    <template #right-icon>
      <van-switch
        v-model="isMatchMode"
        @update:model-value="onUpdateValue"
        size="24"
      />
    </template>
  </van-cell>
  <div v-if="userList.length > 0">
    <van-card
      v-for="user in userList"
      :desc="user.personalBio"
      :title="`${user.displayName}`"
      :thumb="user.avatar"
    >
      <template #tags>
        <van-tag plain type="danger" v-for="tag in user.tagName">
          <span> {{ tag }} </span>
        </van-tag>
      </template>
      <template #footer>
        <van-button size="mini">Contact Me</van-button>
      </template>
    </van-card>
    <van-empty description="后面没有啦" />
  </div>
  <div v-else class="loading">
    <van-skeleton title avatar :row="3" v-for="_ in [...Array(3)]" />
    <!-- <van-loading color="#0094ff" > 加载中 </van-loading> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
import { showConfirmDialog } from "vant";
import { buddyUserControllerApi } from "../services/request";
import type { ApiResponseCustomPageImplBuddyUser, ApiResponseListBuddyUser, BuddyUser } from "../openapi";

const isMatchMode = ref(false);

const userList: Ref<BuddyUser[]> = ref<BuddyUser[]>([] as BuddyUser[]);

onMounted(async () => {
  const page = 0;
  const size = 3;
  const res = await buddyUserControllerApi.getUsers(page, size);
  const { data, statusCodeValue }: ApiResponseCustomPageImplBuddyUser =
    res.data;
  if (statusCodeValue === 200) {
    const _data = data?.content as BuddyUser[];
    userList.value = _data.map((user: BuddyUser) => {
      const tagList = JSON.parse(user.tagName as string);
      user.tagName = tagList;
      return user;
    });
  }
});

const onUpdateValue = async (newValue: any) => {
  isMatchMode.value = newValue;
  const num = 3;
  const res = await buddyUserControllerApi.matchUsers(num);
  const {data, statusCodeValue }: ApiResponseListBuddyUser = res.data;
  if (statusCodeValue === 200 && data) {
      console.log("/buddyuser/match", data);
      userList.value = data.map((user: BuddyUser) => {
        const tagList = JSON.parse(user.tagName as string);
        user.tagName = tagList;
        return user;
      });
  }
};
</script>

<style lang="css" scoped>
span {
  margin-right: 10px;
}

.loading {
  text-align: center;
}
</style>

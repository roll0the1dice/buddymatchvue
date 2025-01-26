<template>
  <div id="teamPage">
    <van-search v-model="searchText" placeholder="搜索队伍" @search="onSearch" />
    <van-tabs v-model:active="active" @change="onTabChange">
      <van-tab title="公开" name="public" />
      <van-tab title="加密" name="private" />
    </van-tabs>
    <div style="margin-bottom: 16px">
      <van-button class="add-button" type="primary" icon="plus" @click="toAddTeam" />
      <div style="margin-bottom: 3px"></div>
      <TeamCardList :teamList="teamList" :current-user="user"  :force-refresh="forceRefresh"  />
      <van-empty description="后面没有啦" />
    </div>
  </div>
</template>

<script setup lang="ts">

import { useRouter } from "vue-router";
import { onMounted, ref, type Ref } from "vue";
import { showToast, Toast } from "vant";
import myAxios from "../request/request";
import type { TeamType } from "../models/user";
import { teamStatusEnum } from '../constants/team';
import { useUserStore } from "../store/userStore";
import { storeToRefs } from "pinia";
import TeamCardList from '../components/TeamCardList.vue'

const active = ref('public')
const router = useRouter();
const searchText = ref('');
const refreshKey = ref(0);

const store = useUserStore();
const { user, team } = storeToRefs(store);

/**
 * 切换查询状态
 * @param name
 */
const onTabChange = (name: any) => {
  // 查公开
  if (name === 'public') {
    listTeam(0);
  } else {
    // 查加密
    listTeam(1);
  }
}

// 跳转到创建队伍页
const toAddTeam = () => {
  router.push({
    path: "/team/added"
  })
}

const teamList: Ref<TeamType[]> = ref<TeamType[]>([] as TeamType[]);

/**
 * 搜索队伍
 * @param val
 * @param status
 * @returns {Promise<void>}
 */
const listTeam = async (status: number = 0) => {
  const res = await myAxios.get("/team/getTeamByPage", {
    params: {
      status,
    },
  });
  const { data } = res;
  //console.log(data);
  if (data.statusCodeValue === 200) {
    //console.log('teamList', res.data);
    teamList.value = data.data.content;
  } else {
    showToast('加载队伍失败，请刷新重试');
  }
}

// 页面加载时只触发一次
onMounted(() => {
  listTeam();
})

const onSearch = (val: any) => {
  listTeam();
};

const forceRefresh = (status: number = 0) => {
  //refreshKey.value = refreshKey.value + 1;
    // 查公开
  if (active.value === 'public') {
    listTeam(0);
  } else {
    // 查加密
    listTeam(1);
  }
};


</script>

<style scoped>
#teamPage {}
</style>
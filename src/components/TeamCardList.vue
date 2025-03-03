<template>
  <div id="teamCardList">
    <van-card
      v-for="team in teamList"
      :thumb="team.avatar"
      :desc="team.description"
      :title="`${team.teamName}`"
    >
      <template #tags>
        <van-tag plain type="danger" style="margin-right: 8px; margin-top: 8px">
          {{ teamStatusEnum[team.teamStatus as keyof typeof teamStatusEnum] }}
        </van-tag>
      </template>
      <template #bottom>
        <div>
          {{ `队伍人数: ${team.hasJoinNum}/${team.maxNum}` }}
        </div>
        <div v-if="team.expireTime">
          {{ "过期时间: " + team.expireTime }}
        </div>
        <div>
          {{ "创建时间: " + team.createTime }}
        </div>
      </template>
      <template #footer>
        <van-button
          size="small"
          type="primary"
          plain
          @click="checkTeamDetail(team)"
        >
          查看队伍
        </van-button>
        <van-button
          size="small"
          type="primary"
          v-if="team.userId !== currentUser?.id && !team.hasJoin"
          plain
          @click="preJoinTeam(team)"
        >
          加入队伍
        </van-button>
        <van-button
          v-if="team.userId === currentUser?.id"
          size="small"
          plain
          @click="doUpdateTeam(Number(team.id))"
          >更新队伍
        </van-button>
        <!-- 仅加入队伍可见 -->
        <van-button
          v-if="team.userId === currentUser?.id"
          size="small"
          type="danger"
          plain
          @click="doDeleteTeam(Number(team.id))"
          >解散队伍
        </van-button>
      </template>
    </van-card>
    <van-dialog
      v-model:show="showPasswordDialog"
      title="请输入密码"
      show-cancel-button
      @confirm="doJoinTeam(tmpTeam)"
      @cancel="doJoinCancel"
    >
      <van-field v-model="password" placeholder="请输入密码" />
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
import { showToast } from "vant";
import { useRouter } from "vue-router";
import { teamStatusEnum } from "../constants/team";
import { useUserStore } from "../store/userStore";
import { storeToRefs } from "pinia";
import { teamUserControllerApi } from "../services/request";
import type { ApiResponseTeamUser, BuddyUser, Team, TeamUser } from "../openapi";

const props = defineProps<{
  teamList: Team[];
  currentUser: BuddyUser;
  forceRefresh: any;
}>();

const showPasswordDialog = ref(false);
const joinTeamId = ref(0);
const password = ref("");
const tmpTeam: Ref<Team> = ref<Team>({} as Team);

const router = useRouter();
const store = useUserStore();
const { user } = storeToRefs(store);

const preJoinTeam = (team: Team) => {
  tmpTeam.value = team;
  joinTeamId.value = Number(team.id);
  if (team.teamStatus == "0") {
    doJoinTeam(team);
  } else {
    showPasswordDialog.value = true;
  }
};

onMounted(() => {
  console.log("fuck TeamCardList");
});

const checkTeamDetail = async (_team: Team) => {
  // const { id, description, maxNum, expireTime, userId, createTime, updateTime, isDelete, teamStatus, teamName, avatar, hasJoinNum, hasJoin, password } = _team;
  // id: number,
  // description: string,
  // maxNum: number,
  // expireTime: Date,
  // userId: number,
  // createTime: Date,
  // updateTime: Date,
  // isDelete: number,
  // teamStatus: string,
  // teamName: string,
  // avatar: string,
  // hasJoinNum: number,
  // hasJoin: number,
  // password: string,
  router.push({
    path: "/team/detail",
    query: { id: _team.id },
  });
};

const doJoinCancel = () => {
  joinTeamId.value = 0;
  password.value = "";
};

/**
 * 加入队伍
 */
const doJoinTeam = async (team: Team) => {
  if (!joinTeamId.value) {
    return;
  }
  console.log("password", password.value);
  const postTeamData = { ...team };
  postTeamData.password = password.value;
  console.log("team", postTeamData);
  const _team: Team = {
    id: team.id,
    avatar: team.avatar,
    createTime: team.createTime,
    description: team.description,
    expireTime: team.expireTime,
    hasJoin: team.hasJoin,
    hasJoinNum: team.hasJoinNum,
    isDelete: team.isDelete,
    maxNum: team.maxNum,
    password: team.password,
    teamName: team.teamName,
    teamStatus: team.teamStatus,
    updateTime: team.updateTime,
    userId: team.userId,
  };
  const res = await teamUserControllerApi.userJoinTeam(Number(team.id)); //await myAxios.post(`/teamuser/join/${team.id}`, postTeamData);

  const { data, statusCodeValue }: ApiResponseTeamUser = res.data;

  console.log("doJoinTeam", res);

  if (statusCodeValue === 200 && data) {
    showToast("加入成功");
    doJoinCancel();
    props.forceRefresh();
  } else {
    showToast("加入失败" + (res.statusText ? `，${res.statusText}` : ""));
  }
};

/**
 * 跳转至更新队伍页
 * @param id
 */
const doUpdateTeam = (id: number) => {
  router.push({
    path: "/team/update",
    query: {
      id,
    },
  });
};

//const refreshKey = ref(0);

// const forceRefresh = () => {
//   //refreshKey.value += 1; // 修改 key 值
//   //console.log('Key changed:', refreshKey.value); // 确认值已变化
// };
/**
 * 退出队伍
 * @param id
 */
const doQuitTeam = async (id: number) => {
  const res = await teamUserControllerApi.userLeaveTeam(Number(id)); //await myAxios.post(`/teamuser/leave/${id}`);
  const { data, statusCodeValue } = res.data;
  if (statusCodeValue === 200 && data) {
    showToast("操作成功");
  } else {
    showToast("操作失败" + (res.statusText ? `，${res.statusText}` : ""));
  }
  //refreshKey.value += 1;
};

/**
 * 解散队伍
 * @param id
 */
const doDeleteTeam = async (id: number) => {
  const res = await teamUserControllerApi.userDiscardTeam(Number(id)); //await myAxios.delete(`/teamuser/discard/${id}`);
  const { data, statusCodeValue } = res.data;
  if (statusCodeValue === 200) {
    showToast("操作成功");
    props.forceRefresh();
  } else {
    showToast("操作失败" + (res.statusText ? `，${res.statusText}` : ""));
  }
};
</script>

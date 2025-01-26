<template>
  <van-form @submit="onSubmit">
    <van-cell-group>
      <van-field v-model="postTeamData.teamName" name="name" label="队伍名" placeholder="请输入队伍名"
        :rules="[{ required: true, message: '请输入队伍名' }]" />
      <van-field v-model="postTeamData.description" rows="2" autosize label="队伍描述" type="textarea" maxlength="50"
        placeholder="请输入描述" show-word-limit :rules="[{ required: true, message: '请输入队伍描述' }]" />
      <van-field label="过期时间" :placeholder="currentDate.toLocaleDateString()" @click="showPopup" />
      <van-popup v-model:show="show" :style="{ width: '100vw' }">
        <van-date-picker v-model="currentDateArr" title="选择日期" :min-date="minDate" :max-date="maxDate"
          @confirm="comfirm" @cancel="cancel" />
      </van-popup>
      <div class="stepper">
        <div>队伍可加入最大人数</div>
        <div>
          <van-stepper min="3" max="10" v-model="postTeamData.maxNum" theme="round" button-size="22" disable-input />
        </div>
      </div>
      <div class="stepper">
        <div>队伍状态</div>
        <div>
          <van-radio-group direction="horizontal" v-model="postTeamData.teamStatus">
            <van-radio name="0">公开</van-radio>
            <van-radio name="1">私有</van-radio>
            <van-radio name="2">加密</van-radio>
          </van-radio-group>
        </div>
      </div>
      <van-field v-if="true" type="password" name="password" v-model="postTeamData.password" label="密码"
        placeholder="请输入队伍密码" />
    </van-cell-group>
    <div style="margin: 16px; text-align: right">
      <van-button round size="large" type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import { showToast } from "vant";
import { onMounted, ref, type Ref } from "vue";
import myAxios from "../request/request";
import type { TeamType } from "../models/user";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useUserStore } from "../store/userStore";

const teamName = ref("");
const message = ref("");
const currentDateArr = ref(["2021", "01", "01"]);
const currentDate = ref(new Date());
const minDate = ref(new Date(2020, 0, 1));
const maxDate = ref(new Date(2025, 5, 1));
const maxNum = ref(3);
const show = ref(false);
const store = useUserStore();
const { user } = storeToRefs(store);

const showPopup = () => {
  show.value = true;
};

const route = useRoute();
const id: number = Number(route.query.id);

onMounted(async () => {
  const tmp = new Date();
  const tomorrow = tmp.getTime() + 24 * 60 * 60 * 1000;
  currentDate.value = new Date(tomorrow);
  currentDateArr.value[0] = currentDate.value.getFullYear().toString();
  currentDateArr.value[1] = (currentDate.value.getMonth() + 1).toString();
  currentDateArr.value[2] = (currentDate.value.getDate()).toString();
  minDate.value = currentDate.value;
  maxDate.value = new Date(currentDate.value);
  maxDate.value.setFullYear(currentDate.value.getFullYear() + 2);

  if (id <= 0) {
    showToast('加载队伍失败');
    return;
  }

  myAxios.get(`/team/one/${id}`)
    .then((res) => {
      const { data, statusCodeValue } = res.data;
      if (statusCodeValue === 200 && data) {
        postTeamData.value = data;
        postTeamData.value.teamStatus = String(data.teamStatus);
        console.log('data', data);
      }
    })
    .catch((err) => {
      console.log(err);
    })

});

const comfirm = (e: any) => {
  const { selectedValues } = e;

  const year = parseInt(selectedValues[0], 10); // 2021
  const month = parseInt(selectedValues[1], 10) - 1; // 0（一月）
  const day = parseInt(selectedValues[2], 10); // 1

  const date = new Date(year, month, day);
  currentDate.value = date;
  postTeamData.value.expireTime = date;
  show.value = false;
};

const cancel = () => {
  show.value = false;
};

const postTeamData: Ref<TeamType> = ref({} as TeamType);

const router = useRouter();

const onSubmit = async () => {
  const postData = {
    ...postTeamData.value,
    teamStatus: Number(postTeamData.value.teamStatus)
  }
  console.log('postData', postData);
  // todo 前端参数校验
  const res = await myAxios.put(`/team/replaceTeam/${id}`, postData);
  const { data, statusCode, statusCodeValue } = res.data;
  if (statusCodeValue === 200 && data) {
    showToast("修改成功");
    router.push({
      path: '/team',
      replace: true,
    });
  } else {
    showToast('修改失败');
  }
};
</script>

<style lang="css" scoped>
.stepper {
  display: flex;
  justify-content: space-between;
  padding: 15px;
}
</style>

<template>
  <div v-if="userList">
  <van-card
    v-for="user in userList"
    :desc="user.personalBio"
    :title="user.displayName"
    :thumb="user.avatar"
  >
    <template #tags>
      <van-tag plain type="danger" v-for="tag in tags"
        ><span>{{ tag }}</span></van-tag
      >
      <van-tag plain type="primary">标签</van-tag>
    </template>
    <template #footer>
      <van-button size="normal">Contact Me</van-button>
    </template>
  </van-card>
</div>
<div class="loading" v-else>
    <van-loading color="#0094ff"> 加载中 </van-loading>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { UserTagType, UserType } from "../models/user";
import myAxios from "../request/request";
import qs from "qs";
import { useUserStore } from "../store/userStore";
import { storeToRefs } from "pinia";
import { showSuccessToast, showFailToast } from 'vant';

const route = useRouter();

const searchText = ref("");

const mockUser: UserType = {
  id: 1,
  tagName: '["python"]',
  userId: 0,
  parentId: 0,
  isParent: 0,
  createTime: new Date(),
  updateTime: new Date(),
  isDelete: 0,
  displayName: "Brian",
  personalBio:
    "Hello, my name is [Your Name].",
  username: "user123",
  password: "",
  avatar: "",
};

const userList: Ref<UserType[]> = ref<UserType[]>([] as UserType[]);

let tags: string[] = [];

onMounted(() => {
  const store = useUserStore();
  const { activeIds } = storeToRefs(store);

  tags = activeIds.value.map((tag: UserTagType) => tag.text);

  // console.log("tags", tags);

  if (tags.length > 0) {
    myAxios
      .get("/buddyuser/search/tags", {
        params: {
          tagNameList: tags,
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { indices: false });
        },
      })
      .then((res) => {
        //console.log("res.data", res.data);
        const arr = res.data._embedded.buddyUserList;
        userList.value = arr;
        var result = arr.map((user: UserType) => {
          console.log(JSON.parse(user.tagName));
          const _tagNameList = JSON.parse(user.tagName);
          return _tagNameList;
        });

        tags = [].concat(...result);

        showSuccessToast('获取成功');
      })
      .catch((err) => {
        showFailToast('获取失败');
      });
  }
});
</script>

<style lang="css" scoped>
span {
  margin-right: 10px;
}
.loading {
    text-align: center;
  }
</style>

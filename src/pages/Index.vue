<template>
    <van-cell center title="心动模式">
    <template #right-icon>
      <van-switch v-model="isMatchMode" @update:model-value="onUpdateValue" size="24" />
    </template>
  </van-cell>
  <div v-if="userList.length > 0">
    <van-card v-for="user in userList" :desc="user.personalBio" :title="`${user.displayName}`" :thumb="user.avatar">
      <template #tags>
        <van-tag plain type="danger" v-for="tag in user.tagName"> <span> {{ tag }} </span> </van-tag>
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
import type { UserType } from "../models/user";
import myAxios from "../request/request";
import { showConfirmDialog } from 'vant';

// const mockUser: UserType[] = [
//   {
//     id: 1,
//     tagName: '["python"]',
//     userId: 0,
//     parentId: 0,
//     isParent: 0,
//     createTime: new Date(),
//     updateTime: new Date(),
//     isDelete: 0,
//     displayName: "Brian",
//     personalBio:
//       "Hello, my name is [Your Name]. I have [Number] years of experience in [Your Field].",
//     username: "user123",
//     password: "",
//     avatar: "",
//   },
// ];

const isMatchMode = ref(false);

const userList: Ref<UserType[]> = ref<UserType[]>([] as UserType[]);

onMounted(async () => {
  try {
    const res = await myAxios.get('/buddyuser/getUsersByPage', {
      params: {
        page: 0,
        size: 3,
      }
    });
    //console.log(res);
    const data: UserType[] = res.data.data.content;
    userList.value = data.map((user) => {
      const tagList = JSON.parse(user.tagName);
      user.tagName = tagList;
      return user;
    });
    //console.log('index', userList.value);
  } catch (err) {

  }
});

const onUpdateValue = (newValue: any) => {
  isMatchMode.value = newValue;
  myAxios.get('/buddyuser/match', {
      params: {
        num: 3,
      }
    })
    .then((res) => {
      console.log('/buddyuser/match', res);
      const data: UserType[] = res.data.data.content;
      userList.value = data.map((user) => {
        const tagList = JSON.parse(user.tagName);
        user.tagName = tagList;
        return user;
      });
    })
    .catch((err) => {
      console.log(err);
    })


  
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


<template>
  <form action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
      />

      <van-divider content-position="left">已选标签</van-divider>
      <van-row justify="space-around">
        <van-col v-for="tag in activeIds">
          <van-tag TagSize="small" type="primary" closeable @close="onCloseItem(tag)" :key="tag.id">
            {{ tag.text }}
          </van-tag>
        </van-col>
      </van-row>
      <van-divider content-position="left">选择标签</van-divider>
      <van-tree-select
        v-model:main-active-index="activeIndex"
        height="55vw"
        :items="items"
        @click-item="onClickItem"
      />
    
  </form>
</template>

<script setup lang="ts">
import { showToast, type TagType } from "vant";
import { ref, type Ref } from "vue";
import type { UserTagType } from "../models/user";
import  { useUserStore } from "../store/userStore";
import { storeToRefs } from "pinia";

const searchText = ref("");
const onSearch = (val: any) => {
  items.value = tagList.map((parentTag) => {
    const tmpChildren = [...parentTag.children];
    const tempParentTag = { ...parentTag };
    tempParentTag.children = tmpChildren.filter((item) =>
      item.text.includes(searchText.value)
    );
    return tempParentTag;
  });
};

const onCancel = () => {
  items.value = tagList;
  showToast("取消");
};

const UserTagList: UserTagType[]  = [];

const onCloseItem = (tag: UserTagType) => {
  if (UserTagList.includes(tag)) {
    const idx = UserTagList.indexOf(tag);
    UserTagList.splice(idx);
    activeIds.value = [...UserTagList];
  }
  // console.log(UserTagList);
};

const store = useUserStore();
const { activeIds } = storeToRefs(store)

const onClickItem = (tag: UserTagType) => {
  
  if (!UserTagList.includes(tag)) 
  UserTagList.push(tag);

  activeIds.value = [...UserTagList];
};

//const activeIds: Ref<UserTagType[]> = ref([]);

const activeIndex = ref(0);

const tagList = [
  {
    text: "编程语言",
    children: [
      { text: "java", id: 1 },
      { text: "python", id: 2 },
    ],
  },
  {
    text: "年级",
    children: [
      {text: "大一", id: 3},
      {text: "大二", id: 4},
      {text: "大三", id: 5},
      {text: "大四", id: 6},
    ],
  }
];

const items = ref(tagList);
</script>


<style lang="css" scoped>
  div {
    text-align: center;
  }

  .loading {
    text-align: center;
  }
</style>
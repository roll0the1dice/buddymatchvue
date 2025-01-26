import { defineStore } from "pinia";
import { ref, type Ref } from "vue";
import type { TeamType, UserTagType, UserType } from "../models/user";

export const useUserStore = defineStore("loginUser", () => {
  const activeIds: Ref<UserTagType[]> = ref([]);

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
      "Hello, my name is [Your Name]. I have [Number] years of experience in [Your Field].",
    username: "user123",
    password: "",
    avatar: "",
  };

  const user: Ref<UserType> = ref<UserType>({} as UserType);

  const isLogin = ref(false);

  const isCurrentUser = ref(false)

  const currentUser = ref(0);

  const team: Ref<TeamType> = ref<TeamType>({} as TeamType);

  return { activeIds, user, isLogin, isCurrentUser, currentUser, team };
});

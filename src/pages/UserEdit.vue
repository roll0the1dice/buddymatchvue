<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field v-model="editUser.editValue" :name="editUser.editName" :label="editUser.editName"
        :placeholder="editUser.editValue" :rules="[{ required: true, message: `请填写${editUser.editName}` }]" />
    </van-cell-group>
    <div class="button-wrapper">
      <van-button plain block type="success" native-type="submit" class="button">提交</van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { showSuccessToast, showFailToast } from 'vant';
import { useUserStore } from "../store/userStore";
import { storeToRefs } from "pinia";
import { buddyUserControllerApi } from "../services/request";
import type { ApiResponseBuddyUser, BuddyUserUpdateRequest } from "../openapi";

const route = useRoute();

const editUser = ref(
  reactive({
    editKey: route.query.editKey as string,
    editName: route.query.editName as string,
    editValue: route.query.editValue as string,
  })
);

const store = useUserStore();
const { user, isCurrentUser } = storeToRefs(store);

const onSubmit = async () => {

  const req: BuddyUserUpdateRequest = {
    id: user.value.id,
    fieldKey: editUser.value.editKey,
    fieldValue: editUser.value.editValue
  };
  const res = await buddyUserControllerApi.updateBuddyUser(req);

  const { data, statusCodeValue }: ApiResponseBuddyUser = res.data;
  if (statusCodeValue === 200 && data) {
    editUser.value.editValue = "";
    //isCurrentUser.value = false;
    user.value = data;
    user.value.userId = data.id;
    console.log(user.value);
    console.log(res);
    showSuccessToast('修改成功');
  } else {
    showFailToast('修改失败');
  }

}


</script>

<style lang="css" scoped>
.button {
  width: 95vw;
}

.button-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

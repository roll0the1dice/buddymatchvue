<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field v-model="fieldValue" :name="editUser.editName" :label="editUser.editName" :placeholder="editUser.editValue"
        :rules="[{ required: true, message: `请填写${editUser.editName}` }]" />
    </van-cell-group>
    <div class="button-wrapper">
      <van-button plain block type="success" native-type="submit" class="button">提交</van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import myAxios from "../request/request";
import { showSuccessToast, showFailToast } from 'vant';
import { useUserStore } from "../store/userStore";
import { storeToRefs } from "pinia";

const route = useRoute();

onMounted(() => {
  
});

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
  try {
    const res = await myAxios.post("/buddyuser/updateBuddyUser/", {
      "id": user.value.id,
      "fieldKey": editUser.value.editKey,
      "fieldValue": fieldValue.value
    });
    editUser.value.editValue = "";
    //isCurrentUser.value = false;
    user.value = res.data.data;
    console.log(res);
    showSuccessToast('修改成功');

  } catch (err) {
    console.log(err);
    showFailToast('修改失败');
  }
};

const fieldKey = ref("");
const fieldValue = ref("");
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

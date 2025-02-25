import Index from "../pages/Index.vue";
import Search from "../pages/Search.vue";
import User from "../pages/User.vue";
import Team from "../pages/Team.vue";
import SearchResult from "../pages/SearchResult.vue";
import UserEdit from "../pages/UserEdit.vue";
import Login from "../pages/Login.vue";
import TeamAdded from "../pages/TeamAdded.vue";
import TeamUpdated from "../pages/TeamUpdated.vue";
import TeamDetail from "../pages/TeamDetail.vue";
import { createWebHistory, createRouter } from "vue-router";

const routes = [
  { path: "/", component: Index },
  { path: "/team", component: Team },
  { path: "/user", component: User },
  { path: "/search", component: Search },
  { path: "/searchResult", component: SearchResult },
  { path: "/user/edit", component: UserEdit },
  { path: "/user/login", component: Login },
  { path: "/team/added", component: TeamAdded },
  { path: "/team/update", component: TeamUpdated },
  { path: "/team/update", component: TeamUpdated },
  {
    path: "/team/detail",
    // name:"detail",
    component: TeamDetail,
    // props: (route: any) => ({
    //   team: JSON.parse(decodeURIComponent(route.params.userData)),
    // }),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});



export default router;

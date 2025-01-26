import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './route';
import { Button, Toast, NavBar, Tabbar, TabbarItem, Search, Cell, CellGroup, ConfigProvider, Form, Field, Card, Empty, Switch } from 'vant';
import {
  Skeleton,
  SkeletonTitle,
  SkeletonImage,
  SkeletonAvatar,
  SkeletonParagraph,
  DatePicker,
  Popup,
  Stepper,
} from 'vant';
// 2. 引入组件样式
import 'vant/lib/index.css';

const pinia = createPinia()
const app = createApp(App)

app.use(Button).use(Toast).use(NavBar).use(Tabbar).use(TabbarItem).use(Search).use(Cell).use(CellGroup).use(ConfigProvider)
  .use(Form).use(Field).use(Card).use(Empty).use(Switch).use(DatePicker).use(Popup).use(Stepper)
  .use(Skeleton).use(SkeletonTitle).use(SkeletonImage).use(SkeletonAvatar).use(SkeletonParagraph)

app.use(router).use(pinia).mount('#app')

# 五分化训练动作库

一套面向成年初学者的健身房五分化训练动作库：胸、背、肩、臂、腿五大肌群，以固定器械为主、自由重量与徒手为备选，提供训练动作、执行要领、负荷区间、风险提醒与替代方案。当前版本 **v2.6.0**。

## 功能

- **五天分化计划**：周一胸+三头 / 周二背+二头+有氧 / 周三肩+核心 / 周四手臂补强+有氧 / 周五腿，共 38 个训练动作
- **智能负荷推荐**：按训练目标（增肌/力量/肌耐力）与经验等级自动推荐组数、次数、RPE 与组间休息
- **每个动作包含**：发力感提示、执行要点、常见错误、风险信号与叫停条件（`data.js` 中的 `feel_cue` / `key_points` / `stop` 等字段）
- **完整素材**：训练动作 GIF 演示、器械高清照片、自由重量图标与拉伸示意（`assets/`）
- **离线可用**：纯静态页面，双击 `index.html` 即可本地打开；含 Service Worker 缓存

## 使用

直接用浏览器打开 `index.html`，无需安装任何依赖、无需构建。

## 目录结构

```
├── index.html        # 页面入口
├── data.js           # 动作数据（days / exercises / 讲解字段）
├── jsx_compiled2.js  # 编译后的页面逻辑
├── react.min.js      # React 运行时（本地引用，离线可用）
├── react-dom.min.js
├── style.css         # 样式
├── sw.js             # Service Worker
├── manifest.json     # PWA 清单
├── favicon.svg
└── assets/
    ├── anim-gifs/       # 动作 GIF 演示
    ├── equipment-hd/    # 器械高清照片
    ├── free-weight/     # 自由重量图标
    └── stretch-svgs/    # 拉伸动作示意
```

## 部署

本仓库通过 **Cloudflare Workers** 部署静态资源（国内访问加速），配置见 `wrangler.jsonc`（Worker 名 `gym`，以仓库根目录为静态资源目录）。**请勿删除 `wrangler.jsonc`**，否则部署将失去配置源。

## 说明

本动作库内容仅供健身参考，不构成医疗建议。训练请根据自身情况与现场环境调整，出现疼痛或不适请立即停止并咨询专业人士。

import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://daoxuanren.com/",
    title: "道玄人",
    description: "道家玄门文化 - 分享道家修行知识",
    author: "道玄人",
    profile: "https://daoxuanren.com/about",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: false,
    showArchives: true,
    showBackButton: true,
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/soho1319/daoxuanren" },
  ],
  shareLinks: [
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "whatsapp", url: "https://wa.me/?text=" },
  ],
});

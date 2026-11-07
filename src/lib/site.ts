export const site = {
  name: "香港郊野營地指南",
  nameEn: "HK Country Park Campsites",
  description:
    "整理漁護署 41 個郊野公園指定露營地點：簡介、水源及營位、交通指引及編輯評分。非官方資訊網站。",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://hk-campsites.vercel.app",
} as const;

export const sources = {
  afcdCampsites: {
    labelZh: "漁農自然護理署：露營地點",
    url: "https://www.afcd.gov.hk/tc_chi/country/cou_vis/cou_vis_cam/cou_vis_cam_cam/cou_vis_cam_cam.html",
  },
  afcdCsv: {
    labelZh: "漁農自然護理署：營地資料（CSV 開放數據）",
    url: "https://www.afcd.gov.hk/data/AFCD_Campsite.csv",
  },
  lcsd: {
    labelZh: "康樂及文化事務署：營地（度假營及其他營地）",
    url: "https://www.lcsd.gov.hk/tc/camp/campsites/p_campsite.html",
  },
} as const;

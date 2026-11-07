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
  afcdCampingRules: {
    labelZh: "漁農自然護理署：有關露營守則及法例",
    url: "https://www.afcd.gov.hk/tc_chi/country/cou_vis/cou_vis_cam/cou_vis_cam_cam/cou_vis_cam_cam_ccr.html",
  },
  afcdCamperGuide: {
    labelZh: "漁農自然護理署：郊野公園露營人士指引",
    url: "https://www.afcd.gov.hk/tc_chi/country/cou_vis/cou_vis_cam/cou_vis_rec_hin.html",
  },
  afcdWater: {
    labelZh: "漁農自然護理署：營地水源狀況",
    url: "https://www.afcd.gov.hk/tc_chi/country/cou_vis/cou_vis_cam/cou_vis_cam_wat/cou_vis_cam_wat.html",
  },
  lcsd: {
    labelZh: "康樂及文化事務署：營地（度假營及其他營地）",
    url: "https://www.lcsd.gov.hk/tc/camp/campsites/p_campsite.html",
  },
  youth: {
    labelZh: "青年網站 Youth.gov.hk：文娛消閒",
    url: "https://www.youth.gov.hk/tc/cultural-leisure",
  },
} as const;

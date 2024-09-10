import mapInfo from "./mapInfo.json";

// 弹窗form
export const getFormCol = (currentImgId) => {
  const formColumnsMap = {
    menji: "menji",
    ship: "ship",
    dyc: "dyc",
    zzc: "zzc",
    person: "person",
    yardpos: "yardpos",
    bangfang: "bangfang",
    mjBack: "mjBack",
    zcBack: "zcBack",
    perBack: "perBack",
    points3: "points3", //回皮
    points4: "points4", //装车
    points7: "points7", //卸货
    points9: "points9", //过重
  };

  for (const key in formColumnsMap) {
    if (currentImgId.includes(key)) {
      return mapInfo.formColumns[formColumnsMap[key]];
    }
  }
};

// 弹窗表格table
export const getTableCol = (currentImgId) => {
  const tableColumnsMap = {
    menji: "menji",
    ship: "ship",
    dyc: "dyc",
    zzc: "zzc",
    person: "person",
    yardpos: "yardpos",
    bangfang: "bangfang",
    dyBack: "dyBack",
  };

  for (const key in tableColumnsMap) {
    if (currentImgId.includes(key)) {
      return mapInfo.tableColumns[tableColumnsMap[key]];
    }
  }
};

// 弹窗title
export const getDialogTitle = (currentImgId) => {
  const dialogTitlesMap = {
    menji: "menji",
    ship: "ship",
    dyc: "dyc",
    zzc: "zzc",
    person: "person",
  };

  for (const key in dialogTitlesMap) {
    if (currentImgId.includes(key)) {
      return mapInfo.dialogTitles[dialogTitlesMap[key]];
    }
  }
};

// 弹窗宽度
export const getDialogWidth = (currentImgId) => {
  return currentImgId?.includes("ship") ? "300px" : "600px";
};

import yardpos1 from "@/assets/images/yardpos1.png"; //货垛
import yardpos5 from "@/assets/images/yardpos5.png"; //货垛
import yardpos4 from "@/assets/images/yardpos4.png"; //货垛
import yardpos1Yellow from "@/assets/images/yardpos1_yellow.png"; //货垛
import yardpos5Yellow from "@/assets/images/yardpos5_yellow.png"; //货垛
import yardpos4Yellow from "@/assets/images/yardpos4_yellow.png"; //货垛
import posWaring from "@/assets/images/pos_waring.png"; //货垛
import ship from "@/assets/images/shipleft.png"; //大船
import boundcol from "@/assets/images/bangcol.png"; //磅房
import boundrow from "@/assets/images/bangrow.png"; //磅房
import menji1 from "@/assets/images/menji1.png"; //门机
import menji2 from "@/assets/images/menji2.png"; //门机
import menji3 from "@/assets/images/menji3.png"; //门机
import menji4 from "@/assets/images/menji4.png"; //门机
import menji5 from "@/assets/images/menji5.png"; //门机
import menji6 from "@/assets/images/menji6.png"; //门机
import menji7 from "@/assets/images/menji7.png"; //门机
import menji8 from "@/assets/images/menji8.png"; //门机
// 门机图片
export const menjiImgList = [
  menji1,
  menji2,
  menji3,
  menji4,
  menji5,
  menji6,
  menji7,
  menji8,
];
// 固定展示码头内容  货垛  磅房
export const staticImgList = [
  {
    bounds: [
      [710, 550],
      [826, 955],
    ],
    imgurl: ship,
    imgId: "ship9",
  },
  {
    bounds: [
      [710, 980],
      [826, 1385],
    ],
    imgurl: ship,
    imgId: "ship10",
  },
  {
    bounds: [
      [280, 364],
      [334, 390],
    ],
    imgurl: boundcol,
    imgId: "bangfang9",
  },
  {
    bounds: [
      [280, 591],
      [334, 617],
    ],
    imgurl: boundcol,
    imgId: "bangfang10",
  },
  {
    bounds: [
      [280, 671],
      [334, 697],
    ],
    imgurl: boundcol,
    imgId: "bangfang45",
  },
  {
    bounds: [
      [280, 965],
      [334, 991],
    ],
    imgurl: boundcol,
    imgId: "bangfang46",
  },
  {
    bounds: [
      [440, 1042],
      [494, 1068],
    ],
    imgurl: boundcol,
    imgId: "bangfang47",
  },
  {
    bounds: [
      [157, 299],
      [184, 353],
    ],
    imgurl: boundrow,
    imgId: "bangfang48",
  },
  {
    bounds: [
      [469, 100],
      [382, 212],
    ],
    imgurl: yardpos1,
    yellowUrl: yardpos1Yellow,
    imgId: "yardpos1",
    yardId: '1'
  },
  {
    bounds: [
      [50, 480],
      [162, 557],
    ],
    imgurl: yardpos5,
    yellowUrl: yardpos5Yellow,
    imgId: "yardpos5",
    yardId: '5'
  },
  {
    bounds: [
      [280, 1100],
      [337, 1183],
    ],
    imgurl: yardpos4,
    yellowUrl: yardpos4Yellow,
    imgId: "yardpos4",
    yardId: '4'
  },
];

export const warnImg =
  {
    bounds: [
      [469, 100],
      [294, 212],
    ],
    imgurl: posWaring,
    imgId: "posWaring",
  }

export const menjiBounds = [
  [
    [645, 600],
    [742, 644],
  ],
  [
    [645, 680],
    [742, 724],
  ],
  [
    [645, 760],
    [742, 804],
  ],
  [
    [645, 840],
    [742, 884],
  ],
  [
    [645, 1040],
    [742, 1084],
  ],
  [
    [645, 1120],
    [742, 1164],
  ],
  [
    [645, 1200],
    [742, 1244],
  ],
  [
    [645, 1280],
    [742, 1324],
  ],
];

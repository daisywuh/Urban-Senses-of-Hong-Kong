(() => {
  "use strict";

  // ========================================
  // 食物圖標共用樣式
  // ========================================

  const FOOD_ICON_STYLES = String.raw`
    .food-vector-icon {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
    }

    .food-vector-svg {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
      filter:
        drop-shadow(
          0 3px 2px
          rgb(83 48 25 / 18%)
        );
    }

    .food-vector-svg path,
    .food-vector-svg ellipse,
    .food-vector-svg circle,
    .food-vector-svg rect {
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .food-vector-svg .food-shadow {
      fill: rgb(83 48 25 / 22%);
      stroke: none;
    }

    .food-vector-svg .food-plate-edge {
      fill: #c9d8d8;
      stroke: #6b7775;
      stroke-width: 2;
    }

    .food-vector-svg .food-plate {
      fill: #fffdf6;
      stroke: #8da09e;
      stroke-width: 2;
    }

    .food-vector-svg .food-bowl {
      fill: #e9f2ef;
      stroke: #557a77;
      stroke-width: 2.4;
    }

    .food-vector-svg .food-bowl-rim {
      fill: #f9fbf5;
      stroke: #557a77;
      stroke-width: 2.4;
    }

    .food-vector-svg .food-steamer {
      fill: #dca84f;
      stroke: #7c5425;
      stroke-width: 2.3;
    }

    .food-vector-svg .food-steamer-band {
      fill: #bd7e2c;
      stroke: #7c5425;
      stroke-width: 1.6;
    }

    .food-vector-svg .food-steamer-rim {
      fill: #f1c96f;
      stroke: #7c5425;
      stroke-width: 2.4;
    }

    .food-vector-svg .food-steamer-inside {
      fill: #9e6428;
      stroke: #7c5425;
      stroke-width: 1.4;
    }

    .food-vector-svg .chopsticks {
      fill: none;
      stroke: #653b27;
      stroke-width: 4;
    }

    .food-vector-svg .green-dot,
    .food-vector-svg .scallion circle {
      fill: #4e8b55;
      stroke: #315d38;
      stroke-width: 0.8;
    }

    .food-vector-svg .green-garnish {
      fill: #77a85c;
      stroke: #3e6a3d;
      stroke-width: 1.6;
    }

    /* 菠蘿包 */

    .food-vector-svg
    .pineapple-bun-bottom {
      fill: #d98b35;
      stroke: #81471e;
      stroke-width: 2.2;
    }

    .food-vector-svg
    .pineapple-bun-top {
      fill: #f0b647;
      stroke: #81471e;
      stroke-width: 2.4;
    }

    .food-vector-svg
    .pineapple-bun-grid {
      fill: none;
      stroke: #aa6826;
      stroke-width: 1.8;
    }

    .food-vector-svg
    .pineapple-butter {
      fill: #fff0a0;
      stroke: #b8862f;
      stroke-width: 1.6;
    }

    /* 魚肉燒賣 */

    .food-vector-svg
    .siu-mai-pieces path {
      fill: #f0c552;
      stroke: #936023;
      stroke-width: 2;
    }

    .food-vector-svg
    .siu-mai-filling ellipse {
      fill: #e29132;
      stroke: #8d4c20;
      stroke-width: 1.5;
    }

    .food-vector-svg
    .siu-mai-folds path {
      fill: none;
      stroke: #bd852e;
      stroke-width: 1.3;
    }

    /* 沙嗲牛肉麵 */

    .food-vector-svg
    .satay-noodles path {
      fill: none;
      stroke: #f3cd65;
      stroke-width: 2.6;
    }

    .food-vector-svg
    .satay-beef path {
      fill: #7d3f2b;
      stroke: #4d251b;
      stroke-width: 1.6;
    }

    /* 焗鮮茄飯 */

    .food-vector-svg .baked-dish {
      fill: #bd4030;
      stroke: #6f251f;
      stroke-width: 2.3;
    }

    .food-vector-svg .baked-dish-rim {
      fill: #e55a3f;
      stroke: #6f251f;
      stroke-width: 2.2;
    }

    .food-vector-svg .baked-rice {
      fill: #f3d38c;
      stroke: #a66c31;
      stroke-width: 1.3;
    }

    .food-vector-svg .baked-cheese {
      fill: #ffd45f;
      stroke: #bd7c23;
      stroke-width: 1.6;
    }

    .food-vector-svg
    .tomato-pieces path {
      fill: #e14d36;
      stroke: #8e2d22;
      stroke-width: 1.2;
    }

    .food-vector-svg
    .cheese-toast circle {
      fill: #b96d2a;
      stroke: none;
    }

    /* 奶茶與紅豆冰 */

    .food-vector-svg
    .milk-tea-cup path:first-child,
    .food-vector-svg
    .red-bean-glass path:first-child {
      fill: rgb(231 247 244 / 78%);
      stroke: #628783;
      stroke-width: 2;
    }

    .food-vector-svg
    .milk-tea-cup
    > ellipse:first-of-type,
    .food-vector-svg
    .red-bean-glass
    > ellipse:first-of-type {
      fill: #f8fffb;
      stroke: #628783;
      stroke-width: 1.8;
    }

    .food-vector-svg
    .milk-tea-surface {
      fill: #bd7641;
      stroke: #744429;
      stroke-width: 1;
    }

    .food-vector-svg .cup-handle {
      fill: none;
      stroke: #628783;
      stroke-width: 3;
    }

    .food-vector-svg
    .red-bean-drink {
      fill: #e9b4a6;
      stroke: #955045;
      stroke-width: 1;
    }

    .food-vector-svg
    .red-bean-glass circle {
      fill: #9d3f38;
      stroke: #632620;
      stroke-width: 0.8;
    }

    .food-vector-svg .drink-straw {
      fill: none;
      stroke: #d95a62;
      stroke-width: 3;
    }

     /* 西多士 */

    .food-vector-svg
    .french-toast-bottom {
      fill: #a95725;
      stroke: #6f321b;
      stroke-width: 2.5;
    }

    .food-vector-svg
    .french-toast-side {
      fill: #bd682c;
      stroke: #74351c;
      stroke-width: 2;
    }

    .food-vector-svg
    .french-toast-top {
      fill: #d88736;
      stroke: #74351c;
      stroke-width: 2.6;
    }

    .food-vector-svg
    .french-toast-centre {
      fill: #eeb454;
      stroke: #a75b27;
      stroke-width: 1.8;
    }

    .food-vector-svg
    .french-toast-crust-detail {
      fill: none;
      stroke: #aa5725;
      stroke-width: 2.2;
      opacity: 0.8;
    }

    .food-vector-svg
    .french-toast-syrup {
      fill: none;
      stroke: #be6828;
      stroke-width: 3.2;
      opacity: 0.78;
    }

    .food-vector-svg
    .french-toast-butter-shadow {
      fill: rgba(126, 72, 24, 0.25);
      stroke: none;
    }

    .food-vector-svg
    .french-toast-butter {
      fill: #fff0a1;
      stroke: #bd8d35;
      stroke-width: 1.7;
    }

    .food-vector-svg
    .french-toast-butter-highlight {
      fill: none;
      stroke: #fffbd5;
      stroke-width: 2;
    }

    .food-vector-svg
    .french-toast-butter-melt {
      fill: none;
      stroke: #f7cf62;
      stroke-width: 3;
    }

           /* 混醬腸粉 */

    .food-vector-svg
    .rice-roll-plate-shadow {
      fill: rgb(55 35 25 / 24%);
      stroke: none;
      filter: blur(1.5px);
    }

    .food-vector-svg
    .rice-roll-round-plate {
      fill: #47352f;
      stroke: #231916;
      stroke-width: 2.5;
    }

    .food-vector-svg
    .rice-roll-plate-inner {
      fill: #2f2522;
      stroke: #665048;
      stroke-width: 1.5;
    }

    .food-vector-svg
    .rice-roll-soft-pieces path {
      fill: #fff8e8;
      stroke: #cdbb9e;
      stroke-width: 1.4;
    }

    .food-vector-svg
    .rice-roll-soft-folds path {
      fill: none;
      stroke: #e1d2b9;
      stroke-width: 1.3;
      opacity: 0.82;
    }

    .food-vector-svg
    .rice-roll-dark-sauce path {
      fill: none;
      stroke: #632c1d;
      stroke-width: 4.6;
      stroke-linecap: round;
      stroke-linejoin: round;
      opacity: 0.94;
    }

    .food-vector-svg
    .rice-roll-red-sauce path {
      fill: none;
      stroke: #e65327;
      stroke-width: 3.7;
      stroke-linecap: round;
      stroke-linejoin: round;
      opacity: 0.95;
    }

    .food-vector-svg
    .rice-roll-sauce-drops
    .dark-drop {
      fill: #632c1d;
      stroke: none;
    }

    .food-vector-svg
    .rice-roll-sauce-drops
    .red-drop {
      fill: #e65327;
      stroke: none;
    }

    .food-vector-svg
    .rice-roll-sesame circle {
      fill: #f3d994;
      stroke: #9c692f;
      stroke-width: 0.45;
    }

    /* 咖喱魚蛋 */

    .food-vector-svg .curry-pool {
      fill: #bd6f21;
      stroke: #7a431c;
      stroke-width: 1.8;
    }

    .food-vector-svg .skewer path {
      fill: none;
      stroke: #825326;
      stroke-width: 2.5;
    }

    .food-vector-svg .skewer circle {
      fill: #edae32;
      stroke: #8f571c;
      stroke-width: 2;
    }

    .food-vector-svg
    .fish-ball-shine circle {
      fill: #ffe28a;
      stroke: none;
    }

    /* 燒鵝、叉燒與燒臘 */

        .food-vector-svg
    .roast-goose-shadow {
      fill: rgb(64 31 18 / 24%);
      stroke: none;
      filter: blur(1.5px);
    }

    .food-vector-svg
    .roast-goose-hook {
      fill: none;
      stroke: #73502f;
      stroke-width: 2.4;
      stroke-linecap: round;
    }

    .food-vector-svg
    .roast-goose-neck {
      fill: #a84420;
      stroke: #572617;
      stroke-width: 2.2;
    }

    .food-vector-svg
    .roast-goose-head {
      fill: #b95025;
      stroke: #572617;
      stroke-width: 2;
    }

    .food-vector-svg
    .roast-goose-beak {
      fill: #d77a2e;
      stroke: #69331c;
      stroke-width: 1.5;
    }

    .food-vector-svg
    .roast-goose-eye {
      fill: #24130e;
      stroke: none;
    }

    .food-vector-svg
    .roast-goose-body {
      fill: #a94320;
      stroke: #542316;
      stroke-width: 2.6;
    }

    .food-vector-svg
    .roast-goose-wing {
      fill: #83331c;
      stroke: #4f2115;
      stroke-width: 2.1;
    }

    .food-vector-svg
    .roast-goose-breast {
      fill: #c45b27;
      stroke: #6b2c19;
      stroke-width: 1.8;
    }

    .food-vector-svg
    .roast-goose-centre-line {
      fill: none;
      stroke: #702b19;
      stroke-width: 2;
      opacity: 0.82;
    }

    .food-vector-svg
    .roast-goose-leg {
      fill: #7e301a;
      stroke: #4d2014;
      stroke-width: 1.8;
    }

    .food-vector-svg
    .roast-goose-highlight {
      fill: none;
      stroke: #e48843;
      stroke-width: 2.5;
      stroke-linecap: round;
      opacity: 0.88;
    }

    .food-vector-svg
    .roast-goose-glaze {
      fill: none;
      stroke: #f4aa58;
      stroke-width: 1.7;
      stroke-linecap: round;
      opacity: 0.75;
    }

        /* 修長燒鵝 */

    .food-vector-svg .roast-goose-hook {
      fill: none;
      stroke: #75513b;
      stroke-width: 2;
      stroke-linecap: round;
    }

    .food-vector-svg .roast-goose-shadow {
      fill: rgb(63 38 28 / 20%);
      stroke: none;
    }

    .food-vector-svg .roast-goose-body {
      stroke: #592419;
      stroke-width: 2.3;
      stroke-linejoin: round;
    }

    .food-vector-svg .roast-goose-neck {
      stroke: #622719;
      stroke-width: 2.2;
      stroke-linejoin: round;
    }

    .food-vector-svg .roast-goose-head {
      fill: #bb4b23;
      stroke: #622719;
      stroke-width: 2;
    }

    .food-vector-svg .roast-goose-beak {
      fill: #d98232;
      stroke: #6b321d;
      stroke-width: 1.4;
      stroke-linejoin: round;
    }

    .food-vector-svg .roast-goose-eye {
      fill: #3e211a;
      stroke: none;
    }

    .food-vector-svg .roast-goose-wing {
      fill: #a73d20;
      stroke: #642518;
      stroke-width: 1.8;
      stroke-linejoin: round;
    }

    .food-vector-svg .roast-goose-center-line {
      fill: none;
      stroke: #722719;
      stroke-width: 1.7;
      stroke-linecap: round;
    }

    .food-vector-svg .roast-goose-body-texture {
      fill: none;
      stroke: rgb(105 37 23 / 72%);
      stroke-width: 1.25;
      stroke-linecap: round;
    }

    .food-vector-svg .roast-goose-glaze {
      fill: none;
      stroke: rgb(255 174 92 / 82%);
      stroke-width: 2;
      stroke-linecap: round;
    }

    .food-vector-svg .roast-goose-leg {
      fill: none;
      stroke: #672619;
      stroke-width: 3.5;
      stroke-linecap: round;
    }

    /* 厚切肥叉 */

        .food-vector-svg
    .char-siu-sauce-pool {
      fill:
        url(#char-siu-sauce-gradient);
      stroke: #71331c;
      stroke-width: 1.4;
      opacity: 0.88;
    }

        .food-vector-svg
    .char-siu-chunk {
      fill:
        url(#char-siu-dark-glaze);
      stroke: #351311;
      stroke-width: 2.5;
    }

        .food-vector-svg
    .char-siu-meat-face {
      fill:
        url(#char-siu-red-glaze);
      stroke: #651e1a;
      stroke-width: 1.5;
    }

        .food-vector-svg
    .char-siu-fat-layer {
      fill:
        url(#char-siu-fat-gradient);
      stroke: #a14f42;
      stroke-width: 1.15;
      opacity: 0.98;
    }

    .food-vector-svg
    .char-siu-charred-edge {
      fill: none;
      stroke: #43201b;
      stroke-width: 4;
      stroke-linecap: round;
    }

    .food-vector-svg
    .char-siu-glaze-highlight {
      fill: none;
      stroke: #ef9967;
      stroke-width: 2.4;
      stroke-linecap: round;
      opacity: 0.9;
    }

    .food-vector-svg
    .char-siu-sauce-drip {
      fill: none;
      stroke: #b86529;
      stroke-width: 2.5;
      stroke-linecap: round;
      opacity: 0.78;
    }

    .food-vector-svg
    .char-siu-piece-left {
      transform:
        rotate(-7deg);
      transform-origin:
        32px 48px;
    }

    .food-vector-svg
    .char-siu-piece-centre {
      transform:
        translateY(-2px);
    }

    .food-vector-svg
    .char-siu-piece-right {
      transform:
        rotate(7deg);
      transform-origin:
        73px 48px;
    }
    .food-vector-svg .mini {
      stroke-width: 1.8;
    }

        .food-vector-svg
    .char-siu-wet-glaze path {
      fill: rgba(255, 164, 83, 0.3);
      stroke: rgba(255, 203, 139, 0.34);
      stroke-width: 0.8;
    }

    .food-vector-svg
    .char-siu-oil-highlights path {
      fill: none;
      stroke: #ffe0ad;
      stroke-width: 2.3;
      stroke-linecap: round;
      opacity: 0.92;
      filter:
        url(#char-siu-gloss-glow);
    }

    .food-vector-svg
    .char-siu-oil-drops ellipse {
      fill: rgba(255, 239, 196, 0.86);
      stroke: rgba(255, 187, 101, 0.7);
      stroke-width: 0.6;
      filter:
        url(#char-siu-gloss-glow);
    }

    .food-vector-svg
    .char-siu-charred-edge {
      fill: none;
      stroke: #33110f;
      stroke-width: 4.2;
      stroke-linecap: round;
    }

    .food-vector-svg
    .char-siu-glaze-highlight {
      fill: none;
      stroke: #ffd09a;
      stroke-width: 2.6;
      stroke-linecap: round;
      opacity: 0.96;
      filter:
        url(#char-siu-gloss-glow);
    }

        /* 燒臘拼盤 */

    .food-vector-svg
    .siu-mei-shadow {
      fill: rgb(64 34 20 / 22%);
      stroke: none;
      filter: blur(1.4px);
    }

    .food-vector-svg
    .siu-mei-plate-edge {
      fill: #c7d5d3;
      stroke: #687b78;
      stroke-width: 2;
    }

    .food-vector-svg
    .siu-mei-plate {
      fill: #fffdf4;
      stroke: #d9ded7;
      stroke-width: 1.5;
    }

    .food-vector-svg
    .siu-mei-leg-bone {
      fill: #e7c99e;
      stroke: #84552e;
      stroke-width: 1.7;
    }

    .food-vector-svg
    .siu-mei-whole-leg {
      fill: #a84424;
      stroke: #572318;
      stroke-width: 2.3;
    }

    .food-vector-svg
    .siu-mei-leg-highlight {
      fill: none;
      stroke: #e5894c;
      stroke-width: 2.2;
      opacity: 0.85;
    }

    .food-vector-svg
    .siu-mei-sliced-meat path {
      fill: #b64c2d;
      stroke: #61281c;
      stroke-width: 1.6;
    }

    .food-vector-svg
    .siu-mei-second-row path {
      fill: #9f4027;
    }

    .food-vector-svg
    .siu-mei-crispy-skin path {
      fill: none;
      stroke: #e1823e;
      stroke-width: 3;
      stroke-linecap: round;
    }

    .food-vector-svg
    .siu-mei-meat-layers path {
      fill: none;
      stroke: #edb182;
      stroke-width: 2;
      stroke-linecap: round;
      opacity: 0.9;
    }

    .food-vector-svg
    .siu-mei-glaze path {
      fill: none;
      stroke: #f4ad69;
      stroke-width: 1.8;
      stroke-linecap: round;
      opacity: 0.88;
    }

      /* 黯然銷魂飯 */

    .food-vector-svg
    .sorrowful-rice-shadow {
      fill: rgb(64 40 24 / 22%);
      stroke: none;
      filter: blur(1.5px);
    }

    .food-vector-svg
    .sorrowful-rice-bowl-edge {
      fill: #b9d1d2;
      stroke: #557876;
      stroke-width: 2;
    }

    .food-vector-svg
    .sorrowful-rice-bowl {
      fill: #fffdf7;
      stroke: #d8e1dc;
      stroke-width: 1.6;
    }

    .food-vector-svg
    .sorrowful-rice-rice {
      fill: #f8edcf;
      stroke: #d8c6a1;
      stroke-width: 1.4;
    }

    .food-vector-svg
    .sorrowful-rice-grains path {
      fill: none;
      stroke: #ddc99e;
      stroke-width: 1.1;
      opacity: 0.75;
    }

    .food-vector-svg
    .sorrowful-rice-greens
    .green-stem {
      fill: none;
      stroke: #43823d;
      stroke-width: 4;
    }

    .food-vector-svg
    .sorrowful-rice-greens
    .green-leaf {
      fill: #367936;
      stroke: #1e542a;
      stroke-width: 1.5;
    }

    .food-vector-svg
    .sorrowful-rice-greens
    .green-highlight {
      fill: none;
      stroke: #75ad59;
      stroke-width: 1.5;
      opacity: 0.9;
    }

    .food-vector-svg
    .rice-char-siu-piece {
      fill: #a83927;
      stroke: #542018;
      stroke-width: 1.8;
    }

    .food-vector-svg
    .rice-char-siu-fat {
      fill: none;
      stroke: #efad8a;
      stroke-width: 2.3;
      stroke-linecap: round;
    }

    .food-vector-svg
    .rice-char-siu-glaze {
      fill: none;
      stroke: #ef8750;
      stroke-width: 2;
      stroke-linecap: round;
      opacity: 0.92;
    }

    .food-vector-svg
    .sorrowful-rice-egg-white {
      fill: #fffdf0;
      stroke: #d2b780;
      stroke-width: 1.6;
    }

    .food-vector-svg
    .sorrowful-rice-egg-crisp {
      fill: none;
      stroke: #bd7737;
      stroke-width: 2;
      stroke-linecap: round;
      opacity: 0.82;
    }

    .food-vector-svg
    .sorrowful-rice-yolk {
      fill: #f7a817;
      stroke: #c96d12;
      stroke-width: 1.7;
    }

    .food-vector-svg
    .sorrowful-rice-yolk-highlight {
      fill: rgba(255, 239, 150, 0.82);
      stroke: none;
    }

    .food-vector-svg
    .sorrowful-rice-soy-sauce {
      fill: none;
      stroke: #71351f;
      stroke-width: 2.2;
      stroke-linecap: round;
      opacity: 0.76;
    }

    /* 雲吞麵 */

    .food-vector-svg .noodles path,
    .food-vector-svg
    .thin-noodles path {
      fill: none;
      stroke: #f5d466;
      stroke-width: 3;
    }

    .food-vector-svg
    .thin-noodles path {
      stroke-width: 2.1;
    }

    .food-vector-svg
    .wontons path {
      fill: #f7d37a;
      stroke: #a86e28;
      stroke-width: 1.7;
    }

    .food-vector-svg
    .bamboo-pole {
      fill: none;
      stroke: #b9863f;
      stroke-width: 6;
    }

        /* 竹昇雲吞麵 */

    .food-vector-svg
    .bamboo-noodle-shadow {
      fill: rgb(66 43 23 / 22%);
      stroke: none;
      filter: blur(1.5px);
    }

    .food-vector-svg
    .bamboo-noodle-bowl-edge {
      fill: #c8d7d6;
      stroke: #637b79;
      stroke-width: 2;
    }

    .food-vector-svg
    .bamboo-noodle-bowl {
      fill: #fffdf7;
      stroke: #d5ded9;
      stroke-width: 1.5;
    }

    .food-vector-svg
    .bamboo-noodle-soup {
      fill: #edcf82;
      stroke: #c39b51;
      stroke-width: 1.3;
    }

    .food-vector-svg
    .bamboo-thin-noodles path {
      fill: none;
      stroke: #f5df93;
      stroke-width: 2;
      stroke-linecap: round;
      opacity: 0.96;
    }

    .food-vector-svg
    .bamboo-wontons path {
      fill: #f1c46e;
      stroke: #a66e2c;
      stroke-width: 1.7;
    }

    .food-vector-svg
    .bamboo-wonton-folds path {
      fill: none;
      stroke: #cc8e3e;
      stroke-width: 1.3;
      stroke-linecap: round;
    }

    .food-vector-svg
    .bamboo-green-stem {
      fill: none;
      stroke: #4c963f;
      stroke-width: 3.6;
      stroke-linecap: round;
    }

    .food-vector-svg
    .bamboo-green-leaf {
      fill: #438b3d;
      stroke: #245d2e;
      stroke-width: 1.4;
    }

    .food-vector-svg
    .bamboo-noodle-scallions circle {
      fill: #559c48;
      stroke: #2d6b34;
      stroke-width: 0.6;
    }

    .food-vector-svg
    .bamboo-noodle-soup-highlight {
      fill: none;
      stroke: rgba(255, 239, 173, 0.72);
      stroke-width: 2;
      stroke-linecap: round;
    }

        /* 港式點心：蝦餃 */

    .food-vector-svg
    .har-gow-fillings path {
      fill: #ef9d79;
      stroke: #c96f57;
      stroke-width: 1.1;
      opacity: 0.86;
    }

    .food-vector-svg
    .har-gow-dumplings path {
      fill: rgba(255, 224, 207, 0.86);
      stroke: #c9907a;
      stroke-width: 1.7;
    }

    .food-vector-svg
    .har-gow-folds path {
      fill: none;
      stroke: #dda993;
      stroke-width: 1.25;
      stroke-linecap: round;
      opacity: 0.9;
    }

    .food-vector-svg
    .har-gow-highlights path {
      fill: none;
      stroke: rgba(255, 252, 235, 0.94);
      stroke-width: 2;
      stroke-linecap: round;
    }

    /* 糖沙翁 */

    .food-vector-svg
    .sugar-puffs path {
      fill: #e9a33c;
      stroke: #965421;
      stroke-width: 2.2;
    }

    .food-vector-svg
    .sugar-grains circle {
      fill: #fff8df;
      stroke: #d7bc8d;
      stroke-width: 0.6;
    }

        /* 碗仔翅 */

    .food-vector-svg
    .fin-soup-shadow {
      fill: rgb(61 37 21 / 23%);
      stroke: none;
      filter: blur(1.5px);
    }

    .food-vector-svg
    .fin-soup-bowl-edge {
      fill: #f7eee5;
      stroke: #557d78;
      stroke-width: 2.2;
    }

    .food-vector-svg
    .fin-soup-pattern-ring {
      fill: #f3b9ad;
      stroke: #b25f66;
      stroke-width: 1.8;
    }

    .food-vector-svg
    .fin-soup-inner-ring {
      fill: #e9f1e7;
      stroke: #3d8276;
      stroke-width: 2;
    }

    .food-vector-svg
    .fin-soup-rim-pattern circle {
      fill: #4a9283;
      stroke: #fff1dd;
      stroke-width: 0.8;
    }

    .food-vector-svg
    .fin-soup-rim-pattern
    circle:nth-child(even) {
      fill: #d86f73;
    }

    .food-vector-svg
    .fin-soup-broth {
      fill: #a56825;
      stroke: #714219;
      stroke-width: 1.5;
    }

    .food-vector-svg
    .fin-soup-broth-shadow {
      fill: none;
      stroke: #71401d;
      stroke-width: 4;
      stroke-linecap: round;
      opacity: 0.47;
    }

    .food-vector-svg
    .fin-soup-glass-noodles path {
      fill: none;
      stroke: #eac47d;
      stroke-width: 1.8;
      stroke-linecap: round;
      opacity: 0.88;
    }

    .food-vector-svg
    .fin-soup-mushroom-strips path {
      fill: none;
      stroke: #57311e;
      stroke-width: 2.5;
      stroke-linecap: round;
      opacity: 0.9;
    }

    .food-vector-svg
    .fin-soup-mushrooms path {
      fill: #c38a4b;
      stroke: #64381f;
      stroke-width: 1.7;
    }

    .food-vector-svg
    .fin-soup-mushroom-highlights path {
      fill: none;
      stroke: #efc986;
      stroke-width: 1.7;
      stroke-linecap: round;
    }

    .food-vector-svg
    .fin-soup-egg-ribbons path {
      fill: none;
      stroke: #f5dc83;
      stroke-width: 3;
      stroke-linecap: round;
      opacity: 0.94;
    }

    .food-vector-svg
    .fin-soup-chicken-shreds path {
      fill: none;
      stroke: #e7c59b;
      stroke-width: 2.2;
      stroke-linecap: round;
    }

    .food-vector-svg
    .fin-soup-highlight {
      fill: none;
      stroke: rgba(255, 221, 142, 0.72);
      stroke-width: 2;
      stroke-linecap: round;
    }

    /* 煎釀三寶 */

    .food-vector-svg
    .three-treasures path {
      stroke: #5d4127;
      stroke-width: 2;
    }

    .food-vector-svg .eggplant {
      fill: #66508c;
    }

    .food-vector-svg .pepper {
      fill: #6e9a4a;
    }

    .food-vector-svg .tofu {
      fill: #d9a94f;
    }

    .food-vector-svg
    .fish-paste ellipse {
      fill: #f0d0a0;
      stroke: #96704a;
      stroke-width: 1.4;
    }

    .food-vector-svg .soy-drizzle {
      fill: none;
      stroke: #7d3e25;
      stroke-width: 2.4;
    }

        /* 酥皮蛋撻 */

    .food-vector-svg .tart-shell {
      fill: #bd762d;
      stroke: #75451f;
      stroke-width: 2.4;
    }

    .food-vector-svg .tart-pastry-ring {
      fill: none;
      stroke-linecap: round;
    }

    .food-vector-svg .tart-pastry-ring-outer {
      stroke: #eca94b;
      stroke-width: 5.5;
    }

    .food-vector-svg .tart-pastry-ring-middle {
      stroke: #c77d2d;
      stroke-width: 2.2;
    }

    .food-vector-svg .tart-custard {
      fill: #ffd92f;
      stroke: #a9681d;
      stroke-width: 1.8;
    }

    .food-vector-svg .custard-shine {
      fill: rgb(255 252 181 / 78%);
      stroke: none;
    }

    .food-vector-svg .tart-baked-line {
      fill: none;
      stroke: #8f5425;
      stroke-width: 1.6;
      stroke-linecap: round;
      opacity: 0.78;
    }

    .food-vector-svg .tart-toast-spots {
      fill: #8d5021;
      opacity: 0.62;
    }

        .food-vector-svg .tart-plate {
      fill: #f8fbf5;
      stroke: #66918d;
      stroke-width: 2;
    }

    .food-vector-svg .tart-plate-ring {
      fill: none;
      stroke: #c8ddd6;
      stroke-width: 1.5;
    }

        /* 茄牛通 */

    .food-vector-svg .tomato-macaroni-shadow {
      fill: rgb(70 42 30 / 22%);
      stroke: none;
    }

    .food-vector-svg .tomato-macaroni-bowl {
      fill: #faf8ec;
      stroke: #527f7d;
      stroke-width: 2.2;
    }

    .food-vector-svg .tomato-macaroni-rim {
      fill: #fffdf3;
      stroke: #91aaa3;
      stroke-width: 1.5;
    }

    .food-vector-svg .tomato-macaroni-soup {
      stroke: #a73528;
      stroke-width: 1.5;
    }

    .food-vector-svg .tomato-macaroni-pasta path {
      fill: none;
      stroke: #f5d384;
      stroke-width: 4.2;
      stroke-linecap: round;
    }

    .food-vector-svg .tomato-macaroni-tomatoes path {
      fill: #f06443;
      stroke: #9e3026;
      stroke-width: 1.2;
      stroke-linejoin: round;
    }

    .food-vector-svg .tomato-macaroni-beef path {
      stroke: #48281f;
      stroke-width: 1.4;
      stroke-linejoin: round;
    }

    .food-vector-svg .tomato-macaroni-beef-shine path {
      fill: none;
      stroke: rgb(229 171 125 / 78%);
      stroke-width: 1.5;
      stroke-linecap: round;
    }

    .food-vector-svg .tomato-macaroni-scallions {
      fill: #60933d;
      stroke: #315e2e;
      stroke-width: 0.8;
      stroke-linecap: round;
    }

    .food-vector-svg .tomato-macaroni-soup-shine {
      fill: none;
      stroke: rgb(255 187 118 / 65%);
      stroke-width: 2;
      stroke-linecap: round;
    }


    /* 車仔麵 */
    .food-vector-svg .fish-ball {
      fill: #e4ae48;
      stroke: #8a5925;
      stroke-width: 1.7;
    }

    .food-vector-svg .radish {
      fill: #f5e9c7;
      stroke: #a99568;
      stroke-width: 1.4;
    }

    .food-vector-svg .sausage {
      fill: #a94b31;
      stroke: #682c21;
      stroke-width: 1.7;
    }

       /* 清湯牛腩 */

    .food-vector-svg .clear-brisket-shadow {
      fill: rgb(66 45 31 / 22%);
      stroke: none;
    }

    .food-vector-svg .clear-brisket-bowl {
      fill: #faf9ef;
      stroke: #587f7b;
      stroke-width: 2.2;
    }

    .food-vector-svg .clear-brisket-rim {
      fill: #fffdf4;
      stroke: #9bafa7;
      stroke-width: 1.5;
    }

    .food-vector-svg .clear-brisket-broth {
      stroke: #aa8a4f;
      stroke-width: 1.4;
    }

    .food-vector-svg .clear-brisket-noodles path {
      fill: none;
      stroke: #fff0bf;
      stroke-width: 2.5;
      stroke-linecap: round;
      opacity: 0.9;
    }

    .food-vector-svg .clear-brisket-meat path {
      stroke: #56311f;
      stroke-width: 1.5;
      stroke-linejoin: round;
    }

    .food-vector-svg .clear-brisket-texture path {
      fill: none;
      stroke: #5d3827;
      stroke-width: 1.3;
      stroke-linecap: round;
      opacity: 0.8;
    }

    .food-vector-svg .clear-brisket-shine path {
      fill: none;
      stroke: rgb(229 177 124 / 78%);
      stroke-width: 1.6;
      stroke-linecap: round;
    }

    .food-vector-svg .clear-brisket-scallions {
      fill: #6c9b43;
      stroke: #3c652d;
      stroke-width: 0.8;
      stroke-linecap: round;
    }

    .food-vector-svg .clear-brisket-broth-glint {
      fill: none;
      stroke: rgb(255 249 205 / 78%);
      stroke-width: 2;
      stroke-linecap: round;
    }

        /* 港式牛雜 */

    .food-vector-svg .offal-plate-shadow {
      fill: rgb(64 38 27 / 24%);
      stroke: none;
    }

    .food-vector-svg .offal-plate {
      fill: #faf9ef;
      stroke: #557f7b;
      stroke-width: 2.2;
    }

    .food-vector-svg .offal-plate-ring {
      fill: none;
      stroke: #a3b9af;
      stroke-width: 1.4;
    }

    .food-vector-svg .offal-sauce {
      stroke: #45251b;
      stroke-width: 1.5;
    }

    .food-vector-svg .offal-meat path {
      stroke: #4e2c20;
      stroke-width: 1.5;
      stroke-linejoin: round;
    }

    .food-vector-svg .offal-liver path:first-child {
      fill: #553126;
      stroke: #351d18;
      stroke-width: 1.6;
    }

    .food-vector-svg .offal-liver-layer {
      fill: none;
      stroke: #9e6b4c;
      stroke-width: 1.6;
      stroke-linecap: round;
    }

    .food-vector-svg .offal-tripe {
      stroke: #684126;
      stroke-width: 1.5;
      stroke-linejoin: round;
    }

    .food-vector-svg .offal-honeycomb path {
      fill: none;
      stroke: #704424;
      stroke-width: 1.1;
      stroke-linejoin: round;
    }

    .food-vector-svg .offal-intestine {
      fill: none;
      stroke: #b77a47;
      stroke-width: 5;
      stroke-linecap: round;
    }

    .food-vector-svg .offal-highlights path {
      fill: none;
      stroke: rgb(222 161 109 / 72%);
      stroke-width: 1.5;
      stroke-linecap: round;
    }

    .food-vector-svg .offal-scallions {
      fill: #70963e;
      stroke: #3c632d;
      stroke-width: 0.7;
    }

        /* 港式糖水・芒果西米露 */

    .food-vector-svg .mango-dessert-shadow {
      fill: rgb(75 48 28 / 22%);
      stroke: none;
    }

    .food-vector-svg .mango-dessert-bowl {
      fill: #fbfaf3;
      stroke: #678b86;
      stroke-width: 2.2;
    }

    .food-vector-svg .mango-dessert-rim {
      fill: #fffdf5;
      stroke: #aec0b6;
      stroke-width: 1.4;
    }

    .food-vector-svg .mango-dessert-soup {
      stroke: #bd8030;
      stroke-width: 1.4;
    }

    .food-vector-svg .mango-dessert-pieces path {
      stroke: #b96b1d;
      stroke-width: 1.3;
      stroke-linejoin: round;
    }

    .food-vector-svg .mango-dessert-grapefruit > path:first-child {
      fill: #ef806d;
      stroke: #a84e47;
      stroke-width: 1.3;
    }

    .food-vector-svg .mango-dessert-grapefruit > path:not(:first-child) {
      fill: none;
      stroke: #ffd0b8;
      stroke-width: 1;
      stroke-linecap: round;
    }

    .food-vector-svg .mango-dessert-sago circle {
      fill: rgb(255 249 216 / 88%);
      stroke: #c69d5d;
      stroke-width: 0.6;
    }

    .food-vector-svg .mango-dessert-shine {
      fill: none;
      stroke: rgb(255 249 201 / 76%);
      stroke-width: 2;
      stroke-linecap: round;
    }

       /* 長洲芒果糯米糍 */

    .food-vector-svg .mango-mochi-shadow {
      fill: rgb(75 49 31 / 22%);
      stroke: none;
    }

    .food-vector-svg .mango-mochi-whole {
      stroke: #b9aa94;
      stroke-width: 1.7;
      stroke-linejoin: round;
    }

    .food-vector-svg .mango-mochi-whole-shade {
      fill: none;
      stroke: #d4c6b3;
      stroke-width: 2.5;
      stroke-linecap: round;
      opacity: 0.75;
    }

    .food-vector-svg .mango-mochi-cut {
      stroke: #b6a68f;
      stroke-width: 1.8;
      stroke-linejoin: round;
    }

    .food-vector-svg .mango-mochi-cut-inner {
      fill: #fff8e9;
      stroke: #d6c7af;
      stroke-width: 1.3;
    }

    .food-vector-svg .mango-mochi-filling {
      stroke: #b66b17;
      stroke-width: 1.5;
      stroke-linejoin: round;
    }

    .food-vector-svg .mango-mochi-filling-shine {
      fill: none;
      stroke: rgb(255 243 146 / 82%);
      stroke-width: 2;
      stroke-linecap: round;
    }

    .food-vector-svg .mango-mochi-skin-shine {
      fill: none;
      stroke: rgb(255 255 255 / 88%);
      stroke-width: 2.2;
      stroke-linecap: round;
    }

    .food-vector-svg .mango-mochi-powder circle {
      fill: #ded2c0;
      stroke: none;
      opacity: 0.78;
    }

        .food-vector-svg .mango-mochi-folds path {
      fill: none;
      stroke: #cbbca5;
      stroke-width: 1.4;
      stroke-linecap: round;
      opacity: 0.82;
    }

    /* 其他香港味道 */
    .food-vector-svg .food-cloche {
      fill: #e1b15a;
      stroke: #795327;
      stroke-width: 2.4;
    }

    .food-vector-svg .cloche-rim {
      fill: none;
      stroke: #795327;
      stroke-width: 4;
    }

    .food-vector-svg
    .cloche-handle {
      fill: #e1b15a;
      stroke: #795327;
      stroke-width: 2;
    }

    .food-vector-svg
    .cloche-shine {
      fill: none;
      stroke:
        rgb(255 244 191 / 78%);
      stroke-width: 3;
    }

    /* 滑鼠互動動畫 */

    .place-marker.is-food-marker:hover
    .food-vector-svg,
    .place-marker.is-food-marker.is-selected
    .food-vector-svg {
      animation:
        food-icon-bounce
        520ms
        cubic-bezier(.22, .8, .35, 1);
    }

    @keyframes food-icon-bounce {
      0%,
      100% {
        transform:
          translateY(0)
          rotate(0deg);
      }

      45% {
        transform:
          translateY(-4px)
          rotate(-2deg);
      }

      72% {
        transform:
          translateY(-1px)
          rotate(1deg);
      }
    }

    @media (
      prefers-reduced-motion: reduce
    ) {
      .place-marker.is-food-marker:hover
      .food-vector-svg,
      .place-marker.is-food-marker.is-selected
      .food-vector-svg {
        animation: none;
      }
    }
  `;

  // ========================================
  // 共用碟子、碗與蒸籠
  // ========================================

  const plate = `
    <ellipse
      class="food-shadow"
      cx="50"
      cy="71"
      rx="36"
      ry="7"
    ></ellipse>

    <ellipse
      class="food-plate-edge"
      cx="50"
      cy="63"
      rx="39"
      ry="13"
    ></ellipse>

    <ellipse
      class="food-plate"
      cx="50"
      cy="59"
      rx="36"
      ry="11"
    ></ellipse>
  `;

  const bowl = (
    soup = "#d99a49"
  ) => `
    <ellipse
      class="food-shadow"
      cx="50"
      cy="72"
      rx="31"
      ry="7"
    ></ellipse>

    <path
      class="food-bowl"
      d="
        M15 38
        Q18 72 50 76
        Q82 72 85 38
        Z
      "
    ></path>

    <ellipse
      class="food-bowl-rim"
      cx="50"
      cy="38"
      rx="35"
      ry="13"
    ></ellipse>

    <ellipse
      cx="50"
      cy="38"
      rx="30"
      ry="9"
      fill="${soup}"
    ></ellipse>
  `;

  const bambooSteamer = `
    <ellipse
      class="food-shadow"
      cx="50"
      cy="73"
      rx="33"
      ry="7"
    ></ellipse>

    <path
      class="food-steamer"
      d="
        M16 38
        L20 68
        Q50 79 80 68
        L84 38
        Z
      "
    ></path>

    <path
      class="food-steamer-band"
      d="
        M19 52
        Q50 62 81 52
        L80 61
        Q50 71 20 61
        Z
      "
    ></path>

    <ellipse
      class="food-steamer-rim"
      cx="50"
      cy="38"
      rx="34"
      ry="12"
    ></ellipse>

    <ellipse
      class="food-steamer-inside"
      cx="50"
      cy="38"
      rx="29"
      ry="8"
    ></ellipse>
  `;

  // ========================================
  // 全部食物圖形
  // ========================================

  const ART = {
    "pineapple-bun": `
      ${plate}

      <path
        class="pineapple-bun-bottom"
        d="
          M24 47
          Q50 39 76 47
          L72 60
          Q50 69 28 60
          Z
        "
      ></path>

      <path
        class="pineapple-bun-top"
        d="
          M20 45
          Q20 22 50 19
          Q80 22 80 45
          Q50 59 20 45
          Z
        "
      ></path>

      <path
        class="pineapple-bun-grid"
        d="
          M29 29 L68 47
          M40 22 L76 39
          M24 39 L57 53
          M70 28 L33 49
          M58 22 L24 43
          M78 37 L47 53
        "
      ></path>

      <path
        class="pineapple-butter"
        d="
          M34 45
          L64 39
          L68 48
          L38 55
          Z
        "
      ></path>
    `,

    "siu-mai": `
      ${plate}

      <g class="siu-mai-pieces">
        <path
          d="
            M19 40
            Q22 27 35 27
            Q47 29 47 42
            L43 60
            Q31 67 22 58
            Z
          "
        ></path>

        <path
          d="
            M39 34
            Q42 19 55 20
            Q68 22 68 36
            L64 57
            Q51 64 42 54
            Z
          "
        ></path>

        <path
          d="
            M58 41
            Q61 27 74 28
            Q86 31 84 44
            L80 61
            Q68 67 60 58
            Z
          "
        ></path>
      </g>

      <g class="siu-mai-filling">
        <ellipse
          cx="33"
          cy="37"
          rx="12"
          ry="8"
        ></ellipse>

        <ellipse
          cx="54"
          cy="30"
          rx="12"
          ry="8"
        ></ellipse>

        <ellipse
          cx="72"
          cy="38"
          rx="12"
          ry="8"
        ></ellipse>
      </g>

      <g class="siu-mai-folds">
        <path
          d="
            M27 45 L29 59
            M37 44 L36 60
            M48 37 L49 56
            M59 37 L58 56
            M66 45 L67 60
            M77 45 L76 60
          "
        ></path>
      </g>
    `,

    "satay-beef-noodles": `
      <path
        class="chopsticks"
        d="
          M68 10 L84 65
          M76 8 L91 62
        "
      ></path>

      ${bowl("#a86632")}

      <g class="satay-noodles">
        <path
          d="
            M22 34
            Q30 27 39 35
            T57 34
            T77 35
          "
        ></path>

        <path
          d="
            M23 40
            Q32 32 41 41
            T59 40
            T76 40
          "
        ></path>

        <path
          d="
            M29 46
            Q38 38 47 47
            T68 45
          "
        ></path>
      </g>

      <g class="satay-beef">
        <path
          d="
            M23 31
            Q30 23 39 29
            Q43 37 35 42
            Q25 43 23 31
            Z
          "
        ></path>

        <path
          d="
            M44 29
            Q52 21 61 28
            Q65 36 57 41
            Q47 42 44 29
            Z
          "
        ></path>

        <path
          d="
            M60 35
            Q69 27 78 35
            Q81 43 72 48
            Q62 48 60 35
            Z
          "
        ></path>
      </g>

      <circle
        class="green-dot"
        cx="43"
        cy="43"
        r="2"
      ></circle>

      <circle
        class="green-dot"
        cx="72"
        cy="30"
        r="2"
      ></circle>
    `,

    "baked-tomato-rice": `
      <ellipse
        class="food-shadow"
        cx="50"
        cy="70"
        rx="37"
        ry="7"
      ></ellipse>

      <path
        class="baked-dish"
        d="
          M13 35
          Q16 66 50 73
          Q84 66 87 35
          Z
        "
      ></path>

      <ellipse
        class="baked-dish-rim"
        cx="50"
        cy="35"
        rx="37"
        ry="14"
      ></ellipse>

      <ellipse
        class="baked-rice"
        cx="50"
        cy="35"
        rx="31"
        ry="10"
      ></ellipse>

      <path
        class="baked-cheese"
        d="
          M22 34
          Q29 23 39 28
          Q47 19 55 28
          Q66 21 77 33
          Q70 45 55 42
          Q44 49 34 42
          Q25 45 22 34
          Z
        "
      ></path>

      <g class="tomato-pieces">
        <path
          d="
            M21 32
            Q28 24 36 32
            Q30 40 21 32
            Z
          "
        ></path>

        <path
          d="
            M63 31
            Q71 23 79 32
            Q73 40 63 31
            Z
          "
        ></path>
      </g>

      <g class="cheese-toast">
        <circle
          cx="42"
          cy="31"
          r="2.5"
        ></circle>

        <circle
          cx="54"
          cy="28"
          r="2"
        ></circle>

        <circle
          cx="62"
          cy="36"
          r="2.5"
        ></circle>
      </g>
    `,

    "milk-tea-red-bean-ice": `
      <ellipse
        class="food-shadow"
        cx="50"
        cy="72"
        rx="34"
        ry="7"
      ></ellipse>

      <g class="milk-tea-cup">
        <path
          d="
            M14 30
            L19 64
            Q32 70 43 63
            L47 30
            Z
          "
        ></path>

        <ellipse
          cx="30"
          cy="30"
          rx="17"
          ry="7"
        ></ellipse>

        <ellipse
          class="milk-tea-surface"
          cx="30"
          cy="30"
          rx="13"
          ry="4.5"
        ></ellipse>

        <path
          class="cup-handle"
          d="
            M45 38
            Q58 36 55 50
            Q53 58 44 55
          "
        ></path>
      </g>

      <g class="red-bean-glass">
        <path
          d="
            M53 27
            L58 67
            Q71 74 84 67
            L89 27
            Z
          "
        ></path>

        <ellipse
          cx="71"
          cy="27"
          rx="18"
          ry="7"
        ></ellipse>

        <ellipse
          class="red-bean-drink"
          cx="71"
          cy="27"
          rx="14"
          ry="5"
        ></ellipse>

        <circle
          cx="63"
          cy="41"
          r="3"
        ></circle>

        <circle
          cx="72"
          cy="46"
          r="3"
        ></circle>

        <circle
          cx="80"
          cy="38"
          r="3"
        ></circle>

        <circle
          cx="66"
          cy="55"
          r="3"
        ></circle>

        <circle
          cx="78"
          cy="58"
          r="3"
        ></circle>

        <path
          class="drink-straw"
          d="M77 9 L73 52"
        ></path>
      </g>
    `,

    "french-toast": `
      ${plate}

      <!-- 底層厚切麵包 -->
      <path
        class="french-toast-bottom"
        d="
          M18 34
          Q17 27 25 24
          L72 26
          Q82 27 83 35
          L78 61
          Q76 68 68 70
          L30 67
          Q21 66 20 58
          Z
        "
      ></path>

      <!-- 麵包側面 -->
      <path
        class="french-toast-side"
        d="
          M20 48
          L78 48
          L77 61
          Q75 67 67 68
          L31 66
          Q23 65 21 58
          Z
        "
      ></path>

      <!-- 上層焦香表面 -->
      <path
        class="french-toast-top"
        d="
          M19 30
          Q19 21 28 18
          L71 20
          Q82 21 83 31
          L78 51
          Q77 57 69 59
          L30 57
          Q21 56 20 48
          Z
        "
      ></path>

      <!-- 金黃色柔軟中心 -->
      <path
        class="french-toast-centre"
        d="
          M27 31
          Q29 25 36 24
          L67 25
          Q75 26 76 32
          L72 47
          Q71 51 65 52
          L35 51
          Q28 50 27 44
          Z
        "
      ></path>

      <!-- 表面焦糖紋理 -->
      <path
        class="french-toast-crust-detail"
        d="
          M23 34
          Q29 30 33 25

          M72 27
          Q76 32 77 38

          M26 48
          Q32 53 40 53

          M64 54
          Q71 53 74 48
        "
      ></path>

      <!-- 融化糖漿 -->
      <path
        class="french-toast-syrup"
        d="
          M31 34
          Q39 29 47 34
          Q55 39 64 32
          Q70 29 74 35

          M28 42
          Q38 47 47 41
          Q56 37 71 43
        "
      ></path>

      <!-- 中央牛油 -->
      <path
        class="french-toast-butter-shadow"
        d="
          M42 29
          L62 31
          L65 43
          L45 45
          Z
        "
      ></path>

      <path
        class="french-toast-butter"
        d="
          M39 26
          L59 28
          L62 40
          L42 42
          Z
        "
      ></path>

      <path
        class="french-toast-butter-highlight"
        d="
          M43 29
          L55 30
        "
      ></path>

      <!-- 流下來的牛油與糖漿 -->
      <path
        class="french-toast-butter-melt"
        d="
          M43 41
          Q39 47 42 53

          M60 39
          Q66 44 63 50
        "
      ></path>
    `,

    "mixed-sauce-rice-roll": `
      <!-- 圓形盤子陰影 -->
      <ellipse
        class="rice-roll-plate-shadow"
        cx="50"
        cy="73"
        rx="36"
        ry="7"
      ></ellipse>

      <!-- 俯視深色圓盤 -->
      <circle
        class="rice-roll-round-plate"
        cx="50"
        cy="43"
        r="37"
      ></circle>

      <circle
        class="rice-roll-plate-inner"
        cx="50"
        cy="43"
        r="32"
      ></circle>

      <!-- 不規則切段腸粉 -->
      <g class="rice-roll-soft-pieces">
        <path
          d="
            M19 27
            Q22 21 29 22
            L42 27
            Q46 29 43 34
            L39 38
            Q36 41 31 38
            L21 34
            Q16 32 19 27
            Z
          "
        ></path>

        <path
          d="
            M45 22
            Q49 18 54 21
            L66 28
            Q70 31 67 36
            Q64 41 59 38
            L47 32
            Q41 29 45 22
            Z
          "
        ></path>

        <path
          d="
            M69 29
            Q73 25 78 29
            L84 36
            Q87 40 83 44
            Q79 48 75 44
            L68 38
            Q64 34 69 29
            Z
          "
        ></path>

        <path
          d="
            M16 43
            Q18 37 24 38
            L38 42
            Q43 44 41 50
            Q39 55 34 54
            L21 51
            Q15 50 16 43
            Z
          "
        ></path>

        <path
          d="
            M43 39
            Q46 34 52 36
            L64 41
            Q69 43 67 49
            Q65 55 59 54
            L47 50
            Q40 48 43 39
            Z
          "
        ></path>

        <path
          d="
            M68 48
            Q70 42 76 43
            L84 48
            Q88 51 85 57
            Q82 62 77 59
            L70 56
            Q65 54 68 48
            Z
          "
        ></path>

        <path
          d="
            M21 57
            Q24 52 30 54
            L43 59
            Q47 61 45 67
            Q42 71 37 69
            L25 65
            Q18 63 21 57
            Z
          "
        ></path>

        <path
          d="
            M47 56
            Q50 51 56 53
            L69 58
            Q74 60 72 66
            Q70 71 64 70
            L51 65
            Q44 63 47 56
            Z
          "
        ></path>
      </g>

      <!-- 腸粉柔軟摺痕 -->
      <g class="rice-roll-soft-folds">
        <path
          d="
            M23 28
            Q29 31 37 32
          "
        ></path>

        <path
          d="
            M49 26
            Q55 31 63 33
          "
        ></path>

        <path
          d="
            M21 45
            Q29 47 36 49
          "
        ></path>

        <path
          d="
            M48 42
            Q55 47 63 48
          "
        ></path>

        <path
          d="
            M26 59
            Q32 62 40 64
          "
        ></path>

        <path
          d="
            M52 58
            Q59 62 67 64
          "
        ></path>
      </g>

      <!-- 深褐色甜醬 -->
      <g class="rice-roll-dark-sauce">
        <path
          d="
            M19 34
            C27 29 34 39 42 34
            S56 29 64 37
            S77 45 84 38
          "
        ></path>

        <path
          d="
            M18 51
            C26 45 34 57 43 51
            S57 45 66 53
            S77 61 84 54
          "
        ></path>

        <path
          d="
            M28 65
            C35 60 42 69 50 64
            S64 60 72 66
          "
        ></path>
      </g>

      <!-- 橙紅辣醬 -->
      <g class="rice-roll-red-sauce">
        <path
          d="
            M25 23
            C30 31 38 27 42 35
            S50 46 57 42
            S68 37 73 45
          "
        ></path>

        <path
          d="
            M35 42
            C40 48 47 45 51 53
            S59 64 66 59
            S75 54 80 60
          "
        ></path>

        <path
          d="
            M20 56
            C27 53 29 62 36 63
          "
        ></path>
      </g>

      <!-- 醬汁小滴 -->
      <g class="rice-roll-sauce-drops">
        <circle
          class="dark-drop"
          cx="29"
          cy="40"
          r="2"
        ></circle>

        <circle
          class="red-drop"
          cx="59"
          cy="29"
          r="2.2"
        ></circle>

        <circle
          class="dark-drop"
          cx="74"
          cy="36"
          r="1.8"
        ></circle>

        <circle
          class="red-drop"
          cx="43"
          cy="58"
          r="1.8"
        ></circle>
      </g>

      <!-- 芝麻 -->
      <g class="rice-roll-sesame">
        <circle cx="32" cy="27" r="1.1"></circle>
        <circle cx="47" cy="35" r="1.1"></circle>
        <circle cx="68" cy="31" r="1.2"></circle>
        <circle cx="25" cy="48" r="1"></circle>
        <circle cx="56" cy="48" r="1.1"></circle>
        <circle cx="76" cy="52" r="1.1"></circle>
        <circle cx="37" cy="66" r="1"></circle>
        <circle cx="62" cy="63" r="1.1"></circle>
      </g>
    `,

    "curry-fish-balls": `
      ${plate}

      <path
        class="curry-pool"
        d="
          M19 56
          Q50 40 81 56
          Q73 68 50 69
          Q27 68 19 56
          Z
        "
      ></path>

      <g
        class="skewer"
        transform="
          rotate(-13 38 39)
        "
      >
        <path
          d="M37 15 L42 67"
        ></path>

        <circle
          cx="38"
          cy="31"
          r="9"
        ></circle>

        <circle
          cx="40"
          cy="47"
          r="9"
        ></circle>

        <circle
          cx="41"
          cy="61"
          r="8"
        ></circle>
      </g>

      <g
        class="skewer"
        transform="
          rotate(12 61 41)
        "
      >
        <path
          d="M65 15 L57 68"
        ></path>

        <circle
          cx="63"
          cy="31"
          r="9"
        ></circle>

        <circle
          cx="60"
          cy="47"
          r="9"
        ></circle>

        <circle
          cx="58"
          cy="61"
          r="8"
        ></circle>
      </g>

      <g class="fish-ball-shine">
        <circle
          cx="35"
          cy="28"
          r="2.2"
        ></circle>

        <circle
          cx="60"
          cy="28"
          r="2.2"
        ></circle>

        <circle
          cx="38"
          cy="45"
          r="2"
        ></circle>
      </g>
    `,

    "roast-goose": `
      <defs>
        <linearGradient
          id="roast-goose-body-gradient"
          x1="18%"
          y1="8%"
          x2="82%"
          y2="100%"
        >
          <stop offset="0%" stop-color="#e57935"></stop>
          <stop offset="48%" stop-color="#b94b22"></stop>
          <stop offset="100%" stop-color="#762b1b"></stop>
        </linearGradient>

        <linearGradient
          id="roast-goose-neck-gradient"
          x1="15%"
          y1="0%"
          x2="85%"
          y2="100%"
        >
          <stop offset="0%" stop-color="#dc7133"></stop>
          <stop offset="100%" stop-color="#8e321d"></stop>
        </linearGradient>
      </defs>

      <!-- 吊掛繩 -->
      <path
        class="roast-goose-hook"
        d="
          M49 3
          Q45 8 48 13
        "
      ></path>

      <!-- 底部陰影 -->
      <ellipse
        class="roast-goose-shadow"
        cx="50"
        cy="76"
        rx="22"
        ry="5"
      ></ellipse>

      <!-- 修長的燒鵝身體 -->
      <path
        class="roast-goose-body"
        fill="url(#roast-goose-body-gradient)"
        d="
          M37 28
          C43 23 57 23 63 29
          C69 38 69 54 64 66
          C59 74 42 74 36 66
          C30 54 31 39 37 28
          Z
        "
      ></path>

      <!-- 拉長並向上彎曲的鵝頸 -->
      <path
        class="roast-goose-neck"
        fill="url(#roast-goose-neck-gradient)"
        d="
          M39 36
          C29 33 24 25 27 17
          C30 8 42 7 50 11
          C56 14 58 20 54 25
          C50 29 44 27 40 24
          C36 21 33 21 32 24
          C31 28 36 31 43 32
          Z
        "
      ></path>

      <!-- 鵝頭 -->
      <path
        class="roast-goose-head"
        d="
          M47 11
          C53 7 62 10 64 16
          C65 21 59 25 53 23
          C49 21 46 16 47 11
          Z
        "
      ></path>

      <!-- 鵝嘴 -->
      <path
        class="roast-goose-beak"
        d="
          M62 14
          L75 18
          L63 21
          Z
        "
      ></path>

      <!-- 眼睛 -->
      <circle
        class="roast-goose-eye"
        cx="58"
        cy="14"
        r="1.4"
      ></circle>

      <!-- 左側長翼 -->
      <path
        class="roast-goose-wing roast-goose-wing-left"
        d="
          M37 31
          C29 38 29 56 36 67
          C39 70 42 67 41 62
          C37 50 38 40 44 33
          Z
        "
      ></path>

      <!-- 右側長翼 -->
      <path
        class="roast-goose-wing roast-goose-wing-right"
        d="
          M61 31
          C69 39 70 55 64 67
          C61 71 58 67 59 62
          C63 50 62 40 56 33
          Z
        "
      ></path>

      <!-- 身體中央烤製紋理 -->
      <path
        class="roast-goose-center-line"
        d="
          M50 28
          C46 39 46 54 50 68
        "
      ></path>

      <path
        class="roast-goose-body-texture"
        d="
          M39 39 Q50 34 61 39
          M37 49 Q50 44 64 49
          M39 59 Q50 55 62 59
        "
      ></path>

      <!-- 油亮高光 -->
      <path
        class="roast-goose-glaze"
        d="
          M36 36
          C33 45 34 53 37 57

          M44 28
          C49 25 55 26 59 30

          M30 18
          C33 12 40 11 45 13
        "
      ></path>

      <!-- 垂下的雙腿 -->
      <path
        class="roast-goose-leg"
        d="
          M40 65
          C39 70 37 74 34 78

          M60 65
          C61 70 63 74 66 78
        "
      ></path>
    `,

    "char-siu": `
              <defs>
        <linearGradient
          id="char-siu-dark-glaze"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop
            offset="0%"
            stop-color="#4a1714"
          ></stop>

          <stop
            offset="32%"
            stop-color="#8e2d20"
          ></stop>

          <stop
            offset="65%"
            stop-color="#d05b2d"
          ></stop>

          <stop
            offset="100%"
            stop-color="#551a16"
          ></stop>
        </linearGradient>

        <linearGradient
          id="char-siu-red-glaze"
          x1="0"
          y1="0"
          x2="0.8"
          y2="1"
        >
          <stop
            offset="0%"
            stop-color="#f28a43"
          ></stop>

          <stop
            offset="28%"
            stop-color="#d94c2c"
          ></stop>

          <stop
            offset="65%"
            stop-color="#a52720"
          ></stop>

          <stop
            offset="100%"
            stop-color="#6a1c18"
          ></stop>
        </linearGradient>

        <linearGradient
          id="char-siu-fat-gradient"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop
            offset="0%"
            stop-color="#fff0d0"
          ></stop>

          <stop
            offset="50%"
            stop-color="#efb58f"
          ></stop>

          <stop
            offset="100%"
            stop-color="#c56c54"
          ></stop>
        </linearGradient>

        <radialGradient
          id="char-siu-sauce-gradient"
          cx="45%"
          cy="35%"
          r="70%"
        >
          <stop
            offset="0%"
            stop-color="#efa34d"
            stop-opacity="0.9"
          ></stop>

          <stop
            offset="58%"
            stop-color="#b85a25"
            stop-opacity="0.82"
          ></stop>

          <stop
            offset="100%"
            stop-color="#77321c"
            stop-opacity="0.5"
          ></stop>
        </radialGradient>

        <filter
          id="char-siu-gloss-glow"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feGaussianBlur
            stdDeviation="0.7"
            result="blur"
          ></feGaussianBlur>

          <feMerge>
            <feMergeNode
              in="blur"
            ></feMergeNode>

            <feMergeNode
              in="SourceGraphic"
            ></feMergeNode>
          </feMerge>
        </filter>
      </defs>

      ${plate}
      ${plate}

      <!-- 盤底叉燒蜜汁 -->
      <path
        class="char-siu-sauce-pool"
        d="
          M18 59
          Q27 53 37 57
          Q48 62 59 56
          Q72 50 82 59
          Q72 67 58 66
          Q43 71 29 66
          Q22 66 18 59
          Z
        "
      ></path>

      <!-- 左側厚切叉燒 -->
      <g class="char-siu-piece char-siu-piece-left">
        <path
          class="char-siu-chunk"
          d="
            M18 39
            Q18 30 27 26
            L39 29
            Q45 31 45 38
            L42 57
            Q40 64 33 64
            L23 60
            Q17 57 18 50
            Z
          "
        ></path>

        <path
          class="char-siu-meat-face"
          d="
            M23 39
            Q24 33 30 31
            L38 33
            Q42 35 41 40
            L39 54
            Q38 59 33 59
            L26 56
            Q22 54 23 49
            Z
          "
        ></path>

        <path
          class="char-siu-fat-layer"
          d="
            M23 46
            Q30 42 40 47
            L39 53
            Q31 49 23 52
            Z
          "
        ></path>

        <path
          class="char-siu-charred-edge"
          d="
            M20 37
            Q21 29 29 27
            L39 30
            Q44 32 43 37
          "
        ></path>

        <path
          class="char-siu-glaze-highlight"
          d="
            M26 34
            Q31 30 37 34
          "
        ></path>
      </g>

      <!-- 中間厚切叉燒 -->
      <g class="char-siu-piece char-siu-piece-centre">
        <path
          class="char-siu-chunk"
          d="
            M37 34
            Q38 24 47 21
            L60 24
            Q67 26 67 34
            L63 57
            Q62 65 54 66
            L43 62
            Q36 59 37 51
            Z
          "
        ></path>

        <path
          class="char-siu-meat-face"
          d="
            M42 35
            Q43 28 49 26
            L58 28
            Q63 30 62 36
            L59 54
            Q58 60 53 60
            L46 58
            Q41 56 42 50
            Z
          "
        ></path>

        <path
          class="char-siu-fat-layer"
          d="
            M41 43
            Q51 38 62 45
            L60 52
            Q50 47 41 51
            Z
          "
        ></path>

        <path
          class="char-siu-charred-edge"
          d="
            M39 33
            Q40 25 49 22
            L60 25
            Q66 27 65 33
          "
        ></path>

        <path
          class="char-siu-glaze-highlight"
          d="
            M45 29
            Q51 24 58 29
          "
        ></path>
      </g>

      <!-- 右側厚切叉燒 -->
      <g class="char-siu-piece char-siu-piece-right">
        <path
          class="char-siu-chunk"
          d="
            M60 37
            Q61 28 69 25
            L80 29
            Q87 31 86 39
            L82 57
            Q80 64 73 64
            L64 61
            Q58 58 59 51
            Z
          "
        ></path>

        <path
          class="char-siu-meat-face"
          d="
            M65 38
            Q66 32 71 30
            L79 33
            Q83 35 82 40
            L79 54
            Q78 59 73 59
            L67 57
            Q63 55 64 50
            Z
          "
        ></path>

        <path
          class="char-siu-fat-layer"
          d="
            M64 45
            Q72 41 82 47
            L80 53
            Q72 49 64 52
            Z
          "
        ></path>

        <path
          class="char-siu-charred-edge"
          d="
            M62 36
            Q63 29 70 26
            L80 30
            Q85 32 84 38
          "
        ></path>

        <path
          class="char-siu-glaze-highlight"
          d="
            M68 32
            Q73 28 79 33
          "
        ></path>
      </g>

            <!-- 表面半透明蜜汁 -->
      <g class="char-siu-wet-glaze">
        <path
          d="
            M23 36
            Q29 29 38 34
            Q40 37 37 40
            Q30 37 24 42
            Z
          "
        ></path>

        <path
          d="
            M42 32
            Q49 24 59 29
            Q63 32 59 36
            Q51 32 43 39
            Z
          "
        ></path>

        <path
          d="
            M65 36
            Q72 29 80 35
            Q83 38 79 41
            Q72 37 66 43
            Z
          "
        ></path>

        <path
          d="
            M27 49
            Q32 44 39 48
            L38 54
            Q32 51 27 55
            Z
          "
        ></path>

        <path
          d="
            M46 46
            Q52 40 61 46
            L59 53
            Q52 49 46 54
            Z
          "
        ></path>

        <path
          d="
            M67 48
            Q73 43 81 48
            L79 54
            Q73 51 67 56
            Z
          "
        ></path>
      </g>

      <!-- 油亮反光線 -->
      <g class="char-siu-oil-highlights">
        <path
          d="
            M25 33
            Q30 29 36 32
          "
        ></path>

        <path
          d="
            M45 28
            Q51 24 57 28
          "
        ></path>

        <path
          d="
            M68 32
            Q73 29 78 33
          "
        ></path>

        <path
          d="
            M29 45
            Q33 42 37 45
          "
        ></path>

        <path
          d="
            M48 41
            Q53 38 58 42
          "
        ></path>

        <path
          d="
            M69 44
            Q74 41 78 45
          "
        ></path>
      </g>

      <!-- 表面油珠 -->
      <g class="char-siu-oil-drops">
        <ellipse
          cx="31"
          cy="37"
          rx="2.2"
          ry="1.4"
        ></ellipse>

        <ellipse
          cx="53"
          cy="32"
          rx="2.4"
          ry="1.5"
        ></ellipse>

        <ellipse
          cx="74"
          cy="38"
          rx="2"
          ry="1.3"
        ></ellipse>

        <ellipse
          cx="35"
          cy="52"
          rx="1.8"
          ry="1.1"
        ></ellipse>

        <ellipse
          cx="56"
          cy="49"
          rx="2"
          ry="1.2"
        ></ellipse>
      </g>

      <!-- 蜜汁流痕 -->
      <path
        class="char-siu-sauce-drip"
        d="
          M25 59
          Q22 65 25 68

          M55 61
          Q52 67 56 70

          M77 59
          Q81 63 78 67
        "
      ></path>
    `,

    "siu-mei-platter": `
      <!-- 盤子陰影 -->
      <ellipse
        class="siu-mei-shadow"
        cx="50"
        cy="76"
        rx="39"
        ry="6"
      ></ellipse>

      <!-- 俯視白色圓盤 -->
      <circle
        class="siu-mei-plate-edge"
        cx="50"
        cy="43"
        r="39"
      ></circle>

      <circle
        class="siu-mei-plate"
        cx="50"
        cy="43"
        r="35"
      ></circle>

      <!-- 上方完整燒鴨腿骨 -->
      <path
        class="siu-mei-leg-bone"
        d="
          M25 25
          Q17 20 10 17
          Q6 15 7 11
          Q9 8 13 10
          Q17 12 20 9
          Q24 8 26 12
          Q27 17 31 20
          Z
        "
      ></path>

      <!-- 完整燒鴨腿 -->
      <path
        class="siu-mei-whole-leg"
        d="
          M24 19
          Q32 13 42 16
          L73 21
          Q83 22 88 30
          Q90 35 85 38
          Q79 42 70 38
          L42 32
          Q33 35 25 31
          Q18 27 24 19
          Z
        "
      ></path>

      <!-- 鴨腿脆皮高光 -->
      <path
        class="siu-mei-leg-highlight"
        d="
          M29 20
          Q39 17 48 20

          M53 21
          Q66 22 78 27

          M31 27
          Q44 25 57 29
        "
      ></path>

      <!-- 下方第一排切件 -->
      <g class="siu-mei-sliced-meat">
        <path
          d="
            M17 40
            Q18 35 23 34
            L34 36
            Q38 37 37 42
            L35 51
            Q34 55 29 54
            L20 51
            Q16 49 17 40
            Z
          "
        ></path>

        <path
          d="
            M35 39
            Q36 34 41 35
            L52 37
            Q57 38 56 43
            L54 53
            Q53 57 48 56
            L39 53
            Q34 51 35 39
            Z
          "
        ></path>

        <path
          d="
            M54 41
            Q55 36 60 37
            L71 39
            Q76 40 75 45
            L73 55
            Q72 59 67 58
            L58 55
            Q53 53 54 41
            Z
          "
        ></path>

        <path
          d="
            M72 42
            Q73 38 78 39
            L84 42
            Q88 44 86 49
            L83 57
            Q81 61 77 59
            L73 56
            Q69 53 72 42
            Z
          "
        ></path>
      </g>

      <!-- 第一排金黃色脆皮 -->
      <g class="siu-mei-crispy-skin">
        <path d="M18 40 Q26 35 36 40"></path>
        <path d="M36 40 Q45 35 55 42"></path>
        <path d="M55 42 Q64 37 74 44"></path>
        <path d="M73 43 Q80 39 86 47"></path>
      </g>

      <!-- 下方第二排切件 -->
      <g class="siu-mei-sliced-meat siu-mei-second-row">
        <path
          d="
            M21 56
            Q23 51 28 52
            L39 55
            Q43 56 42 61
            L40 69
            Q38 73 34 71
            L24 67
            Q19 65 21 56
            Z
          "
        ></path>

        <path
          d="
            M40 56
            Q42 52 47 53
            L58 56
            Q63 57 61 62
            L59 71
            Q57 75 52 73
            L43 69
            Q38 67 40 56
            Z
          "
        ></path>

        <path
          d="
            M59 57
            Q61 53 66 54
            L77 58
            Q81 60 79 65
            L76 72
            Q74 76 70 74
            L62 70
            Q57 68 59 57
            Z
          "
        ></path>
      </g>

      <!-- 第二排脆皮 -->
      <g class="siu-mei-crispy-skin">
        <path d="M22 57 Q31 52 41 59"></path>
        <path d="M41 57 Q50 53 61 60"></path>
        <path d="M60 58 Q69 54 79 63"></path>
      </g>

      <!-- 肉層切口 -->
      <g class="siu-mei-meat-layers">
        <path d="M21 46 Q27 49 34 48"></path>
        <path d="M39 47 Q46 51 53 49"></path>
        <path d="M58 49 Q65 53 72 51"></path>
        <path d="M25 63 Q31 67 39 65"></path>
        <path d="M44 64 Q51 69 58 66"></path>
        <path d="M64 65 Q70 69 77 67"></path>
      </g>

      <!-- 油亮高光 -->
      <g class="siu-mei-glaze">
        <path d="M30 18 Q38 16 44 19"></path>
        <path d="M57 22 Q68 22 76 27"></path>
        <path d="M23 38 Q28 36 32 39"></path>
        <path d="M43 37 Q48 36 52 40"></path>
        <path d="M28 55 Q33 53 37 56"></path>
        <path d="M49 55 Q54 54 58 58"></path>
      </g>
    `,

    "sorrowful-rice": `
      <!-- 碗底陰影 -->
      <ellipse
        class="sorrowful-rice-shadow"
        cx="50"
        cy="76"
        rx="37"
        ry="6"
      ></ellipse>

      <!-- 俯視圓碗 -->
      <circle
        class="sorrowful-rice-bowl-edge"
        cx="50"
        cy="42"
        r="40"
      ></circle>

      <circle
        class="sorrowful-rice-bowl"
        cx="50"
        cy="42"
        r="35"
      ></circle>

      <!-- 米飯 -->
      <circle
        class="sorrowful-rice-rice"
        cx="50"
        cy="42"
        r="31"
      ></circle>

      <!-- 米飯紋理 -->
      <g class="sorrowful-rice-grains">
        <path d="M19 38 Q22 35 25 38"></path>
        <path d="M27 25 Q30 22 33 25"></path>
        <path d="M44 17 Q47 14 50 17"></path>
        <path d="M61 20 Q64 17 67 20"></path>
        <path d="M76 34 Q79 31 81 34"></path>
        <path d="M20 53 Q23 50 26 53"></path>
        <path d="M32 65 Q35 62 38 65"></path>
        <path d="M51 69 Q54 66 57 69"></path>
        <path d="M70 61 Q73 58 76 61"></path>
      </g>

      <!-- 右上方菜心菜莖 -->
      <g class="sorrowful-rice-greens">
        <path
          class="green-stem"
          d="
            M59 38
            Q67 29 75 17

            M63 42
            Q71 32 81 23

            M57 35
            Q61 25 67 15
          "
        ></path>

        <path
          class="green-leaf"
          d="
            M66 24
            Q59 15 66 11
            Q75 13 75 22
            Q71 26 66 24
            Z
          "
        ></path>

        <path
          class="green-leaf"
          d="
            M74 30
            Q75 20 84 19
            Q90 25 84 32
            Q79 35 74 30
            Z
          "
        ></path>

        <path
          class="green-leaf"
          d="
            M58 29
            Q52 21 58 16
            Q67 17 69 25
            Q65 31 58 29
            Z
          "
        ></path>

        <path
          class="green-leaf"
          d="
            M66 36
            Q70 27 78 29
            Q83 36 76 41
            Q70 42 66 36
            Z
          "
        ></path>

        <path
          class="green-highlight"
          d="
            M62 26 Q66 20 69 16
            M74 30 Q80 25 84 24
          "
        ></path>
      </g>

      <!-- 右下方油亮叉燒 -->
      <g class="sorrowful-rice-char-siu">
        <path
          class="rice-char-siu-piece"
          d="
            M51 49
            Q51 42 57 40
            L68 42
            Q73 44 72 50
            L69 62
            Q68 67 63 66
            L55 63
            Q50 61 51 55
            Z
          "
        ></path>

        <path
          class="rice-char-siu-piece"
          d="
            M66 46
            Q67 40 73 40
            L82 44
            Q87 46 84 52
            L80 62
            Q78 67 73 64
            L68 61
            Q63 59 66 53
            Z
          "
        ></path>

        <path
          class="rice-char-siu-piece"
          d="
            M45 60
            Q47 54 53 54
            L64 58
            Q68 60 66 66
            L63 71
            Q57 74 50 69
            Q44 67 45 60
            Z
          "
        ></path>

        <path
          class="rice-char-siu-fat"
          d="
            M53 52 Q61 48 70 54
            M68 50 Q75 47 83 52
            M48 63 Q56 60 65 65
          "
        ></path>

        <path
          class="rice-char-siu-glaze"
          d="
            M56 45 Q62 42 68 46
            M71 44 Q77 43 82 47
            M51 58 Q57 56 62 60
          "
        ></path>
      </g>

      <!-- 中央不規則荷包蛋 -->
      <path
        class="sorrowful-rice-egg-white"
        d="
          M16 35
          Q20 27 29 28
          Q34 20 43 25
          Q51 21 57 28
          Q63 32 59 39
          Q64 46 57 51
          Q53 58 45 55
          Q37 61 30 55
          Q21 57 19 49
          Q12 44 16 35
          Z
        "
      ></path>

      <!-- 荷包蛋焦邊 -->
      <path
        class="sorrowful-rice-egg-crisp"
        d="
          M18 36
          Q22 29 29 30

          M22 51
          Q28 56 34 53

          M45 25
          Q52 24 57 30

          M51 53
          Q57 50 58 45
        "
      ></path>

      <!-- 蛋黃 -->
      <circle
        class="sorrowful-rice-yolk"
        cx="39"
        cy="40"
        r="11"
      ></circle>

      <ellipse
        class="sorrowful-rice-yolk-highlight"
        cx="35"
        cy="36"
        rx="4"
        ry="2.7"
      ></ellipse>

      <!-- 蛋面少量醬油 -->
      <path
        class="sorrowful-rice-soy-sauce"
        d="
          M20 40
          Q25 37 29 40

          M48 29
          Q53 31 55 35

          M29 52
          Q34 49 38 52
        "
      ></path>
    `,

    "wonton-noodles": `
      <path
        class="chopsticks"
        d="
          M66 10 L85 66
          M74 8 L91 63
        "
      ></path>

      ${bowl("#e9ba57")}

      <g class="noodles">
        <path
          d="
            M24 34
            Q32 27 40 35
            T56 34
            T75 34
          "
        ></path>

        <path
          d="
            M25 39
            Q34 32 42 40
            T59 39
            T75 39
          "
        ></path>

        <path
          d="
            M30 44
            Q38 37 47 45
            T67 44
          "
        ></path>
      </g>

      <g class="wontons">
        <path
          d="
            M22 33
            L32 22
            L42 34
            L33 43
            Z
          "
        ></path>

        <path
          d="
            M55 32
            L65 21
            L76 33
            L66 43
            Z
          "
        ></path>

        <path
          d="
            M39 42
            L49 32
            L59 44
            L49 52
            Z
          "
        ></path>
      </g>

      <circle
        class="green-dot"
        cx="72"
        cy="44"
        r="2"
      ></circle>

      <circle
        class="green-dot"
        cx="28"
        cy="45"
        r="2"
      ></circle>
    `,

    "dim-sum": `
      ${bambooSteamer}

      <!-- 虾餃內部餡料 -->
      <g class="har-gow-fillings">
        <path
          d="
            M22 36
            Q25 27 33 27
            Q41 29 42 37
            Q39 43 31 43
            Q24 42 22 36
            Z
          "
        ></path>

        <path
          d="
            M41 30
            Q45 20 54 21
            Q63 23 64 32
            Q61 39 52 39
            Q44 38 41 30
            Z
          "
        ></path>

        <path
          d="
            M61 36
            Q64 26 73 27
            Q81 29 81 38
            Q78 44 70 44
            Q63 43 61 36
            Z
          "
        ></path>
      </g>

      <!-- 三隻半透明蝦餃 -->
      <g class="har-gow-dumplings">
        <path
          d="
            M19 37
            Q20 31 25 27
            Q30 22 36 26
            Q42 28 45 35
            Q46 42 40 46
            Q34 50 27 47
            Q20 45 19 37
            Z
          "
        ></path>

        <path
          d="
            M38 31
            Q40 24 46 20
            Q52 15 58 20
            Q64 22 67 29
            Q68 36 62 41
            Q55 45 48 42
            Q40 40 38 31
            Z
          "
        ></path>

        <path
          d="
            M58 38
            Q59 31 65 26
            Q71 21 77 26
            Q83 29 85 36
            Q85 43 79 47
            Q72 51 65 47
            Q59 45 58 38
            Z
          "
        ></path>
      </g>

      <!-- 虾餃扇形褶紋 -->
      <g class="har-gow-folds">
        <path
          d="
            M25 29 Q29 35 29 43
            M30 26 Q33 34 34 45
            M36 27 Q37 35 39 42
          "
        ></path>

        <path
          d="
            M46 22 Q50 29 50 39
            M52 19 Q55 28 55 41
            M58 21 Q60 29 62 36
          "
        ></path>

        <path
          d="
            M65 28 Q69 35 69 45
            M71 25 Q74 34 74 47
            M77 27 Q79 35 80 42
          "
        ></path>
      </g>

      <!-- 虾餃皮高光 -->
      <g class="har-gow-highlights">
        <path
          d="
            M23 34
            Q26 28 31 27
          "
        ></path>

        <path
          d="
            M43 28
            Q47 21 52 20
          "
        ></path>

        <path
          d="
            M63 35
            Q67 28 72 27
          "
        ></path>
      </g>
    `,

    "sugar-puff": `
      ${plate}

      <g class="sugar-puffs">
        <path
          d="
            M20 52
            Q14 40 25 33
            Q24 21 38 25
            Q47 17 55 27
            Q68 22 70 35
            Q83 40 74 51
            Q70 64 55 58
            Q44 68 36 58
            Q24 63 20 52
            Z
          "
        ></path>

        <path
          d="
            M49 52
            Q45 40 55 35
            Q60 26 70 32
            Q82 31 83 43
            Q91 52 80 59
            Q68 67 58 59
            Z
          "
        ></path>
      </g>

      <g class="sugar-grains">
        <circle
          cx="31"
          cy="32"
          r="1.5"
        ></circle>

        <circle
          cx="42"
          cy="27"
          r="1.4"
        ></circle>

        <circle
          cx="55"
          cy="35"
          r="1.3"
        ></circle>

        <circle
          cx="68"
          cy="37"
          r="1.5"
        ></circle>

        <circle
          cx="74"
          cy="49"
          r="1.3"
        ></circle>

        <circle
          cx="38"
          cy="53"
          r="1.4"
        ></circle>

        <circle
          cx="58"
          cy="54"
          r="1.5"
        ></circle>
      </g>
    `,

    "imitation-fin-soup": `
      <!-- 碗底陰影 -->
      <ellipse
        class="fin-soup-shadow"
        cx="50"
        cy="76"
        rx="38"
        ry="6"
      ></ellipse>

      <!-- 俯視花紋圓碗 -->
      <circle
        class="fin-soup-bowl-edge"
        cx="50"
        cy="42"
        r="40"
      ></circle>

      <circle
        class="fin-soup-pattern-ring"
        cx="50"
        cy="42"
        r="36"
      ></circle>

      <circle
        class="fin-soup-inner-ring"
        cx="50"
        cy="42"
        r="31"
      ></circle>

      <!-- 碗邊花紋 -->
      <g class="fin-soup-rim-pattern">
        <circle cx="50" cy="8" r="2.4"></circle>
        <circle cx="66" cy="12" r="2.4"></circle>
        <circle cx="79" cy="23" r="2.4"></circle>
        <circle cx="84" cy="41" r="2.4"></circle>
        <circle cx="78" cy="58" r="2.4"></circle>
        <circle cx="65" cy="71" r="2.4"></circle>
        <circle cx="49" cy="76" r="2.4"></circle>
        <circle cx="33" cy="71" r="2.4"></circle>
        <circle cx="20" cy="59" r="2.4"></circle>
        <circle cx="15" cy="42" r="2.4"></circle>
        <circle cx="21" cy="25" r="2.4"></circle>
        <circle cx="34" cy="13" r="2.4"></circle>
      </g>

      <!-- 濃稠湯底 -->
      <circle
        class="fin-soup-broth"
        cx="50"
        cy="42"
        r="29"
      ></circle>

      <!-- 湯底深色漩渦 -->
      <path
        class="fin-soup-broth-shadow"
        d="
          M24 34
          Q34 25 45 31
          Q56 36 65 28
          Q75 25 79 36

          M21 49
          Q33 42 44 49
          Q55 57 67 48
          Q75 43 79 51

          M29 61
          Q40 55 51 62
          Q61 68 71 60
        "
      ></path>

      <!-- 透明粉絲 -->
      <g class="fin-soup-glass-noodles">
        <path
          d="
            M22 31
            Q30 23 38 32
            T53 31
            T68 32
            T78 35
          "
        ></path>

        <path
          d="
            M20 38
            Q28 30 36 39
            T52 38
            T68 39
            T80 41
          "
        ></path>

        <path
          d="
            M21 45
            Q30 36 39 46
            T56 45
            T74 46
          "
        ></path>

        <path
          d="
            M23 52
            Q32 43 41 53
            T58 52
            T76 53
          "
        ></path>

        <path
          d="
            M28 59
            Q36 51 45 60
            T61 59
            T72 60
          "
        ></path>
      </g>

      <!-- 冬菇絲 -->
      <g class="fin-soup-mushroom-strips">
        <path d="M27 28 Q32 35 29 43"></path>
        <path d="M39 24 Q45 32 41 41"></path>
        <path d="M57 25 Q63 33 60 42"></path>
        <path d="M72 32 Q66 40 71 48"></path>
        <path d="M34 48 Q40 55 37 63"></path>
        <path d="M57 48 Q63 56 60 65"></path>
      </g>

      <!-- 兩片冬菇 -->
      <g class="fin-soup-mushrooms">
        <path
          d="
            M23 40
            Q25 30 34 29
            Q43 31 43 40
            Q39 47 32 47
            Q25 46 23 40
            Z
          "
        ></path>

        <path
          d="
            M61 47
            Q63 37 72 36
            Q81 38 81 47
            Q78 55 70 55
            Q63 54 61 47
            Z
          "
        ></path>
      </g>

      <!-- 冬菇片高光 -->
      <g class="fin-soup-mushroom-highlights">
        <path d="M28 36 Q33 31 38 36"></path>
        <path d="M66 44 Q71 39 76 44"></path>
      </g>

      <!-- 蛋花 -->
      <g class="fin-soup-egg-ribbons">
        <path
          d="
            M30 25
            Q35 31 42 27
            Q47 24 51 29
          "
        ></path>

        <path
          d="
            M46 39
            Q52 45 58 40
            Q63 36 68 41
          "
        ></path>

        <path
          d="
            M27 54
            Q34 60 41 55
            Q47 51 52 57
          "
        ></path>

        <path
          d="
            M51 62
            Q57 57 64 61
          "
        ></path>
      </g>

      <!-- 雞肉絲 -->
      <g class="fin-soup-chicken-shreds">
        <path d="M45 32 Q48 37 45 42"></path>
        <path d="M53 29 Q57 34 54 39"></path>
        <path d="M48 49 Q52 54 49 59"></path>
        <path d="M63 52 Q67 56 65 61"></path>
      </g>

      <!-- 湯面高光 -->
      <path
        class="fin-soup-highlight"
        d="
          M24 48
          Q22 38 28 30

          M69 25
          Q76 31 78 38
        "
      ></path>
    `,

    "stuffed-three-treasures": `
      ${plate}

      <g class="three-treasures">
        <path
          class="eggplant"
          d="
            M18 47
            Q26 29 40 33
            L45 48
            Q33 61 18 47
            Z
          "
        ></path>

        <path
          class="pepper"
          d="
            M39 51
            Q43 28 58 28
            Q68 36 60 54
            Q49 61 39 51
            Z
          "
        ></path>

        <path
          class="tofu"
          d="
            M61 35
            L81 31
            L84 52
            L67 61
            L58 47
            Z
          "
        ></path>
      </g>

      <g class="fish-paste">
        <ellipse
          cx="32"
          cy="42"
          rx="7"
          ry="5"
        ></ellipse>

        <ellipse
          cx="53"
          cy="40"
          rx="7"
          ry="5"
        ></ellipse>

        <ellipse
          cx="71"
          cy="43"
          rx="7"
          ry="5"
        ></ellipse>
      </g>

      <path
        class="soy-drizzle"
        d="
          M25 56
          Q48 63 75 54
        "
      ></path>
    `,

    "puff-egg-tart": `
            <!-- 俯視的圓形瓷碟 -->
      <circle
        class="tart-plate"
        cx="50"
        cy="42"
        r="33"
      ></circle>

      <circle
        class="tart-plate-ring"
        cx="50"
        cy="42"
        r="29.5"
      ></circle>

      <!-- 俯視的酥皮外殼 -->
      <circle
        class="tart-shell"
        cx="50"
        cy="42"
        r="27"
      ></circle>

      <!-- 酥皮一圈圈的層次 -->
      <circle
        class="tart-pastry-ring tart-pastry-ring-outer"
        cx="50"
        cy="42"
        r="23"
      ></circle>

      <circle
        class="tart-pastry-ring tart-pastry-ring-middle"
        cx="50"
        cy="42"
        r="19.5"
      ></circle>

      <!-- 蛋液 -->
      <circle
        class="tart-custard"
        cx="50"
        cy="42"
        r="16.5"
      ></circle>

      <!-- 蛋液的柔和光澤 -->
      <ellipse
        class="custard-shine"
        cx="44"
        cy="36"
        rx="7"
        ry="3.5"
        transform="rotate(-18 44 36)"
      ></ellipse>

      <!-- 酥皮焦香紋理 -->
      <path
        class="tart-baked-line"
        d="
          M31 29 Q27 36 29 43
          M35 23 Q29 28 28 34
          M43 19 Q36 20 32 25
          M57 19 Q64 21 68 25
          M69 29 Q73 36 71 43
          M68 58 Q72 52 71 46
          M57 65 Q64 63 68 58
          M43 65 Q36 63 32 58
          M31 56 Q27 50 29 44
        "
      ></path>

      <!-- 少量烘烤斑點 -->
      <g class="tart-toast-spots">
        <circle cx="34" cy="34" r="1.5"></circle>
        <circle cx="39" cy="24" r="1.3"></circle>
        <circle cx="61" cy="25" r="1.5"></circle>
        <circle cx="68" cy="38" r="1.4"></circle>
        <circle cx="64" cy="57" r="1.5"></circle>
        <circle cx="39" cy="59" r="1.3"></circle>
        <circle cx="31" cy="48" r="1.2"></circle>
      </g>
    `,

    "tomato-beef-macaroni": `
      <defs>
        <radialGradient
          id="tomato-soup-gradient"
          cx="42%"
          cy="36%"
          r="66%"
        >
          <stop offset="0%" stop-color="#ef7041"></stop>
          <stop offset="62%" stop-color="#d94a2f"></stop>
          <stop offset="100%" stop-color="#b93227"></stop>
        </radialGradient>

        <linearGradient
          id="beef-slice-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stop-color="#9a6246"></stop>
          <stop offset="55%" stop-color="#74432f"></stop>
          <stop offset="100%" stop-color="#4e2c23"></stop>
        </linearGradient>
      </defs>

      <!-- 碗底陰影 -->
      <ellipse
        class="tomato-macaroni-shadow"
        cx="50"
        cy="72"
        rx="28"
        ry="6"
      ></ellipse>

      <!-- 俯視白瓷碗 -->
      <circle
        class="tomato-macaroni-bowl"
        cx="50"
        cy="41"
        r="36"
      ></circle>

      <circle
        class="tomato-macaroni-rim"
        cx="50"
        cy="41"
        r="31.5"
      ></circle>

      <!-- 番茄湯底 -->
      <circle
        class="tomato-macaroni-soup"
        cx="50"
        cy="41"
        r="27.5"
        fill="url(#tomato-soup-gradient)"
      ></circle>

      <!-- 彎曲通粉 -->
      <g class="tomato-macaroni-pasta">
        <path d="M27 29 Q34 22 40 29"></path>
        <path d="M43 24 Q50 18 56 25"></path>
        <path d="M59 27 Q66 21 72 29"></path>

        <path d="M24 42 Q31 35 37 42"></path>
        <path d="M64 42 Q71 35 76 42"></path>

        <path d="M27 55 Q34 48 40 55"></path>
        <path d="M44 61 Q51 53 58 60"></path>
        <path d="M61 55 Q68 48 73 54"></path>
      </g>

      <!-- 番茄塊 -->
      <g class="tomato-macaroni-tomatoes">
        <path d="M22 34 Q27 27 34 31 Q34 39 27 41 Z"></path>
        <path d="M66 31 Q72 26 77 32 Q75 39 68 39 Z"></path>
        <path d="M29 57 Q34 51 40 55 Q39 62 32 63 Z"></path>
      </g>

      <!-- 中間的牛肉片 -->
      <g class="tomato-macaroni-beef">
        <path
          fill="url(#beef-slice-gradient)"
          d="
            M33 38
            C34 31 43 28 49 32
            C54 35 53 42 47 46
            C41 50 32 46 33 38
            Z
          "
        ></path>

        <path
          fill="url(#beef-slice-gradient)"
          d="
            M48 40
            C51 33 61 31 67 36
            C71 41 67 48 60 50
            C53 52 46 47 48 40
            Z
          "
        ></path>

        <path
          fill="url(#beef-slice-gradient)"
          d="
            M39 48
            C42 42 51 42 56 47
            C59 52 54 58 47 58
            C40 58 36 53 39 48
            Z
          "
        ></path>
      </g>

      <!-- 牛肉油亮紋理 -->
      <g class="tomato-macaroni-beef-shine">
        <path d="M37 37 Q42 33 47 36"></path>
        <path d="M54 40 Q60 36 65 40"></path>
        <path d="M43 50 Q48 47 53 50"></path>
      </g>

      <!-- 蔥花 -->
      <g class="tomato-macaroni-scallions">
        <circle cx="43" cy="39" r="1.8"></circle>
        <circle cx="49" cy="36" r="1.6"></circle>
        <circle cx="55" cy="40" r="1.8"></circle>
        <circle cx="47" cy="45" r="1.5"></circle>
        <circle cx="58" cy="45" r="1.4"></circle>

        <path d="M40 42 L43 39"></path>
        <path d="M50 41 L52 37"></path>
        <path d="M54 46 L58 43"></path>
      </g>

      <!-- 湯面光澤 -->
      <path
        class="tomato-macaroni-soup-shine"
        d="M27 37 Q29 27 39 23"
      ></path>
    `,

    "cart-noodles": `
      <path
        class="chopsticks"
        d="
          M70 9 L82 63
          M78 8 L89 61
        "
      ></path>

      ${bowl("#ad6838")}

      <g class="noodles">
        <path
          d="
            M22 38
            Q30 30 39 39
            T56 38
            T77 38
          "
        ></path>

        <path
          d="
            M25 44
            Q34 35 43 44
            T65 43
          "
        ></path>
      </g>

      <circle
        class="fish-ball"
        cx="31"
        cy="31"
        r="8"
      ></circle>

      <rect
        class="radish"
        x="44"
        y="27"
        width="14"
        height="13"
        rx="3"
      ></rect>

      <path
        class="sausage"
        d="
          M61 28
          Q74 23 77 31
          Q75 40 63 41
          Q56 35 61 28
          Z
        "
      ></path>

      <path
        class="green-garnish"
        d="
          M34 47 L39 38
          M38 48 L44 40
        "
      ></path>
    `,

    "clear-beef-brisket": `
      <defs>
        <radialGradient
          id="brisket-broth-gradient"
          cx="42%"
          cy="35%"
          r="70%"
        >
          <stop offset="0%" stop-color="#fff1b8"></stop>
          <stop offset="65%" stop-color="#dec981"></stop>
          <stop offset="100%" stop-color="#c5a55c"></stop>
        </radialGradient>

        <linearGradient
          id="brisket-meat-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stop-color="#b47a4d"></stop>
          <stop offset="58%" stop-color="#885534"></stop>
          <stop offset="100%" stop-color="#623923"></stop>
        </linearGradient>
      </defs>

      <!-- 碗底陰影 -->
      <ellipse
        class="clear-brisket-shadow"
        cx="50"
        cy="72"
        rx="28"
        ry="6"
      ></ellipse>

      <!-- 俯視白瓷碗 -->
      <circle
        class="clear-brisket-bowl"
        cx="50"
        cy="41"
        r="36"
      ></circle>

      <circle
        class="clear-brisket-rim"
        cx="50"
        cy="41"
        r="31.5"
      ></circle>

      <!-- 清湯 -->
      <circle
        class="clear-brisket-broth"
        cx="50"
        cy="41"
        r="27.5"
        fill="url(#brisket-broth-gradient)"
      ></circle>

      <!-- 湯中的米粉 -->
      <g class="clear-brisket-noodles">
        <path d="M23 35 C31 28 38 36 46 29"></path>
        <path d="M27 45 C35 37 42 47 50 39"></path>
        <path d="M52 27 C60 34 67 25 74 34"></path>
        <path d="M54 51 C62 43 68 54 75 47"></path>
        <path d="M28 56 C36 49 42 58 49 52"></path>
        <path d="M39 62 C47 54 56 63 64 56"></path>
      </g>

      <!-- 大片清湯牛腩 -->
      <g class="clear-brisket-meat">
        <path
          fill="url(#brisket-meat-gradient)"
          d="
            M26 37
            C27 29 36 25 45 29
            C50 32 48 39 43 44
            C37 49 27 46 26 37
            Z
          "
        ></path>

        <path
          fill="url(#brisket-meat-gradient)"
          d="
            M43 34
            C47 27 58 26 65 31
            C71 35 68 43 62 47
            C55 51 44 45 43 34
            Z
          "
        ></path>

        <path
          fill="url(#brisket-meat-gradient)"
          d="
            M34 48
            C39 41 50 42 57 47
            C62 52 57 59 50 61
            C42 63 32 57 34 48
            Z
          "
        ></path>

        <path
          fill="url(#brisket-meat-gradient)"
          d="
            M55 48
            C59 42 68 42 73 47
            C76 52 71 58 65 59
            C59 60 53 55 55 48
            Z
          "
        ></path>
      </g>

      <!-- 牛腩的筋肉紋理 -->
      <g class="clear-brisket-texture">
        <path d="M30 36 Q36 31 43 34"></path>
        <path d="M48 35 Q55 30 63 35"></path>
        <path d="M39 51 Q46 47 55 51"></path>
        <path d="M59 50 Q65 46 70 50"></path>
      </g>

      <!-- 牛腩上的油亮感 -->
      <g class="clear-brisket-shine">
        <path d="M31 32 Q36 29 40 31"></path>
        <path d="M49 31 Q55 29 59 31"></path>
        <path d="M39 47 Q44 44 48 46"></path>
      </g>

      <!-- 蔥花 -->
      <g class="clear-brisket-scallions">
        <circle cx="39" cy="35" r="1.8"></circle>
        <circle cx="47" cy="39" r="1.5"></circle>
        <circle cx="54" cy="34" r="1.7"></circle>
        <circle cx="61" cy="40" r="1.6"></circle>
        <circle cx="50" cy="48" r="1.5"></circle>

        <path d="M36 40 L40 36"></path>
        <path d="M52 42 L56 38"></path>
        <path d="M58 34 L61 31"></path>
      </g>

      <!-- 清湯光澤 -->
      <path
        class="clear-brisket-broth-glint"
        d="M23 42 Q24 29 36 23"
      ></path>
    `,

    "beef-offal": `
      <defs>
        <radialGradient
          id="offal-sauce-gradient"
          cx="44%"
          cy="36%"
          r="70%"
        >
          <stop offset="0%" stop-color="#a55b31"></stop>
          <stop offset="65%" stop-color="#754127"></stop>
          <stop offset="100%" stop-color="#4d291d"></stop>
        </radialGradient>

        <linearGradient
          id="offal-meat-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stop-color="#aa754b"></stop>
          <stop offset="55%" stop-color="#74462f"></stop>
          <stop offset="100%" stop-color="#4c2c22"></stop>
        </linearGradient>

        <linearGradient
          id="offal-tripe-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stop-color="#d09a5d"></stop>
          <stop offset="100%" stop-color="#986039"></stop>
        </linearGradient>
      </defs>

      <!-- 碟底陰影 -->
      <ellipse
        class="offal-plate-shadow"
        cx="50"
        cy="72"
        rx="29"
        ry="6"
      ></ellipse>

      <!-- 俯視白瓷碟 -->
      <circle
        class="offal-plate"
        cx="50"
        cy="41"
        r="36"
      ></circle>

      <circle
        class="offal-plate-ring"
        cx="50"
        cy="41"
        r="31.5"
      ></circle>

      <!-- 深色滷汁 -->
      <path
        class="offal-sauce"
        fill="url(#offal-sauce-gradient)"
        d="
          M20 41
          C20 24 33 13 51 13
          C69 13 81 25 80 42
          C79 59 67 68 49 68
          C31 68 20 58 20 41
          Z
        "
      ></path>

      <!-- 不規則牛雜肉塊 -->
      <g class="offal-meat">
        <path
          fill="url(#offal-meat-gradient)"
          d="
            M24 29
            C29 22 39 21 45 27
            L42 38
            C36 42 27 39 24 33
            Z
          "
        ></path>

        <path
          fill="url(#offal-meat-gradient)"
          d="
            M51 20
            C58 16 68 21 71 28
            L64 37
            C58 39 50 34 48 28
            Z
          "
        ></path>

        <path
          fill="url(#offal-meat-gradient)"
          d="
            M25 42
            C31 36 42 37 47 44
            L43 55
            C36 59 27 54 24 48
            Z
          "
        ></path>
      </g>

      <!-- 長條牛肝 -->
      <g class="offal-liver">
        <path
          d="
            M39 35
            C47 28 63 27 72 33
            C75 36 73 41 68 43
            C58 40 48 42 40 47
            C35 46 34 39 39 35
            Z
          "
        ></path>

        <path
          class="offal-liver-layer"
          d="
            M40 40
            C49 34 61 33 70 37
          "
        ></path>
      </g>

      <!-- 蜂窩牛肚 -->
      <path
        class="offal-tripe"
        fill="url(#offal-tripe-gradient)"
        d="
          M42 47
          C51 41 68 43 75 50
          L70 62
          C61 68 46 65 39 58
          Z
        "
      ></path>

      <!-- 牛肚蜂窩紋理 -->
      <g class="offal-honeycomb">
        <path d="M47 49 L51 47 L55 50 L54 54 L49 54 Z"></path>
        <path d="M57 48 L61 47 L65 50 L64 54 L59 54 Z"></path>
        <path d="M66 51 L70 50 L73 53 L71 57 L67 57 Z"></path>

        <path d="M44 56 L48 53 L52 56 L51 60 L46 60 Z"></path>
        <path d="M54 57 L58 53 L62 56 L61 61 L56 61 Z"></path>
        <path d="M64 58 L68 55 L71 58 L69 62 L65 62 Z"></path>
      </g>

      <!-- 卷曲牛腸 -->
      <path
        class="offal-intestine"
        d="
          M27 43
          C21 37 24 29 31 28
          C38 27 41 33 38 38
          C35 42 30 39 30 35
        "
      ></path>

      <!-- 肉類油亮紋理 -->
      <g class="offal-highlights">
        <path d="M28 28 Q34 24 39 28"></path>
        <path d="M53 23 Q60 20 65 25"></path>
        <path d="M29 45 Q35 41 40 44"></path>
        <path d="M43 36 Q51 31 59 33"></path>
      </g>

      <!-- 少量蔥花 -->
      <g class="offal-scallions">
        <circle cx="39" cy="28" r="1.7"></circle>
        <circle cx="49" cy="39" r="1.5"></circle>
        <circle cx="62" cy="31" r="1.6"></circle>
        <circle cx="37" cy="50" r="1.4"></circle>
      </g>
    `,

    "hong-kong-dessert": `
      <defs>
        <radialGradient
          id="mango-dessert-gradient"
          cx="40%"
          cy="34%"
          r="70%"
        >
          <stop offset="0%" stop-color="#ffe7a2"></stop>
          <stop offset="65%" stop-color="#f4c76d"></stop>
          <stop offset="100%" stop-color="#dc9c3f"></stop>
        </radialGradient>

        <linearGradient
          id="mango-piece-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stop-color="#ffd34a"></stop>
          <stop offset="55%" stop-color="#f4a823"></stop>
          <stop offset="100%" stop-color="#dc791c"></stop>
        </linearGradient>
      </defs>

      <!-- 碗底陰影 -->
      <ellipse
        class="mango-dessert-shadow"
        cx="50"
        cy="72"
        rx="28"
        ry="6"
      ></ellipse>

      <!-- 俯視白瓷碗 -->
      <circle
        class="mango-dessert-bowl"
        cx="50"
        cy="41"
        r="36"
      ></circle>

      <circle
        class="mango-dessert-rim"
        cx="50"
        cy="41"
        r="31.5"
      ></circle>

      <!-- 奶香芒果糖水 -->
      <circle
        class="mango-dessert-soup"
        cx="50"
        cy="41"
        r="27.5"
        fill="url(#mango-dessert-gradient)"
      ></circle>

      <!-- 芒果條 -->
      <g class="mango-dessert-pieces">
        <path
          fill="url(#mango-piece-gradient)"
          d="
            M27 28
            Q31 23 37 25
            L43 38
            Q39 42 34 39
            Z
          "
        ></path>

        <path
          fill="url(#mango-piece-gradient)"
          d="
            M44 21
            Q50 19 54 23
            L53 39
            Q48 42 43 38
            Z
          "
        ></path>

        <path
          fill="url(#mango-piece-gradient)"
          d="
            M58 25
            Q64 22 68 27
            L62 41
            Q57 42 54 38
            Z
          "
        ></path>

        <path
          fill="url(#mango-piece-gradient)"
          d="
            M29 47
            Q32 42 38 43
            L45 57
            Q40 61 35 57
            Z
          "
        ></path>

        <path
          fill="url(#mango-piece-gradient)"
          d="
            M55 45
            Q61 41 66 45
            L63 59
            Q57 62 53 57
            Z
          "
        ></path>
      </g>

      <!-- 粉紅西柚果肉 -->
      <g class="mango-dessert-grapefruit">
        <path
          d="
            M40 40
            C44 35 52 35 56 40
            C57 46 52 51 46 50
            C41 49 38 44 40 40
            Z
          "
        ></path>

        <path d="M43 40 L52 47"></path>
        <path d="M48 38 L48 49"></path>
        <path d="M53 40 L44 47"></path>
      </g>

      <!-- 西米 -->
      <g class="mango-dessert-sago">
        <circle cx="26" cy="40" r="1.5"></circle>
        <circle cx="31" cy="43" r="1.4"></circle>
        <circle cx="38" cy="21" r="1.4"></circle>
        <circle cx="57" cy="20" r="1.5"></circle>
        <circle cx="70" cy="36" r="1.4"></circle>
        <circle cx="72" cy="47" r="1.5"></circle>
        <circle cx="48" cy="58" r="1.4"></circle>
        <circle cx="27" cy="53" r="1.5"></circle>
      </g>

      <!-- 糖水光澤 -->
      <path
        class="mango-dessert-shine"
        d="M24 38 Q26 27 36 22"
      ></path>
    `,

    "bamboo-wonton-noodles": `
      <!-- 碗底陰影 -->
      <ellipse
        class="bamboo-noodle-shadow"
        cx="50"
        cy="76"
        rx="37"
        ry="6"
      ></ellipse>

      <!-- 俯視圓碗 -->
      <circle
        class="bamboo-noodle-bowl-edge"
        cx="50"
        cy="42"
        r="40"
      ></circle>

      <circle
        class="bamboo-noodle-bowl"
        cx="50"
        cy="42"
        r="35"
      ></circle>

      <!-- 清湯 -->
      <circle
        class="bamboo-noodle-soup"
        cx="50"
        cy="42"
        r="31"
      ></circle>

      <!-- 細竹昇麵 -->
      <g class="bamboo-thin-noodles">
        <path
          d="
            M22 30
            Q29 24 36 31
            T49 30
            T62 30
          "
        ></path>

        <path
          d="
            M19 35
            Q26 29 33 36
            T47 35
            T61 35
          "
        ></path>

        <path
          d="
            M22 41
            Q30 34 37 42
            T52 41
            T67 41
          "
        ></path>

        <path
          d="
            M25 47
            Q32 40 40 48
            T55 47
            T70 47
          "
        ></path>

        <path
          d="
            M29 53
            Q36 46 44 54
            T59 53
            T73 53
          "
        ></path>

        <path
          d="
            M31 59
            Q39 52 47 59
            T63 58
          "
        ></path>
      </g>

      <!-- 四隻不規則雲吞 -->
      <g class="bamboo-wontons">
        <path
          d="
            M16 26
            Q20 20 26 23
            Q31 18 35 24
            L39 34
            Q37 40 30 39
            Q25 43 21 38
            Q14 36 16 26
            Z
          "
        ></path>

        <path
          d="
            M39 22
            Q44 16 50 21
            Q56 17 60 23
            L63 33
            Q60 39 54 37
            Q48 42 43 37
            Q36 34 39 22
            Z
          "
        ></path>

        <path
          d="
            M20 48
            Q25 42 31 47
            Q36 42 41 48
            L44 59
            Q41 66 34 63
            Q28 68 23 62
            Q17 59 20 48
            Z
          "
        ></path>

        <path
          d="
            M48 47
            Q53 41 59 46
            Q65 41 70 48
            L73 59
            Q70 65 63 63
            Q57 68 52 62
            Q45 59 48 47
            Z
          "
        ></path>
      </g>

      <!-- 雲吞皮褶皺 -->
      <g class="bamboo-wonton-folds">
        <path d="M21 27 Q27 31 34 26"></path>
        <path d="M44 24 Q50 29 57 25"></path>
        <path d="M25 51 Q31 56 38 51"></path>
        <path d="M53 50 Q59 55 67 50"></path>
      </g>

      <!-- 右上角菜心 -->
      <g class="bamboo-noodle-greens">
        <path
          class="bamboo-green-stem"
          d="
            M65 38
            Q71 29 78 20

            M69 42
            Q76 34 83 27

            M62 35
            Q66 26 70 18
          "
        ></path>

        <path
          class="bamboo-green-leaf"
          d="
            M68 26
            Q64 18 70 14
            Q79 16 79 24
            Q75 29 68 26
            Z
          "
        ></path>

        <path
          class="bamboo-green-leaf"
          d="
            M76 33
            Q78 24 86 24
            Q91 31 85 36
            Q80 38 76 33
            Z
          "
        ></path>

        <path
          class="bamboo-green-leaf"
          d="
            M62 30
            Q56 23 61 18
            Q69 18 72 25
            Q69 31 62 30
            Z
          "
        ></path>
      </g>

      <!-- 葱花 -->
      <g class="bamboo-noodle-scallions">
        <circle cx="37" cy="33" r="1.8"></circle>
        <circle cx="56" cy="29" r="1.7"></circle>
        <circle cx="45" cy="50" r="1.6"></circle>
        <circle cx="65" cy="56" r="1.7"></circle>
        <circle cx="30" cy="58" r="1.5"></circle>
      </g>

      <!-- 清湯高光 -->
      <path
        class="bamboo-noodle-soup-highlight"
        d="
          M20 43
          Q23 55 32 62

          M67 62
          Q75 57 79 48
        "
      ></path>
    `,

    "cheung-chau-mochi": `
      <defs>
        <linearGradient
          id="mochi-skin-gradient"
          x1="20%"
          y1="10%"
          x2="80%"
          y2="100%"
        >
          <stop offset="0%" stop-color="#ffffff"></stop>
          <stop offset="62%" stop-color="#fffaf0"></stop>
          <stop offset="100%" stop-color="#ded0ba"></stop>
        </linearGradient>

        <linearGradient
          id="mochi-mango-gradient"
          x1="10%"
          y1="10%"
          x2="90%"
          y2="100%"
        >
          <stop offset="0%" stop-color="#ffdc43"></stop>
          <stop offset="55%" stop-color="#f4aa20"></stop>
          <stop offset="100%" stop-color="#d97a15"></stop>
        </linearGradient>
      </defs>

      <!-- 糯米糍底部陰影 -->
      <ellipse
        class="mango-mochi-shadow"
        cx="50"
        cy="68"
        rx="36"
        ry="7"
      ></ellipse>

      <!-- 後方斜放的一半 -->
      <path
        class="mango-mochi-whole"
        fill="url(#mochi-skin-gradient)"
        d="
          M51 24
          C56 16 67 14 75 19
          L85 43
          C87 50 82 57 74 59
          L55 49
          C49 43 47 31 51 24
          Z
        "
      ></path>

      <!-- 後方露出的芒果果肉 -->
      <path
        class="mango-mochi-filling"
        fill="url(#mochi-mango-gradient)"
        d="
          M58 25
          C62 21 68 21 72 24
          L79 42
          C81 46 78 50 74 51
          L61 44
          C57 39 55 30 58 25
          Z
        "
      ></path>

      <!-- 前方切開的一半 -->
      <path
        class="mango-mochi-cut"
        fill="url(#mochi-skin-gradient)"
        d="
          M15 48
          C17 37 24 25 34 20
          C42 17 50 20 55 27
          L64 53
          C65 61 58 67 49 68
          L26 64
          C18 61 13 56 15 48
          Z
        "
      ></path>

      <!-- 切面內層，形狀不再是橢圓 -->
      <path
        class="mango-mochi-cut-inner"
        d="
          M23 48
          C25 39 30 30 37 27
          C42 25 47 27 50 32
          L57 52
          C58 57 53 61 48 61
          L31 59
          C25 57 21 53 23 48
          Z
        "
      ></path>

      <!-- 大塊長條芒果餡 -->
      <path
        class="mango-mochi-filling"
        fill="url(#mochi-mango-gradient)"
        d="
          M30 47
          C31 40 35 33 40 31
          C44 30 47 32 49 36
          L54 51
          C55 55 51 58 47 57
          L36 55
          C32 54 29 51 30 47
          Z
        "
      ></path>

      <!-- 芒果果肉光澤 -->
      <path
        class="mango-mochi-filling-shine"
        d="
          M35 43
          Q38 35 43 34

          M62 30
          Q65 24 69 25
        "
      ></path>

      <!-- 柔軟糯米外皮的摺痕 -->
      <g class="mango-mochi-folds">
        <path d="M20 45 Q25 40 29 38"></path>
        <path d="M20 56 Q26 59 31 59"></path>
        <path d="M51 23 Q55 27 57 32"></path>
        <path d="M78 51 Q81 47 80 42"></path>
      </g>

      <!-- 糯米粉 -->
      <g class="mango-mochi-powder">
        <circle cx="22" cy="50" r="1.1"></circle>
        <circle cx="30" cy="28" r="1"></circle>
        <circle cx="48" cy="24" r="1.1"></circle>
        <circle cx="58" cy="60" r="1"></circle>
        <circle cx="55" cy="21" r="1"></circle>
        <circle cx="78" cy="29" r="1.1"></circle>
        <circle cx="80" cy="48" r="1"></circle>
      </g>
    `,

    "local-food": `
      ${plate}

      <path
        class="food-cloche"
        d="
          M18 54
          Q21 26 50 23
          Q79 26 82 54
          Z
        "
      ></path>

      <path
        class="cloche-rim"
        d="M13 56 H87"
      ></path>

      <circle
        class="cloche-handle"
        cx="50"
        cy="21"
        r="5"
      ></circle>

      <path
        class="cloche-shine"
        d="
          M30 43
          Q36 31 48 29
        "
      ></path>
    `
  };

  // ========================================
  // 名稱、類型與自動識別關鍵詞
  // ========================================

  const DEFINITIONS =
    Object.freeze({
      "pineapple-bun": {
        label: "菠蘿包",
        keywords: [
          "菠蘿包",
          "菠萝包",
          "pineapple bun"
        ]
      },

      "siu-mai": {
        label: "魚肉燒賣",
        keywords: [
          "魚肉燒賣",
          "鱼肉烧卖",
          "燒賣",
          "烧卖",
          "燒麥",
          "烧麦",
          "siu mai"
        ]
      },

      "satay-beef-noodles": {
        label: "沙嗲牛肉麵",
        keywords: [
          "沙嗲牛肉麵",
          "沙爹牛肉麵",
          "沙爹牛肉面",
          "沙嗲",
          "沙爹",
          "satay"
        ]
      },

      "baked-tomato-rice": {
        label: "焗鮮茄飯",
        keywords: [
          "焗鮮茄飯",
          "焗鲜茄饭",
          "鮮茄飯",
          "鲜茄饭",
          "番茄飯",
          "番茄饭",
          "tomato rice"
        ]
      },

      "milk-tea-red-bean-ice": {
        label: "港式奶茶＋紅豆冰",
        keywords: [
          "港式奶茶",
          "奶茶",
          "紅豆冰",
          "红豆冰",
          "milk tea"
        ]
      },

      "french-toast": {
        label: "西多士",
        keywords: [
          "西多士",
          "法蘭西多士",
          "法兰西多士",
          "french toast"
        ]
      },

      "mixed-sauce-rice-roll": {
        label: "混醬腸粉",
        keywords: [
          "混醬腸粉",
          "混酱肠粉",
          "豬腸粉",
          "猪肠粉"
        ]
      },

      "curry-fish-balls": {
        label: "咖喱魚蛋",
        keywords: [
          "咖喱魚蛋",
          "咖喱鱼蛋",
          "魚蛋",
          "鱼蛋",
          "fish ball"
        ]
      },

      "roast-goose": {
        label: "燒鵝",
        keywords: [
          "燒鵝",
          "烧鹅",
          "roast goose"
        ]
      },

      "char-siu": {
        label: "叉燒",
        keywords: [
          "叉燒",
          "叉烧",
          "char siu",
          "barbecue pork"
        ]
      },

      "siu-mei-platter": {
        label: "燒臘",
        keywords: [
          "燒臘",
          "烧腊",
          "燒味",
          "烧味",
          "siu mei"
        ]
      },

      "sorrowful-rice": {
        label: "黯然銷魂飯",
        keywords: [
          "黯然銷魂飯",
          "黯然销魂饭",
          "銷魂飯",
          "销魂饭"
        ]
      },

      "bamboo-wonton-noodles": {
        label: "竹昇雲吞麵",
        keywords: [
          "竹昇雲吞麵",
          "竹升雲吞麵",
          "竹升云吞面",
          "竹昇"
        ]
      },

      "wonton-noodles": {
        label: "雲吞麵",
        keywords: [
          "雲吞麵",
          "云吞面",
          "wonton noodle"
        ]
      },

      "dim-sum": {
        label: "港式點心",
        keywords: [
          "港式點心",
          "港式点心",
          "點心",
          "点心",
          "dim sum"
        ]
      },

      "sugar-puff": {
        label: "糖沙翁",
        keywords: [
          "糖沙翁",
          "沙翁",
          "sugar puff"
        ]
      },

      "imitation-fin-soup": {
        label: "碗仔翅",
        keywords: [
          "碗仔翅",
          "imitation shark fin"
        ]
      },

      "stuffed-three-treasures": {
        label: "煎釀三寶",
        keywords: [
          "煎釀三寶",
          "煎酿三宝",
          "三寶",
          "三宝"
        ]
      },

      "puff-egg-tart": {
        label: "酥皮蛋撻",
        keywords: [
          "酥皮蛋撻",
          "酥皮蛋挞",
          "蛋撻",
          "蛋挞",
          "egg tart"
        ]
      },

      "tomato-beef-macaroni": {
        label: "茄牛通",
        keywords: [
          "茄牛通",
          "番茄牛肉通粉",
          "tomato beef macaroni"
        ]
      },

      "cart-noodles": {
        label: "車仔麵",
        keywords: [
          "車仔麵",
          "车仔面",
          "cart noodle"
        ]
      },

      "clear-beef-brisket": {
        label: "清湯牛腩",
        keywords: [
          "清湯牛腩",
          "清汤牛腩",
          "牛腩",
          "beef brisket"
        ]
      },

      "beef-offal": {
        label: "牛雜",
        keywords: [
          "牛雜",
          "牛杂",
          "beef offal"
        ]
      },

      "hong-kong-dessert": {
        label: "港式糖水",
        keywords: [
          "港式糖水",
          "糖水",
          "甜品",
          "dessert"
        ]
      },

      "cheung-chau-mochi": {
        label: "長洲糯米糍",
        keywords: [
          "長洲糯米糍",
          "长洲糯米糍",
          "糯米糍",
          "mochi"
        ]
      },

      "local-food": {
        label: "其他香港味道",
        keywords: []
      }
    });

  // ========================================
  // 根據地點名稱尋找食物類型
  // ========================================

  function matchFoodType(
    information = {}
  ) {
    const text = [
      information.title,
      information.shopName,
      information.location,
      information.shortLocation,
      information.description
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    for (
      const [
        type,
        definition
      ] of Object.entries(
        DEFINITIONS
      )
    ) {
      const matched =
        definition.keywords.some(
          (keyword) =>
            text.includes(
              keyword.toLowerCase()
            )
        );

      if (matched) {
        return type;
      }
    }

    return "";
  }

  // ========================================
  // 取得地點的食物類型
  // ========================================

  function getFoodMarkerType(
    information = {}
  ) {
    const explicitType =
      information.foodType || "";

    const matchedType =
      matchFoodType(information);

    /*
     * 兼容以前從網頁新增的地點。
     * 如果當時使用預設菠蘿包或其他食物，
     * 便重新根據地點名稱自動識別。
     */
    if (
      information.source ===
      "community" &&
      (
        explicitType ===
        "pineapple-bun" ||
        explicitType ===
        "local-food"
      ) &&
      matchedType
    ) {
      return matchedType;
    }

    if (
      explicitType &&
      ART[explicitType]
    ) {
      return explicitType;
    }

    return (
      matchedType ||
      "local-food"
    );
  }

  // ========================================
  // 產生SVG圖標內容
  // ========================================

  function renderFoodIcon(type) {
    const definition =
      DEFINITIONS[type];

    const artwork =
      ART[type];

    if (
      !definition ||
      !artwork
    ) {
      return "";
    }

    return `
      <span
        class="food-vector-icon"
        data-food-icon="${type}"
      >
        <svg
          class="food-vector-svg"
          viewBox="0 0 100 84"
          focusable="false"
          aria-hidden="true"
        >
          ${artwork}
        </svg>
      </span>
    `;
  }



  function createFoodMarkerVisual(
    information
  ) {
    const foodType =
      getFoodMarkerType(information);

    const visual =
      document.createElement("span");

    visual.className =
      `food-marker-icon food-marker-${foodType}`;

    visual.dataset.foodType =
      foodType;

    visual.setAttribute(
      "aria-hidden",
      "true"
    );

    if (foodType === "pineapple-bun") {
      visual.innerHTML = `
      <span class="pineapple-butter-bun">
        <i class="pineapple-bun-top">
          <b class="bun-line line-one"></b>
          <b class="bun-line line-two"></b>
          <b class="bun-line line-three"></b>
          <b class="bun-line line-four"></b>
        </i>

        <i class="pineapple-bun-butter"></i>
        <i class="pineapple-bun-bottom"></i>
      </span>
    `;
    } else if (
      foodType === "siu-mai"
    ) {
      visual.innerHTML = `
      <span class="fish-siu-mai-icon">
        <svg
          class="fish-siu-mai-svg"
          viewBox="0 0 120 110"
          role="img"
          aria-label="魚肉燒賣"
        >
          <ellipse
            class="siu-mai-shadow"
            cx="61"
            cy="96"
            rx="38"
            ry="9"
          ></ellipse>

          <!-- 後方燒賣皮 -->
          <path
            class="siu-mai-back-wrapper"
            d="
            M31 51
            Q25 43 24 35
            Q24 30 29 34
            Q38 40 47 38
            Q56 31 65 37
            Q76 40 88 33
            Q93 30 91 36
            Q90 44 86 52
            Z
            "
          ></path>

          <!-- 白色魚肉餡 -->
          <path
            class="siu-mai-fish-filling"
            d="
              M34 47
              Q37 35 48 34
              Q54 28 63 33
              Q72 28 80 36
              Q89 39 87 49
              Q85 59 73 62
              Q63 67 52 61
              Q39 62 33 54
              Q30 50 34 47
              Z
            "
          ></path>

          <path
            class="siu-mai-filling-shadow"
            d="
              M37 51
              Q45 57 54 55
              Q64 61 74 55
              Q82 54 86 47
              Q86 58 75 62
              Q63 68 52 62
              Q40 63 34 55
              Z
            "
          ></path>

          <path
            class="siu-mai-filling-highlight"
            d="
              M43 42
              Q49 35 57 38
              Q61 34 67 37
            "
          ></path>

          <!-- 左側翻出的薄皮 -->
          <path
            class="siu-mai-wrapper-flap siu-mai-left-flap"
            d="
            M35 50
            Q29 45 26 38
            Q24 33 29 36
            Q38 41 47 49
            L40 59
            Z
            "
          ></path>

          <!-- 右側翻出的薄皮 -->
          <path
            class="siu-mai-wrapper-flap siu-mai-right-flap"
            d="
            M83 49
            Q89 44 91 37
            Q93 32 88 36
            Q80 41 71 49
            L78 59
            Z
            "
          ></path>

          <!-- 燒賣主體 -->
          <path
            class="siu-mai-wrapper-body"
            d="
              M34 49
              Q41 56 49 53
              Q58 61 67 54
              Q77 58 85 49
              L88 82
              Q83 94 63 98
              Q42 96 30 84
              Z
            "
          ></path>

          <!-- 前方翻折薄皮 -->
          <path
            class="siu-mai-front-flap"
            d="
              M30 55
              Q39 62 48 55
              Q56 67 66 56
              Q75 63 86 53
              L82 70
              Q72 66 65 72
              Q55 65 47 72
              Q38 66 32 72
              Z
            "
          ></path>

          <!-- 燒賣皮褶皺 -->
          <path
            class="siu-mai-fold"
            d="
              M36 63 Q40 73 39 87
              M48 67 Q51 77 50 92
              M61 66 Q63 79 62 95
              M74 65 Q72 78 75 90
              M83 61 Q79 73 82 83
            "
          ></path>

          <path
            class="siu-mai-wrapper-highlight"
            d="
              M38 58
              Q41 72 43 79

              M74 59
              Q70 69 70 78
            "
          ></path>

          <!-- 魚肉紋理 -->
          <circle
            class="siu-mai-filling-detail"
            cx="50"
            cy="46"
            r="2"
          ></circle>

          <circle
            class="siu-mai-filling-detail"
            cx="66"
            cy="43"
            r="1.7"
          ></circle>

          <circle
            class="siu-mai-filling-detail"
            cx="75"
            cy="49"
            r="1.4"
          ></circle>
        </svg>
      </span>
    `;
    } else if (
      foodType ===
      "satay-beef-noodles"
    ) {
      visual.innerHTML = `
      <span class="satay-noodle-icon">
        <svg
          class="satay-noodle-svg"
          viewBox="0 0 110 100"
          role="img"
          aria-label="沙爹牛肉麵"
        >
          <path
            class="satay-chopstick"
            d="M82 21 L105 88"
          ></path>

          <path
            class="satay-chopstick"
            d="M89 18 L109 85"
          ></path>

          <ellipse
            class="satay-bowl-shadow"
            cx="50"
            cy="58"
            rx="42"
            ry="37"
          ></ellipse>

          <circle
            class="satay-bowl"
            cx="50"
            cy="50"
            r="42"
          ></circle>

          <circle
            class="satay-bowl-rim"
            cx="50"
            cy="50"
            r="37"
          ></circle>

          <circle
            class="satay-soup"
            cx="50"
            cy="50"
            r="33"
          ></circle>

          <path
            class="satay-soup-glow"
            d="
              M23 42
              C31 23 59 17 75 33
            "
          ></path>

          <path
            class="satay-noodle noodle-a"
            d="
              M23 34
              C31 28 34 42 42 35
              C49 28 52 42 60 34
              C67 27 72 37 78 32
            "
          ></path>

          <path
            class="satay-noodle noodle-b"
            d="
              M20 48
              C27 40 34 55 42 47
              C49 39 54 55 62 47
              C69 39 76 51 80 44
            "
          ></path>

          <path
            class="satay-noodle noodle-c"
            d="
              M24 63
              C32 54 36 69 44 61
              C52 53 57 69 64 61
              C71 53 76 63 79 58
            "
          ></path>

          <path
            class="satay-noodle noodle-d"
            d="
              M31 73
              C37 65 43 77 49 70
              C55 63 62 75 68 67
            "
          ></path>

          <path
            class="satay-beef beef-a"
            d="
              M28 39
              C32 30 46 27 54 33
              C58 38 53 47 45 51
              C36 55 26 49 28 39
              Z
            "
          ></path>

          <path
            class="satay-beef beef-b"
            d="
              M50 45
              C57 35 72 36 78 44
              C82 51 75 59 67 62
              C57 65 47 56 50 45
              Z
            "
          ></path>

          <path
            class="satay-beef beef-c"
            d="
              M35 58
              C41 49 55 51 61 58
              C65 64 58 72 49 75
              C40 76 31 68 35 58
              Z
            "
          ></path>

          <path
            class="beef-highlight"
            d="M34 38 C40 36 45 37 49 40"
          ></path>

          <path
            class="beef-highlight"
            d="M57 48 C63 45 70 47 74 51"
          ></path>

          <path
            class="beef-highlight"
            d="M41 62 C47 59 53 61 57 65"
          ></path>

          <circle
            class="satay-scallion"
            cx="70"
            cy="34"
            r="2.5"
          ></circle>

          <circle
            class="satay-scallion"
            cx="27"
            cy="56"
            r="2"
          ></circle>

          <circle
            class="satay-scallion"
            cx="67"
            cy="70"
            r="2.3"
          ></circle>
        </svg>
      </span>
    `;
    } else if (
      foodType ===
      "baked-tomato-rice"
    ) {
      visual.innerHTML = `
      <span class="baked-rice-icon">
        <svg
          class="baked-rice-svg"
          viewBox="0 0 120 90"
          role="img"
          aria-label="焗鮮茄飯"
        >
          <ellipse
            class="baked-dish-shadow"
            cx="59"
            cy="68"
            rx="50"
            ry="14"
          ></ellipse>

          <path
            class="baked-red-dish"
            d="
              M11 35
              C13 20 29 14 58 14
              C88 14 106 21 109 35
              L104 64
              C100 76 84 82 57 82
              C30 82 15 75 12 63
              Z
            "
          ></path>

          <ellipse
            class="baked-dish-inside"
            cx="59"
            cy="43"
            rx="44"
            ry="25"
          ></ellipse>

          <path
            class="baked-rice-layer"
            d="
              M20 45
              C27 27 86 25 99 43
              C95 62 31 68 20 45
              Z
            "
          ></path>

          <path
            class="baked-tomato-sauce"
            d="
              M23 43
              C29 27 85 26 96 41
              C91 57 35 62 23 43
              Z
            "
          ></path>

          <path
            class="baked-cheese"
            d="
              M28 38
              C32 29 43 29 49 32
              C54 25 67 26 72 31
              C80 27 91 32 91 39
              C97 45 89 51 82 52
              C77 59 65 56 60 53
              C54 59 42 57 38 52
              C29 54 23 47 28 38
              Z
            "
          ></path>

          <path
            class="cheese-melt cheese-melt-one"
            d="
              M39 49
              C40 56 44 58 45 64
            "
          ></path>

          <path
            class="cheese-melt cheese-melt-two"
            d="
              M72 51
              C71 57 75 59 75 64
            "
          ></path>

          <path
            class="fresh-tomato-piece tomato-piece-one"
            d="
              M21 38
              C26 32 34 33 37 38
              C34 44 26 46 21 38
              Z
            "
          ></path>

          <path
            class="fresh-tomato-piece tomato-piece-two"
            d="
              M82 37
              C87 31 95 34 97 40
              C93 46 85 45 82 37
              Z
            "
          ></path>

          <path
            class="fresh-tomato-piece tomato-piece-three"
            d="
              M26 51
              C31 46 38 48 39 54
              C34 58 28 57 26 51
              Z
            "
          ></path>

          <circle
            class="cheese-toast toast-one"
            cx="42"
            cy="36"
            r="3.5"
          ></circle>

          <circle
            class="cheese-toast toast-two"
            cx="59"
            cy="33"
            r="2.6"
          ></circle>

          <circle
            class="cheese-toast toast-three"
            cx="75"
            cy="38"
            r="4"
          ></circle>

          <circle
            class="cheese-toast toast-four"
            cx="51"
            cy="48"
            r="3"
          ></circle>

          <circle
            class="cheese-toast toast-five"
            cx="69"
            cy="48"
            r="2.8"
          ></circle>

          <path
            class="visible-rice-grain"
            d="M31 57 Q35 53 39 57"
          ></path>

          <path
            class="visible-rice-grain"
            d="M45 61 Q49 57 53 61"
          ></path>

          <path
            class="visible-rice-grain"
            d="M78 57 Q82 53 86 57"
          ></path>
        </svg>
      </span>
    `;
    } else if (
      foodType ===
      "milk-tea-red-bean-ice"
    ) {
      visual.innerHTML = `
      <span class="hk-drinks-pair">
        <i class="hk-milk-tea">
          <b class="tea-surface"></b>
          <b class="tea-handle"></b>
        </i>

        <i class="red-bean-ice">
          <b class="ice-shine"></b>
          <b class="red-bean bean-one"></b>
          <b class="red-bean bean-two"></b>
          <b class="red-bean bean-three"></b>
          <b class="red-bean bean-four"></b>
          <b class="drink-straw"></b>
        </i>
      </span>
    `;
    } else if (
      foodType !== "local-food" &&
      ART[foodType]
    ) {
      /*
       * 新增的20种食物，
       * 使用food-icons.js里的SVG图案。
       */
      visual.innerHTML =
        renderFoodIcon(foodType);
    } else {
      /*
       * 无法识别的食物，
       * 使用原来的通用图案。
       */
      visual.innerHTML = `
      <span class="local-food-dish">
        <i></i>
      </span>
    `;
    }

    return visual;
  }


  // ========================================
  // 自動加入圖標樣式
  // ========================================

  function installFoodStyles() {
    if (
      document.querySelector(
        "#hk-food-icon-styles"
      )
    ) {
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "hk-food-icon-styles";

    style.textContent =
      FOOD_ICON_STYLES;

    document.head.append(style);
  }

  // ========================================
  // 自動擴充新增地點表單
  // ========================================

  function installFoodOptions() {
    const select =
      document.querySelector(
        "#contribution-food-type"
      );

    if (!select) {
      return;
    }

    const fallbackOption =
      select.querySelector(
        'option[value="local-food"]'
      );

    for (
      const [
        type,
        definition
      ] of Object.entries(
        DEFINITIONS
      )
    ) {
      const existingOption =
        select.querySelector(
          `option[value="${type}"]`
        );

      if (existingOption) {
        continue;
      }

      const option =
        document.createElement(
          "option"
        );

      option.value = type;

      option.textContent =
        definition.label;

      select.insertBefore(
        option,
        fallbackOption
      );
    }
  }

  // ========================================
  // 提供給app.js使用
  // ========================================

  window.HK_FOOD_ICONS =
    Object.freeze({
      definitions:
        DEFINITIONS,

      match:
        matchFoodType,

      render:
        renderFoodIcon
    });

  window.getFoodMarkerType =
    getFoodMarkerType;

  window.createFoodMarkerVisual =
    createFoodMarkerVisual;

  installFoodStyles();
  installFoodOptions();

  window.addEventListener(
    "DOMContentLoaded",
    installFoodOptions,
    {
      once: true
    }
  );

})();
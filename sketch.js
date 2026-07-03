// let color_palette = ["#de0e0e", "#7294b4", "#273b6e", "#aa6027"];
// basePalette = ["#3e423b", "#D9CCA7"];
let color_palette;
let basePalette;
let padding = 500;

async function setup() {
  createCanvas(2000, 1400); // 畫布大小：width, height
  background(random(basePalette)); // 背景顏色

  let color_rand = random();
  // features setting
  if (color_rand < 0.4) {
    // "rusty blue"
    color_palette = [
      "#597798",
      "#A69563",
      "#cfc8c4",
      "#5582b6",
      // "#68332e",
      // "#BAC3A9",
      // "#9D6248",
      // "#7BA1A6",
    ];
    basePalette = ["#bcccd6"];
    // } else if (color_rand < 0.7) {
    // // "rusty"
    // color_palette = ["#A64F03", "#A64F03", "#F2D1B3", "#73290E", "#A69563"];
    // basePalette = ["#73290E", "#73290E"];
  } else {
    // "gray"
    color_palette = ["#80574b", "#d3cbb0", "#b38808", "#D99543", "#e6c55b"];
    basePalette = ["#cdebe7", "#b1b0b0"];
  }

  background(random(basePalette)); // 背景顏色
  colorMode(HSB);

  // 呼叫自己建立的函式
  // NN_rect(100, 200, 20, 80, 50, 5, 5);

  // 使用迴圈重複繪製
  for (let i = 0; i < 30; i++) {
    let x = random(-500, width);
    let y = random(-500, height);
    let xCount = int(random(10, 400));
    let yCount = int(random(100, 300));
    let R = 3;
    let xSpan = R + random(1, 5, 10);
    let ySpan = R + random(2, 5);
    NN_rect(x, y, xCount, yCount, xSpan, ySpan, R);
    // await sleep(10);
  }

  let xsum = 0;
  let ysum = 0;
  // let yCount = 80;

  // for (let i = 0; i < 20; i++) {
  //   let R = 2;
  //   let xSpan = R + 2;
  //   let ySpan = R + 2;
  //   let xCount = int(random(10, 80));
  //   let yCount=height/ySpan;
  //   let x = xsum;
  //   let y = ysum;

  //   NN_rect(x, y, xCount, yCount, xSpan, ySpan, R);
  //   xsum = xsum + xCount * xSpan;
  //   // if (xsum > width) {
  //   //   ysum = ysum + yCount * ySpan;
  //   //   yCount = int(random(50, 200));
  //   //   xsum = 0;
  //   // }

  //   if (xsum > width) {
  //     break;
  //   }
  // }

  // 只畫一次
  noLoop();
}

function draw() {}

// _x: 起始x座標, _y: 起始y座標, _xCount: x方向點點排數, _yCount: y方向點點排數, _xSpan: x方向間距, _ySpan: y方向間距, _R: 點點大小
function NN_rect(_x, _y, _xCount, _yCount, _xSpan, _ySpan, _R) {
  let mainClr = random(color_palette); // 隨機選一個顏色
  let fade_scale = random();
  let mainHue = hue(mainClr);
  let mainSat = saturation(mainClr);
  let mainBri = brightness(mainClr);
  let lightClr = color(mainHue, mainSat - 10, mainBri + 30);
  let waveScl = random();

  // 設定 noise 生鏽參數 -----------------------------------------------
  let noiseStep = 0.002; // 波型取樣距離，小->波型變化小；大->波型變化大
  let sharpness = 0.1; // 銳利取樣範圍，大->比較不銳利；銳利畫取樣範圍，小-> 邊緣銳利
  let noiseRnd = random();

  // 繪製點點矩陣
  for (let i = 0; i < _xCount; i++) {
    let px = i * _xSpan + _x; // 計算 x 座標
    for (let j = 0; j < _yCount; j++) {
      let py = j * _ySpan + _y; // 計算 y 座標

      let fade_rate = j / _yCount;
      fade_rate = map(fade_rate, 0, 1, 0, fade_scale);

      fill(mainClr);
      if (random() > fade_rate) {
        push(); // 儲存畫布目前狀態
        translate(px, py); // 移動畫布原點

        // 光影
        if (waveScl < 0.9) {
          fill(abs(sin(px / 20)) < 0.1 ? lightClr : mainClr);
        }
        // else {
        //   fill(abs(sin(py / 10)) < 0.1 ? lightClr : mainClr);
        // }
        noStroke(); // 不要外框線
        let _R = random(0.5, 8);
        circle(0, 0, _R);

        // 繪製 noise 生鏽 -----------------------------------------------
        if (noiseRnd < 0.3) {
          let off = noise(px * noiseStep, py * noiseStep);
          let valley = abs(sin(px / 20));
          let offStroke =
            constrain(
              //限制噪聲的範圍(漸層範圍)
              map(off, 0.5 - sharpness, 0.5 + sharpness, 0, 1) * _R * 3,
              0,
              _R * 3,
            ) *
            valley * //凹陷處生鏽 會依照凹陷程度有大小差別
            0.7;
          stroke("#945031");
          noFill();
          strokeWeight(2);
          circle(0, 0, offStroke);
        }

        //毛絮

        if (random() < 0.03) {
          noFill();
          stroke(random(color_palette));
          strokeWeight(2);
          rotate(random(TWO_PI));
          line(-_R, -_R, _R, _R);

          //   // 用線條繪製 XX 材質

          // if (random() < 0.05) {
          //     noFill();
          //     stroke(mainClr);
          //     strokeWeight(2);
          //     line(-r, -r, r, r);
          //     line(-r, r, r, -r);

          //洞

          // if (random() < 0.05) {
          //   fill(random(color_palette));
          //   noStroke();
          //   rotate(random(TWO_PI));
          //   ellipse(5, 5, 20, 16);
          // }
        }

        pop(); // 回復至畫布先前狀態
      }
    }
  }
}
// function sleep(ms) {return ew Promise((resolve) => setTimeout(resolve, ms));}

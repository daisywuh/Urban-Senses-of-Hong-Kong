(() => {
  "use strict";

  let scene, camera, renderer, overlay, stage;
  let animationId = null;

  // ============================================================
  // CONTROL
  // ============================================================

  const control = {
    mode: "model",

    yaw: -0.72,
    pitch: 0.58,
    distance: 34,

    targetYaw: -0.72,
    targetPitch: 0.58,
    targetDistance: 34,

    cornerProgress: 0,
    targetCornerProgress: 0,
    cornerYaw: 0,
    cornerPitch: 0,
    cornerZoom: 1.75,
    targetCornerZoom: 1.75,

    dragging: false,
    lastX: 0,
    lastY: 0
  };


  // ============================================================
  // COLOURS
  // ============================================================

  const C = {
    bg: 0xd8d0c3,

    base: 0x51493f,
    baseTop: 0xb3a58f,

    road: 0x464946,
    pavement: 0xb5ad9e,
    curb: 0xd5ccbd,

    cream: 0xaa9068,
    beige: 0x8f775b,
    grey: 0x77776f,
    pink: 0x986e68,
    green: 0x6f8278,
    brown: 0x745945,
    concrete: 0x7c7569,

    dark: 0x303330,
    metal: 0x353936,
    glass: 0x485653,

    red: 0x8d302a,
    darkRed: 0x6e2c28,
    darkGreen: 0x40584e,
    gold: 0xc2a05e
  };


  function colorToCss(color) {
    const c = new THREE.Color(color);

    return `rgb(
    ${Math.round(c.r * 255)},
    ${Math.round(c.g * 255)},
    ${Math.round(c.b * 255)}
  )`;
  }


  function makeOldWallTexture(baseColor, seed = 0) {
    const canvas = document.createElement("canvas");

    canvas.width = 512;
    canvas.height = 768;

    const ctx = canvas.getContext("2d");

    const base = new THREE.Color(baseColor);

    ctx.fillStyle = colorToCss(baseColor);
    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    // 輕微上下色差
    const gradient =
      ctx.createLinearGradient(
        0,
        0,
        0,
        canvas.height
      );

    gradient.addColorStop(
      0,
      "rgba(244,231,204,0.08)"
    );

    gradient.addColorStop(
      0.45,
      "rgba(255,255,255,0)"
    );

    gradient.addColorStop(
      1,
      "rgba(48,40,32,0.17)"
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    // 大片褪色區
    for (let i = 0; i < 18; i++) {
      const x =
        (seed * 71 + i * 137) %
        canvas.width;

      const y =
        (seed * 113 + i * 193) %
        canvas.height;

      const w =
        45 +
        ((seed + i * 31) % 120);

      const h =
        55 +
        ((seed + i * 47) % 160);

      ctx.fillStyle =
        i % 3 === 0
          ? "rgba(225,210,182,0.07)"
          : i % 3 === 1
            ? "rgba(70,62,52,0.045)"
            : "rgba(174,150,120,0.05)";

      ctx.fillRect(
        x,
        y,
        w,
        h
      );
    }


    // 牆面細小斑駁
    for (let i = 0; i < 240; i++) {
      const x =
        (
          seed * 53 +
          i * 83
        ) % canvas.width;

      const y =
        (
          seed * 97 +
          i * 61
        ) % canvas.height;

      const size =
        1 +
        (
          (
            seed +
            i * 17
          ) % 5
        );

      ctx.fillStyle =
        i % 2 === 0
          ? "rgba(54,48,41,0.040)"
          : "rgba(239,220,188,0.035)";

      ctx.fillRect(
        x,
        y,
        size,
        size
      );
    }


    // 雨水垂痕
    for (let i = 0; i < 13; i++) {
      const x =
        20 +
        (
          (
            seed * 43 +
            i * 73
          ) %
          470
        );

      const top =
        80 +
        (
          (
            seed * 29 +
            i * 91
          ) %
          300
        );

      const length =
        110 +
        (
          (
            seed * 17 +
            i * 43
          ) %
          260
        );

      const width =
        2 +
        (
          i % 4
        );

      const rain =
        ctx.createLinearGradient(
          x,
          top,
          x,
          top + length
        );

      rain.addColorStop(
        0,
        "rgba(45,42,36,0.00)"
      );

      rain.addColorStop(
        0.18,
        "rgba(45,42,36,0.09)"
      );

      rain.addColorStop(
        1,
        "rgba(45,42,36,0.00)"
      );

      ctx.fillStyle = rain;

      ctx.fillRect(
        x,
        top,
        width,
        length
      );
    }


    // 局部水泥補丁
    const patchCount =
      3 + seed % 3;

    for (
      let i = 0;
      i < patchCount;
      i++
    ) {
      const x =
        40 +
        (
          (
            seed * 23 +
            i * 149
          ) %
          360
        );

      const y =
        120 +
        (
          (
            seed * 67 +
            i * 117
          ) %
          460
        );

      const w =
        35 +
        (
          (
            seed +
            i * 41
          ) %
          90
        );

      const h =
        22 +
        (
          (
            seed +
            i * 23
          ) %
          70
        );

      ctx.fillStyle =
        i % 2 === 0
          ? "rgba(178,168,147,0.11)"
          : "rgba(102,96,83,0.08)";

      ctx.fillRect(
        x,
        y,
        w,
        h
      );
    }


    // 底部潮濕發黑
    const damp =
      ctx.createLinearGradient(
        0,
        canvas.height * 0.76,
        0,
        canvas.height
      );

    damp.addColorStop(
      0,
      "rgba(48,46,40,0)"
    );

    damp.addColorStop(
      1,
      "rgba(42,41,36,0.26)"
    );

    ctx.fillStyle = damp;

    ctx.fillRect(
      0,
      canvas.height * 0.72,
      canvas.width,
      canvas.height * 0.28
    );


    // 少量掉漆點
    for (let i = 0; i < 28; i++) {
      const x =
        (
          seed * 19 +
          i * 101
        ) % canvas.width;

      const y =
        (
          seed * 41 +
          i * 79
        ) % canvas.height;

      const radius =
        3 +
        (
          (
            seed +
            i * 13
          ) % 8
        );

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        i % 2 === 0
          ? "rgba(79,72,62,0.065)"
          : "rgba(215,196,164,0.08)";

      ctx.fill();
    }


    const texture =
      new THREE.CanvasTexture(canvas);

    texture.encoding =
      THREE.sRGBEncoding;

    texture.wrapS =
      THREE.RepeatWrapping;

    texture.wrapT =
      THREE.RepeatWrapping;

    texture.repeat.set(
      1.25,
      1.55
    );

    texture.needsUpdate = true;

    return texture;
  }

  // ============================================================
  // HELPERS
  // ============================================================

  function mat(color, roughness = 0.86) {
    return new THREE.MeshStandardMaterial({
      color,
      roughness
    });
  }


  function box(
    w,
    h,
    d,
    material,
    x,
    y,
    z,
    parent = stage
  ) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      material
    );

    mesh.position.set(x, y, z);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    parent.add(mesh);

    return mesh;
  }


  function cylinder(
    radius,
    height,
    material,
    x,
    y,
    z,
    parent = stage
  ) {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(
        radius,
        radius,
        height,
        12
      ),
      material
    );

    mesh.position.set(x, y, z);

    mesh.castShadow = true;

    parent.add(mesh);

    return mesh;
  }


  // ============================================================
  // UI
  // ============================================================

  function createOverlay() {
    overlay = document.createElement("div");

    overlay.id = "streetSceneOverlay";

    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      zIndex: "99999",
      background: "#d8d0c3",
      display: "none",
      overflow: "hidden"
    });


    const title = document.createElement("div");

    title.innerHTML = `
      <div style="
        font-size:12px;
        letter-spacing:.18em;
        opacity:.58;
        margin-bottom:7px;
      ">
        城市記憶 · HISTORICAL DIORAMA
      </div>

      <div style="
        font-size:30px;
        font-weight:700;
      ">
        囍帖街 · Lee Tung Street
      </div>

      <div style="
        font-size:12px;
        margin-top:8px;
        opacity:.52;
      ">
        拖動旋轉 · 滾輪縮放
      </div>
    `;

    Object.assign(title.style, {
      position: "absolute",
      top: "28px",
      left: "32px",
      zIndex: "10",
      color: "#312d29",
      fontFamily:
        '"Noto Sans TC","Microsoft JhengHei",sans-serif',
      pointerEvents: "none"
    });

    overlay.appendChild(title);


    const close = document.createElement("button");

    close.textContent = "← 返回地圖";

    Object.assign(close.style, {
      position: "absolute",
      right: "28px",
      top: "28px",
      zIndex: "10",
      border: "1px solid rgba(40,35,30,.18)",
      borderRadius: "999px",
      padding: "11px 18px",
      background: "rgba(250,247,241,.88)",
      color: "#312d29",
      cursor: "pointer"
    });

    close.onclick = closeScene;

    overlay.appendChild(close);


    const enterStreet =
      document.createElement("button");

    enterStreet.id = "enterHistoricalStreet";

    enterStreet.innerHTML = `
      <span style="font-size:16px;margin-right:7px;">↗</span>
      走進喜帖街
    `;

    Object.assign(enterStreet.style, {
      position: "absolute",
      left: "50%",
      bottom: "32px",
      transform: "translateX(-50%)",
      zIndex: "20",

      border:
        "1px solid rgba(255,255,255,.35)",

      borderRadius: "999px",

      padding: "13px 23px",

      background:
        "rgba(45,39,34,.88)",

      color: "#f5eee3",

      fontSize: "14px",
      fontWeight: "600",
      letterSpacing: ".08em",

      cursor: "pointer",

      boxShadow:
        "0 8px 28px rgba(0,0,0,.18)",

      backdropFilter: "blur(12px)"
    });


    enterStreet.onclick = () => {
      if (control.mode === "model") {
        control.mode = "corner";
        control.targetCornerProgress = 1;

        enterStreet.innerHTML = `
          <span style="font-size:16px;margin-right:7px;">⌂</span>
          返回模型
        `;
      } else {
        control.mode = "model";
        control.targetCornerProgress = 0;

        control.targetYaw = -0.72;
        control.targetPitch = 0.58;
        control.targetDistance = 34;

        enterStreet.innerHTML = `
          <span style="font-size:16px;margin-right:7px;">↗</span>
          走進喜帖街
        `;
      }
    };

    overlay.appendChild(enterStreet);

    document.body.appendChild(overlay);
  }


  // ============================================================
  // SCENE
  // ============================================================

  function buildScene() {
    scene = new THREE.Scene();

    scene.background =
      new THREE.Color(C.bg);

    scene.fog =
      new THREE.Fog(C.bg, 55, 100);


    const aspect =
      innerWidth / innerHeight;

    const view = 30;


    camera =
      new THREE.OrthographicCamera(
        (-view * aspect) / 2,
        (view * aspect) / 2,
        view / 2,
        -view / 2,
        0.1,
        300
      );


    renderer =
      new THREE.WebGLRenderer({
        antialias: true
      });

    renderer.setPixelRatio(
      Math.min(devicePixelRatio, 1.6)
    );

    renderer.setSize(
      innerWidth,
      innerHeight
    );

    renderer.shadowMap.enabled = true;

    renderer.shadowMap.type =
      THREE.PCFSoftShadowMap;

    renderer.outputEncoding =
      THREE.sRGBEncoding;

    renderer.toneMapping =
      THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure = 0.82;

    overlay.appendChild(
      renderer.domElement
    );


    const hemi =
      new THREE.HemisphereLight(
        0xece6da,
        0x82786b,
        0.82
      );

    scene.add(hemi);


    const sun =
      new THREE.DirectionalLight(
        0xffe4c4,
        1.18
      );

    sun.position.set(
      -11,
      20,
      14
    );

    sun.castShadow = true;

    sun.shadow.mapSize.set(
      2048,
      2048
    );

    sun.shadow.camera.left = -30;
    sun.shadow.camera.right = 30;
    sun.shadow.camera.top = 30;
    sun.shadow.camera.bottom = -30;

    scene.add(sun);


    stage = new THREE.Group();

    scene.add(stage);


    createBase();
    createStreet();

    createBuildings();
    createSideWallDetails();
    //createBlankSideWallWeathering();
    //createSigns();
    //createDenseSignForest();
    createVisualLandmarks();
    //createSignSupportFrames();
    enhanceRightEntranceCalendarBuilding();

    createWallText();
    createPaintedWallAds();
    createEntranceWallAds();
    enhanceWaiHingBuilding();
    createEntranceEndWindows();
    createOverheadWires();

    createStreetFurniture();
    //createStreetClutter();


    bindControls();

    updateCamera(true);

    window.addEventListener(
      "resize",
      resize
    );
  }


  // ============================================================
  // BASE
  // ============================================================

  function createBase() {
    box(
      38,
      2.0,
      29,
      mat(C.base),
      0,
      -1,
      0
    );

    box(
      37.4,
      0.30,
      28.4,
      mat(C.baseTop),
      0,
      0.15,
      0
    );
  }

  function createRoadSurface(left, right, material) {
    const shape = new THREE.Shape();

    shape.moveTo(left[0][0], left[0][1]);

    for (let i = 1; i < left.length; i++) {
      shape.lineTo(left[i][0], left[i][1]);
    }

    for (let i = right.length - 1; i >= 0; i--) {
      shape.lineTo(right[i][0], right[i][1]);
    }

    shape.closePath();

    const geometry = new THREE.ShapeGeometry(shape);

    const mesh = new THREE.Mesh(
      geometry,
      material
    );

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = 0.44;

    mesh.receiveShadow = true;

    stage.add(mesh);
  }


  function createEdgeStrip(points, width, side, material) {
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];

      const dx = b[0] - a[0];
      const dz = b[1] - a[1];

      const length = Math.hypot(dx, dz);

      const nx = -dz / length;
      const nz = dx / length;

      const direction =
        side === "left" ? 1 : -1;

      const x =
        (a[0] + b[0]) / 2 +
        nx * width * 0.5 * direction;

      const z =
        (a[1] + b[1]) / 2 +
        nz * width * 0.5 * direction;

      const piece = box(
        width,
        0.20,
        length + 0.08,
        material,
        x,
        0.53,
        z
      );

      piece.rotation.y =
        Math.atan2(dx, dz);
    }
  }


  function createRoadLine(points, width, material, offset = 0) {
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];

      const dx = b[0] - a[0];
      const dz = b[1] - a[1];

      const length = Math.hypot(dx, dz);

      const piece = box(
        width,
        0.025,
        length,
        material,
        (a[0] + b[0]) / 2,
        0.565,
        (a[1] + b[1]) / 2
      );

      piece.rotation.y =
        Math.atan2(dx, dz);

      if (offset !== 0) {
        const nx = -dz / length;
        const nz = dx / length;

        piece.position.x += nx * offset;
        piece.position.z += nz * offset;
      }
    }
  }


  const LEFT_ROAD = [
    [-4.00, -13.0],
    [-4.00, -11.0],
    [-4.00, -9.0],
    [-4.00, -7.0],
    [-4.00, -5.0],
    [-4.00, -3.0],
    [-4.18, -1.5],
    [-4.45, 0.0],
    [-4.78, 1.5],
    [-5.15, 3.0],
    [-5.60, 4.5],
    [-6.00, 5.8],
    [-6.40, 7.0],
    [-7.00, 8.5],
    [-7.55, 10.0]
  ];

  const RIGHT_ROAD = [
    [4.00, -13.0],
    [4.00, -11.0],
    [4.00, -9.0],
    [4.00, -7.0],
    [4.00, -5.0],
    [4.00, -3.0],
    [4.45, -1.5],
    [5.15, 0.0],
    [6.05, 1.5],
    [6.95, 3.0],
    [7.95, 4.5],
    [8.90, 5.8],
    [9.80, 7.0],
    [10.90, 8.5],
    [11.80, 10.0]
  ];

  const STREET_Z_FRONT = -13.0;
  const STREET_Z_BACK = 10.0;

  // ============================================================
  // STREET
  // ============================================================
  function createStreet() {

    // ============================================================
    // ROAD MATERIALS
    // ============================================================

    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x414441,
      roughness: 0.98,
      metalness: 0.0,
      side: THREE.DoubleSide
    });

    const pavementMat = new THREE.MeshStandardMaterial({
      color: 0x9f9688,
      roughness: 1.0,
      side: THREE.DoubleSide
    });

    const curbMat = new THREE.MeshStandardMaterial({
      color: 0xb7ad9e,
      roughness: 1.0
    });

    const yellowMat = new THREE.MeshStandardMaterial({
      color: 0xc3a23b,
      roughness: 0.88
    });


    const streetProfile = [

      // 前方
      [-13.0, -4.00, 4.00],
      [-11.0, -4.00, 4.00],
      [-9.0, -4.00, 4.00],
      [-7.0, -4.00, 4.00],
      [-5.0, -4.00, 4.00],

      // 開始進入彎位
      [-3.0, -4.00, 4.00],
      [-1.5, -4.18, 4.45],
      [0.0, -4.45, 5.15],
      [1.5, -4.78, 6.05],
      [3.0, -5.15, 6.95],
      [4.5, -5.60, 7.95],
      [5.8, -6.00, 8.90],
      [7.0, -6.40, 9.80],
      [8.5, -7.00, 10.90],
      [10.0, -7.55, 11.80]

    ];


    // ============================================================
    // HELPERS
    // ============================================================

    function addQuad(
      a,
      b,
      c,
      d,
      material,
      y
    ) {

      const vertices = new Float32Array([

        a[0], y, a[1],
        b[0], y, b[1],
        c[0], y, c[1],

        b[0], y, b[1],
        d[0], y, d[1],
        c[0], y, c[1]

      ]);

      const geometry = new THREE.BufferGeometry();

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
          vertices,
          3
        )
      );

      geometry.computeVertexNormals();

      const mesh = new THREE.Mesh(
        geometry,
        material
      );

      mesh.receiveShadow = true;

      stage.add(mesh);

      return mesh;
    }


    function segmentNormal(a, b) {

      const dx = b[0] - a[0];
      const dz = b[1] - a[1];

      const length =
        Math.sqrt(
          dx * dx +
          dz * dz
        ) || 1;

      return {
        x: -dz / length,
        z: dx / length
      };
    }


    function offsetPoint(
      point,
      normal,
      amount
    ) {

      return [
        point[0] + normal.x * amount,
        point[1] + normal.z * amount
      ];
    }


    function addStripSegment(
      a,
      b,
      width,
      material,
      y
    ) {

      const dx = b[0] - a[0];
      const dz = b[1] - a[1];

      const length =
        Math.sqrt(
          dx * dx +
          dz * dz
        );

      if (length < 0.001) return;

      const strip = new THREE.Mesh(

        new THREE.BoxGeometry(
          width,
          0.025,
          length + 0.035
        ),

        material
      );

      strip.position.set(
        (a[0] + b[0]) / 2,
        y,
        (a[1] + b[1]) / 2
      );

      strip.rotation.y =
        Math.atan2(
          dx,
          dz
        );

      strip.receiveShadow = true;

      stage.add(strip);
    }


    // ============================================================
    // 2. BUILD ROAD
    // ============================================================

    for (
      let i = 0;
      i < streetProfile.length - 1;
      i++
    ) {

      const current =
        streetProfile[i];

      const next =
        streetProfile[i + 1];


      const leftA = [
        current[1],
        current[0]
      ];

      const rightA = [
        current[2],
        current[0]
      ];

      const leftB = [
        next[1],
        next[0]
      ];

      const rightB = [
        next[2],
        next[0]
      ];


      addQuad(
        leftA,
        rightA,
        leftB,
        rightB,
        roadMat,
        0.48
      );
    }


    // ============================================================
    // 3. SIDEWALKS
    //
    // 人行道直接從馬路邊界向外生成。
    // 所以馬路和人行道一定貼合。
    // ============================================================

    const pavementWidth = 1.18;

    for (
      let i = 0;
      i < streetProfile.length - 1;
      i++
    ) {

      const current =
        streetProfile[i];

      const next =
        streetProfile[i + 1];


      const leftA = [
        current[1],
        current[0]
      ];

      const leftB = [
        next[1],
        next[0]
      ];

      const rightA = [
        current[2],
        current[0]
      ];

      const rightB = [
        next[2],
        next[0]
      ];


      // ---------- LEFT SIDE ----------

      const leftNormal =
        segmentNormal(
          leftA,
          leftB
        );

      // 對左側道路，外側是 normal 的正方向
      const leftOuterA =
        offsetPoint(
          leftA,
          leftNormal,
          pavementWidth
        );

      const leftOuterB =
        offsetPoint(
          leftB,
          leftNormal,
          pavementWidth
        );


      addQuad(
        leftOuterA,
        leftA,
        leftOuterB,
        leftB,
        pavementMat,
        0.51
      );


      // ---------- RIGHT SIDE ----------

      const rightNormal =
        segmentNormal(
          rightA,
          rightB
        );

      // 右側需要反方向
      const rightOuterA =
        offsetPoint(
          rightA,
          rightNormal,
          -pavementWidth
        );

      const rightOuterB =
        offsetPoint(
          rightB,
          rightNormal,
          -pavementWidth
        );


      addQuad(
        rightA,
        rightOuterA,
        rightB,
        rightOuterB,
        pavementMat,
        0.51
      );
    }


    // ============================================================
    // 4. CURBS
    // ============================================================

    for (
      let i = 0;
      i < streetProfile.length - 1;
      i++
    ) {

      const current =
        streetProfile[i];

      const next =
        streetProfile[i + 1];


      const leftA = [
        current[1],
        current[0]
      ];

      const leftB = [
        next[1],
        next[0]
      ];

      const rightA = [
        current[2],
        current[0]
      ];

      const rightB = [
        next[2],
        next[0]
      ];


      addStripSegment(
        leftA,
        leftB,
        0.13,
        curbMat,
        0.545
      );


      addStripSegment(
        rightA,
        rightB,
        0.13,
        curbMat,
        0.545
      );
    }


    // ============================================================
    // 5. DOUBLE YELLOW LINES
    //
    // 這次不是用固定 x。
    // 每一段都從「真正的馬路邊界」向馬路內側移動。
    // ============================================================

    const yellowOuterInset = 0.22;
    const yellowInnerInset = 0.39;


    function moveToward(
      edge,
      opposite,
      distance
    ) {

      const dx =
        opposite[0] - edge[0];

      const dz =
        opposite[1] - edge[1];

      const length =
        Math.sqrt(
          dx * dx +
          dz * dz
        ) || 1;

      return [

        edge[0] +
        (dx / length) *
        distance,

        edge[1] +
        (dz / length) *
        distance

      ];
    }


    for (
      let i = 0;
      i < streetProfile.length - 1;
      i++
    ) {

      const current =
        streetProfile[i];

      const next =
        streetProfile[i + 1];


      const leftA = [
        current[1],
        current[0]
      ];

      const rightA = [
        current[2],
        current[0]
      ];

      const leftB = [
        next[1],
        next[0]
      ];

      const rightB = [
        next[2],
        next[0]
      ];


      // ========================================================
      // LEFT DOUBLE YELLOW
      // ========================================================

      const leftOuterA =
        moveToward(
          leftA,
          rightA,
          yellowOuterInset
        );

      const leftOuterB =
        moveToward(
          leftB,
          rightB,
          yellowOuterInset
        );


      const leftInnerA =
        moveToward(
          leftA,
          rightA,
          yellowInnerInset
        );

      const leftInnerB =
        moveToward(
          leftB,
          rightB,
          yellowInnerInset
        );


      addStripSegment(
        leftOuterA,
        leftOuterB,
        0.075,
        yellowMat,
        0.575
      );


      addStripSegment(
        leftInnerA,
        leftInnerB,
        0.075,
        yellowMat,
        0.575
      );


      // ========================================================
      // RIGHT DOUBLE YELLOW
      // ========================================================

      const rightOuterA =
        moveToward(
          rightA,
          leftA,
          yellowOuterInset
        );

      const rightOuterB =
        moveToward(
          rightB,
          leftB,
          yellowOuterInset
        );


      const rightInnerA =
        moveToward(
          rightA,
          leftA,
          yellowInnerInset
        );

      const rightInnerB =
        moveToward(
          rightB,
          leftB,
          yellowInnerInset
        );


      addStripSegment(
        rightOuterA,
        rightOuterB,
        0.075,
        yellowMat,
        0.575
      );


      addStripSegment(
        rightInnerA,
        rightInnerB,
        0.075,
        yellowMat,
        0.575
      );
    }


    const patchMaterial =
      new THREE.MeshStandardMaterial({

        color: 0x353836,

        roughness: 1,

        transparent: true,

        opacity: 0.22,

        depthWrite: false,

        side: THREE.DoubleSide

      });


    const patches = [

      {
        x: -0.45,
        z: -8.0,
        w: 1.15,
        d: 2.8,
        r: 0.04
      },

      {
        x: 0.35,
        z: -3.2,
        w: 0.75,
        d: 1.9,
        r: -0.05
      },

      {
        x: 1.2,
        z: 1.2,
        w: 0.85,
        d: 2.0,
        r: -0.10
      }

    ];


    patches.forEach((p) => {

      const patch =
        new THREE.Mesh(

          new THREE.PlaneGeometry(
            p.w,
            p.d
          ),

          patchMaterial

        );


      patch.rotation.x =
        -Math.PI / 2;

      patch.rotation.z =
        p.r;


      patch.position.set(
        p.x,
        0.585,
        p.z
      );


      stage.add(patch);

    });

  }

  function createCurvedRoad() {

    const segments = 70;

    const vertices = [];
    const indices = [];


    for (let i = 0; i <= segments; i++) {

      const t = i / segments;

      const z =
        THREE.MathUtils.lerp(
          STREET_Z_FRONT,
          STREET_Z_BACK,
          t
        );


      const left =
        getRoadPose(
          "left",
          z
        );


      const right =
        getRoadPose(
          "right",
          z
        );


      if (!left || !right) continue;


      vertices.push(
        left.x,
        0.535,
        z
      );


      vertices.push(
        right.x,
        0.535,
        z
      );

    }


    for (let i = 0; i < segments; i++) {

      const a = i * 2;
      const b = a + 1;
      const c = a + 2;
      const d = a + 3;


      indices.push(
        a, b, c,
        b, d, c
      );

    }


    const geometry =
      new THREE.BufferGeometry();


    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        vertices,
        3
      )
    );


    geometry.setIndex(indices);

    geometry.computeVertexNormals();


    const material =
      new THREE.MeshStandardMaterial({

        color: C.road,

        roughness: 0.96,

        metalness: 0.0

      });


    const road =
      new THREE.Mesh(
        geometry,
        material
      );


    road.receiveShadow = true;

    stage.add(road);
  }

  function createCurvedSidewalk(side) {

    const segments = 70;

    const width = 1.35;

    const vertices = [];
    const indices = [];


    for (let i = 0; i <= segments; i++) {

      const t = i / segments;

      const z =
        THREE.MathUtils.lerp(
          STREET_Z_FRONT,
          STREET_Z_BACK,
          t
        );


      const pose =
        getRoadPose(
          side,
          z
        );


      if (!pose) continue;


      const outward =
        side === "left"
          ? -1
          : 1;


      const innerX =
        pose.x;


      const outerX =
        pose.x +
        outward * width;


      vertices.push(
        innerX,
        0.565,
        z
      );


      vertices.push(
        outerX,
        0.565,
        z
      );

    }


    for (let i = 0; i < segments; i++) {

      const a = i * 2;
      const b = a + 1;
      const c = a + 2;
      const d = a + 3;


      indices.push(
        a, c, b,
        b, c, d
      );

    }


    const geometry =
      new THREE.BufferGeometry();


    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        vertices,
        3
      )
    );


    geometry.setIndex(indices);

    geometry.computeVertexNormals();


    const material =
      new THREE.MeshStandardMaterial({

        color: 0xb2a898,

        roughness: 1

      });


    const pavement =
      new THREE.Mesh(
        geometry,
        material
      );


    pavement.receiveShadow = true;

    stage.add(pavement);
  }

  // ============================================================
  // HISTORICAL LEE TUNG STREET — BUILDING MASSING
  // ============================================================

  const LEFT_BUILDINGS = [

    // 前景第一栋：较矮、较宽，形成图二左前角
    {
      z: -9.65,
      d: 3.85,
      depth: 3.55,
      h: 8.65,
      floors: 4,
      setback: 0.02,
      roofType: 0,
      color: 0x9b805e,
      shop: C.darkRed
    },

    // 第二栋略高、略后退
    {
      z: -6.15,
      d: 3.25,
      depth: 3.15,
      h: 9.75,
      floors: 4,
      setback: 0.18,
      roofType: 1,
      color: 0x8c887e,
      shop: C.darkGreen
    },

    // 窄楼
    {
      z: -3.25,
      d: 2.55,
      depth: 3.35,
      h: 10.55,
      floors: 5,
      setback: -0.05,
      roofType: 2,
      color: 0x71857b,
      shop: C.darkRed
    },

    // 中段粉灰旧楼，突出一点
    {
      z: -0.55,
      d: 3.05,
      depth: 3.45,
      h: 11.35,
      floors: 5,
      setback: -0.18,
      roofType: 0,
      color: 0x916b65,
      shop: C.darkGreen
    },

    // 后段较窄、较高
    {
      z: 2.15,
      d: 2.55,
      depth: 3.20,
      h: 10.75,
      floors: 5,
      setback: 0.10,
      roofType: 1,
      color: 0x77766e,
      shop: C.darkRed
    },

    // 高楼形成后方层次
    {
      z: 4.75,
      d: 2.85,
      depth: 3.55,
      h: 12.20,
      floors: 5,
      setback: 0.26,
      roofType: 2,
      color: 0x9b805f,
      shop: C.darkGreen
    },

    // 最里面不要跟上一栋同高度
    {
      z: 7.35,
      d: 2.45,
      depth: 3.20,
      h: 11.05,
      floors: 5,
      setback: 0.06,
      roofType: 0,
      color: 0x886863,
      shop: C.darkRed
    },

    // 最深处再塞一栋，只露部分体量
    {
      z: 9.45,
      d: 2.20,
      depth: 3.05,
      h: 12.65,
      floors: 5,
      setback: 0.32,
      roofType: 1,
      color: 0x70776f,
      shop: C.darkGreen
    }

  ];


  const RIGHT_BUILDINGS = [

    // 右前角不要和左边镜像
    {
      z: -9.45,
      d: 3.45,
      depth: 3.45,
      h: 9.25,
      floors: 4,
      setback: 0.12,
      roofType: 1,
      color: 0x9a8063,
      shop: C.darkRed
    },

    {
      z: -6.25,
      d: 3.05,
      depth: 3.15,
      h: 10.55,
      floors: 5,
      setback: -0.08,
      roofType: 0,
      color: 0x7f7a70,
      shop: C.darkGreen
    },

    // 窄而高
    {
      z: -3.55,
      d: 2.45,
      depth: 3.30,
      h: 11.35,
      floors: 5,
      setback: 0.20,
      roofType: 2,
      color: 0x6d8178,
      shop: C.darkRed
    },

    // 奶黄色较宽楼
    {
      z: -0.75,
      d: 3.25,
      depth: 3.55,
      h: 10.05,
      floors: 4,
      setback: -0.16,
      roofType: 1,
      color: 0x9d8b68,
      shop: C.darkGreen
    },

    // 粉色窄楼
    {
      z: 2.05,
      d: 2.35,
      depth: 3.15,
      h: 9.45,
      floors: 4,
      setback: 0.08,
      roofType: 0,
      color: 0x906962,
      shop: C.darkRed
    },

    // 后面明显抬高
    {
      z: 4.55,
      d: 2.80,
      depth: 3.45,
      h: 11.75,
      floors: 5,
      setback: 0.30,
      roofType: 2,
      color: 0x6d8178,
      shop: C.darkGreen
    },

    {
      z: 7.10,
      d: 2.45,
      depth: 3.10,
      h: 10.55,
      floors: 5,
      setback: -0.02,
      roofType: 0,
      color: 0x806047,
      shop: C.darkRed
    },

    // 最深处高体块
    {
      z: 9.25,
      d: 2.15,
      depth: 3.30,
      h: 12.30,
      floors: 5,
      setback: 0.34,
      roofType: 1,
      color: 0x77736b,
      shop: C.darkGreen
    }

  ];


  function getRoadPose(side, z) {
    const points = side === "left" ? LEFT_ROAD : RIGHT_ROAD;

    let best = null;
    let bestDistance = Infinity;

    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];

      const dz = b[1] - a[1];
      if (Math.abs(dz) < 0.001) continue;

      let t = (z - a[1]) / dz;
      t = THREE.MathUtils.clamp(t, 0, 1);

      const px = THREE.MathUtils.lerp(a[0], b[0], t);
      const pz = THREE.MathUtils.lerp(a[1], b[1], t);

      const distance = Math.abs(pz - z);

      if (distance < bestDistance) {
        bestDistance = distance;

        best = {
          x: px,
          z: pz,
          angle: Math.atan2(
            b[0] - a[0],
            b[1] - a[1]
          )
        };
      }
    }

    return best;
  }


  function createBuildings() {
    const leftColours = [
      0xb59a79, // 左前：舊黃褐
      0xa5a196, // 灰米
      0x87988d, // 灰綠
      0xa07f79, // 褪色粉紅
      0x898b82,
      0xa88b72,
      0xa18b7d,
      0xb2987b
    ];

    const rightColours = [
      0xb19a7e, // 右前：灰黃
      0xa19d91,
      0x8d9f91,
      0xb2a083,
      0xa18177,
      0x8fa194,
      0xa29078,
      0xb7a78b
    ];

    LEFT_BUILDINGS.forEach((data, index) => {
      data.color = leftColours[index];
      createOldBuilding(data, "left", index);
    });

    RIGHT_BUILDINGS.forEach((data, index) => {
      data.color = rightColours[index];
      createOldBuilding(data, "right", index);
    });
  }

  // ============================================================
  // OLD HONG KONG FACADE CLUTTER
  // ============================================================

  function createFacadeClutter(
    g,
    facadeX,
    data,
    side,
    index
  ) {

    const dir =
      side === "left" ? 1 : -1;

    const metalMat =
      new THREE.MeshStandardMaterial({
        color: 0x4a4d48,
        roughness: 0.95,
        metalness: 0.12
      });

    const darkMetalMat =
      new THREE.MeshStandardMaterial({
        color: 0x343733,
        roughness: 0.96
      });

    const oldWhiteMat =
      new THREE.MeshStandardMaterial({
        color: 0xaaa79c,
        roughness: 0.94
      });


    // ============================================================
    // 1. MORE DRAIN PIPES
    // ============================================================

    const pipeCount =
      index % 3 === 0 ? 2 : 1;

    for (let i = 0; i < pipeCount; i++) {

      const pipe =
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            0.045,
            0.045,
            data.h * 0.70,
            8
          ),
          metalMat
        );

      pipe.position.set(
        facadeX + dir * 0.08,
        1.3 + data.h * 0.35,
        -data.d * 0.38 +
        i * data.d * 0.68
      );

      g.add(pipe);
    }


    // ============================================================
    // 2. EXTRA AIR CONDITIONERS
    // ============================================================

    const acCount =
      index % 4 === 0
        ? 3
        : index % 3 === 0
          ? 2
          : 1;

    for (let i = 0; i < acCount; i++) {

      const floorY =
        4.0 +
        i * 1.65;

      const z =
        -data.d * 0.28 +
        ((index + i) % 3) *
        data.d * 0.28;


      // AC BODY
      box(
        0.42,
        0.34,
        0.55,
        oldWhiteMat,

        facadeX +
        dir * 0.31,

        floorY,

        z,

        g
      );


      // DARK FRONT
      box(
        0.04,
        0.23,
        0.40,
        darkMetalMat,

        facadeX +
        dir * 0.535,

        floorY,

        z,

        g
      );


      // SUPPORT
      box(
        0.34,
        0.035,
        0.05,
        metalMat,

        facadeX +
        dir * 0.22,

        floorY - 0.24,

        z - 0.17,

        g
      );

      box(
        0.34,
        0.035,
        0.05,
        metalMat,

        facadeX +
        dir * 0.22,

        floorY - 0.24,

        z + 0.17,

        g
      );
    }


    // ============================================================
    // 3. RANDOM EXPOSED CABLES
    // ============================================================

    for (let i = 0; i < 3; i++) {

      const cable =
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            0.014,
            0.014,
            1.2 + i * 0.35,
            6
          ),
          darkMetalMat
        );

      cable.position.set(
        facadeX + dir * 0.12,
        3.0 + i * 1.45,
        -data.d * 0.30 +
        i * data.d * 0.27
      );

      cable.rotation.z =
        0.10 * dir;

      g.add(cable);
    }


    // ============================================================
    // 4. OLD AWNING / METAL CANOPY
    // ============================================================

    if (index % 2 === 0) {

      const awningMat =
        new THREE.MeshStandardMaterial({
          color:
            index % 4 === 0
              ? 0x596b62
              : 0x765448,
          roughness: 0.98
        });

      const awning =
        box(
          1.0,
          0.09,
          data.d * 0.62,
          awningMat,

          facadeX +
          dir * 0.58,

          2.75,

          0,

          g
        );

      awning.rotation.z =
        dir * -0.10;
    }


    // ============================================================
    // 5. EXTERNAL METAL CAGE
    // ============================================================

    if (
      index === 0 ||
      index === 2 ||
      index === 5
    ) {

      const cageY =
        5.3 +
        (index % 2) * 1.2;

      const cageZ =
        index % 2 === 0
          ? -data.d * 0.20
          : data.d * 0.20;


      // vertical bars
      for (let i = -2; i <= 2; i++) {

        box(
          0.025,
          1.25,
          0.025,
          metalMat,

          facadeX +
          dir * 0.30,

          cageY,

          cageZ +
          i * 0.17,

          g
        );
      }


      // horizontal bars
      for (let i = -1; i <= 1; i++) {

        box(
          0.025,
          0.025,
          0.85,
          metalMat,

          facadeX +
          dir * 0.30,

          cageY +
          i * 0.45,

          cageZ,

          g
        );
      }


      // cage protrusion
      box(
        0.42,
        0.035,
        0.88,
        metalMat,

        facadeX +
        dir * 0.22,

        cageY - 0.64,

        cageZ,

        g
      );
    }
  }

  // ============================================================
  // OLD SIDE WALL DETAILS
  // ============================================================
  function createSideWallDetails() {
    createEntranceSideWall(
      LEFT_BUILDINGS[0],
      "left"
    );

    createEntranceSideWall(
      RIGHT_BUILDINGS[0],
      "right"
    );
  }

  function createEntranceSideWall(building, side) {
    if (!building || !building._group) return;

    const g = building._group;

    const wallZ =
      -building.d / 2 - 0.035;

    const sideWidth =
      building.depth || 3.3;

    const darkMetal = mat(0x343834, 0.98);
    const oldMetal = mat(0x55584f, 0.98);
    const oldAC = mat(0x8e8a7d, 0.96);

    const pipeX =
      side === "left"
        ? -sideWidth * 0.36
        : sideWidth * 0.36;

    cylinder(
      0.052,
      building.h * 0.78,
      oldMetal,
      pipeX,
      0.75 + building.h * 0.39,
      wallZ - 0.03,
      g
    );

    const windowXs =
      side === "left"
        ? [-0.95, -0.25, 0.48]
        : [-0.48, 0.25, 0.95];

    const floorYs = [
      4.05,
      5.65,
      7.25
    ];

    floorYs.forEach((y, floor) => {
      windowXs.forEach((x, bay) => {
        const seed =
          floor * 7 + bay * 11 +
          (side === "left" ? 3 : 17);

        if (seed % 5 === 0) return;

        createSideOldWindow(
          g,
          x,
          y,
          wallZ,
          seed
        );

        if (
          seed % 4 === 1 ||
          seed % 7 === 2
        ) {
          createSideWindowCage(
            g,
            x,
            y,
            wallZ - 0.13,
            seed
          );
        }

        if (
          seed % 6 === 2
        ) {
          const acX =
            x + 0.34;

          box(
            0.44,
            0.31,
            0.36,
            oldAC,
            acX,
            y - 0.43,
            wallZ - 0.22,
            g
          );

          box(
            0.30,
            0.20,
            0.025,
            darkMetal,
            acX,
            y - 0.43,
            wallZ - 0.425,
            g
          );
        }
      });
    });

    createSideWallStains(
      g,
      building,
      wallZ,
      side
    );
  }

  function createSideOldWindow(
    g,
    x,
    y,
    wallZ,
    seed
  ) {
    const width =
      0.46 + (seed % 3) * 0.06;

    const height =
      0.76 + (seed % 2) * 0.10;

    box(
      width + 0.13,
      height + 0.14,
      0.055,
      mat(0x68675f, 0.98),
      x,
      y,
      wallZ - 0.025,
      g
    );

    box(
      width,
      height,
      0.035,
      mat(
        seed % 2 === 0
          ? 0x3c4946
          : 0x46514d,
        0.90
      ),
      x,
      y,
      wallZ - 0.065,
      g
    );

    box(
      width + 0.20,
      0.075,
      0.18,
      mat(0x777064, 0.98),
      x,
      y - height / 2 - 0.10,
      wallZ - 0.04,
      g
    );
  }

  function createSideWindowCage(
    g,
    x,
    y,
    wallZ,
    seed
  ) {
    const metal = mat(
      seed % 2 === 0
        ? 0x343733
        : 0x484943,
      0.98
    );

    const width =
      0.58 + (seed % 3) * 0.05;

    const height =
      0.92 + (seed % 2) * 0.08;

    const depth =
      0.24 + (seed % 2) * 0.05;

    for (let i = -2; i <= 2; i++) {
      box(
        0.022,
        height,
        depth,
        metal,
        x + i * width / 4,
        y,
        wallZ,
        g
      );
    }

    for (let i = -1; i <= 1; i++) {
      box(
        width,
        0.022,
        depth,
        metal,
        x,
        y + i * height / 2,
        wallZ,
        g
      );
    }

    box(
      width,
      0.025,
      depth + 0.05,
      metal,
      x,
      y - height / 2,
      wallZ,
      g
    );

    box(
      width,
      0.025,
      depth + 0.05,
      metal,
      x,
      y + height / 2,
      wallZ,
      g
    );
  }


  function createSideWallStains(
    g,
    building,
    wallZ,
    side
  ) {
    const stains = [
      {
        x: -0.82,
        y: 6.55,
        w: 0.18,
        h: 2.2,
        c: 0x4e4a42,
        o: 0.12
      },
      {
        x: 0.62,
        y: 4.85,
        w: 0.27,
        h: 1.45,
        c: 0x655d50,
        o: 0.10
      },
      {
        x: -0.12,
        y: 7.15,
        w: 0.42,
        h: 0.72,
        c: 0x9b8d75,
        o: 0.16
      }
    ];

    stains.forEach((s, i) => {
      const material =
        new THREE.MeshBasicMaterial({
          color: s.c,
          transparent: true,
          opacity: s.o,
          depthWrite: false,
          side: THREE.DoubleSide
        });

      const patch =
        new THREE.Mesh(
          new THREE.PlaneGeometry(
            s.w,
            s.h
          ),
          material
        );

      patch.position.set(
        side === "left"
          ? s.x
          : -s.x,
        s.y,
        wallZ - 0.075
      );

      g.add(patch);
    });
  }

  function createPaintedWallAds() {
    createWallAd(
      LEFT_BUILDINGS[2],
      "柯式印刷",
      0.35,
      7.1,
      0.40,
      "#665244"
    );

    createWallAd(
      RIGHT_BUILDINGS[3],
      "紙品月曆",
      -0.30,
      7.0,
      0.36,
      "#625445"
    );
  }

  function createEntranceWallAds() {
    const entranceLeft =
      LEFT_BUILDINGS[LEFT_BUILDINGS.length - 1];

    if (!entranceLeft || !entranceLeft._group) return;

    createEntranceEndWallText(
      entranceLeft,
      "萬\n興\n紙\n業",
      -1.58,   // 往牆中間偏右一點
      9,    // 再往上提
      1.5,    // 再放大
      "#7b4338"
    );
  }

  function enhanceWaiHingBuilding() {
    const b =
      LEFT_BUILDINGS[LEFT_BUILDINGS.length - 1];

    if (!b || !b._group) return;

    const g = b._group;
    const wallZ = b.d / 2 + 0.035;

    const windowXs = [-2.26, -1.56];
    const windowYs = [4.95, 3.65];

    windowYs.forEach((yy, row) => {
      windowXs.forEach((xx, col) => {
        createWaiHingWindow(
          g,
          xx,
          yy,
          wallZ,
          (row + col) % 2 === 0
        );
      });
    });

    createWaiHingDrainPipe(
      g,
      -0.42,
      4.10,
      wallZ + 0.02
    );
    createWallAC(g, -0.70, 4.70, wallZ + 0.07);
    createWallAC(g, -0.67, 3.38, wallZ + 0.07);
    createDakSangShop(g, b, wallZ + 0.03);

  }

  function createWaiHingWindow(
    g,
    x,
    y,
    wallZ,
    withAC = false
  ) {
    // 外框
    box(
      0.56,
      0.82,
      0.06,
      mat(0x31403d, 0.98),
      x,
      y,
      wallZ,
      g
    );

    // 左右窗扇
    box(
      0.19,
      0.58,
      0.035,
      mat(0x202928, 1),
      x - 0.12,
      y,
      wallZ + 0.035,
      g
    );

    box(
      0.19,
      0.58,
      0.035,
      mat(0x202928, 1),
      x + 0.12,
      y,
      wallZ + 0.035,
      g
    );

    // 中間縫
    box(
      0.038,
      0.62,
      0.03,
      mat(0x586862, 1),
      x,
      y,
      wallZ + 0.032,
      g
    );

    // 窗台
    box(
      0.66,
      0.06,
      0.08,
      mat(0xbfb4a1, 0.98),
      x,
      y - 0.46,
      wallZ + 0.03,
      g
    );

    if (withAC) {
      createWallAC(g, x + 0.36, y - 0.10, wallZ + 0.06);
    }
  }

  function createWaiHingDrainPipe(
    g,
    x,
    y,
    z
  ) {
    // 主直管
    box(
      0.055,
      6.75,
      0.055,
      mat(0x7d7a73, 0.98),
      x,
      3.65,
      z,
      g
    );

    // 上下固定卡
    [5.9, 4.7, 3.5, 2.3, 1.2].forEach((yy) => {
      box(
        0.13,
        0.04,
        0.09,
        mat(0x9c9588, 1),
        x - 0.03,
        yy,
        z - 0.01,
        g
      );
    });
  }

  function createSideWallBladeSign({
    g,
    wallZ,
    x,
    y,
    text,
    bg = "#e4d2a9",
    fg = "#952f29",
    width = 1.6,
    height = 0.46,
    depth = 0.12,
    vertical = false,
    smallText = ""
  }) {
    const faceDir = wallZ >= 0 ? 1 : -1;

    const tex = makeSignTexture(
      text,
      bg,
      fg,
      vertical,
      smallText
    );

    const faceMat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.97,
      metalness: 0.0
    });

    const edgeMat = mat(0x423930, 0.98);

    const board = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      [
        edgeMat,
        edgeMat,
        edgeMat,
        edgeMat,
        faceMat,
        faceMat
      ]
    );

    board.position.set(
      x,
      y,
      wallZ + faceDir * (depth / 2 + 0.02)
    );

    board.castShadow = true;
    board.receiveShadow = true;
    g.add(board);

    const rodMat = mat(0x3c3c38, 0.98);

    // 靠墙竖杆
    box(
      0.04,
      height + 0.10,
      0.04,
      rodMat,
      x - width / 2 + 0.08,
      y,
      wallZ + faceDir * 0.03,
      g
    );

    // 两条伸出支架
    box(
      0.04,
      0.04,
      0.22,
      rodMat,
      x - width * 0.25,
      y + height * 0.28,
      wallZ + faceDir * 0.10,
      g
    );

    box(
      0.04,
      0.04,
      0.22,
      rodMat,
      x - width * 0.25,
      y - height * 0.28,
      wallZ + faceDir * 0.10,
      g
    );
  }

  function createOuterSideWindow(
    g,
    wallX,
    z,
    y,
    withAC = false
  ) {
    const frameMat = mat(0x56605d, 0.98);
    const glassMat = mat(0x3d4a47, 0.98);
    const barMat = mat(0x7d7f79, 1);

    // 外框
    box(
      0.05,
      0.86,
      0.52,
      frameMat,
      wallX - 0.03,
      y,
      z,
      g
    );

    // 玻璃
    box(
      0.022,
      0.70,
      0.40,
      glassMat,
      wallX - 0.06,
      y,
      z,
      g
    );

    // 竖框
    box(
      0.02,
      0.72,
      0.03,
      barMat,
      wallX - 0.075,
      y,
      z,
      g
    );

    // 横框
    box(
      0.02,
      0.03,
      0.40,
      barMat,
      wallX - 0.075,
      y,
      z,
      g
    );

    // 两根栏杆
    box(
      0.02,
      0.80,
      0.02,
      barMat,
      wallX - 0.095,
      y,
      z - 0.14,
      g
    );
    box(
      0.02,
      0.80,
      0.02,
      barMat,
      wallX - 0.095,
      y,
      z + 0.14,
      g
    );

    // 窗台
    box(
      0.10,
      0.06,
      0.60,
      mat(0x8b8478, 1),
      wallX - 0.055,
      y - 0.46,
      z,
      g
    );

    if (withAC) {
      box(
        0.28,
        0.22,
        0.24,
        mat(0xd7d7ce, 0.98),
        wallX - 0.16,
        y - 0.18,
        z + 0.30,
        g
      );

      box(
        0.04,
        0.11,
        0.16,
        mat(0x9a9e98, 1),
        wallX - 0.30,
        y - 0.18,
        z + 0.30,
        g
      );

      box(
        0.18,
        0.02,
        0.15,
        mat(0x8a867f, 1),
        wallX - 0.14,
        y - 0.31,
        z + 0.30,
        g
      );
    }
  }

  function createOuterWallFlatSign({
    g,
    wallX,
    z,
    y,
    text,
    bg = "#decda7",
    fg = "#963029",
    width = 1.6,
    height = 0.46,
    smallText = ""
  }) {
    const tex = makeSignTexture(
      text,
      bg,
      fg,
      false,
      smallText
    );

    const faceMat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.97,
      metalness: 0
    });

    const edgeMat = mat(0x473d34, 0.98);

    const sign = new THREE.Mesh(
      new THREE.BoxGeometry(0.10, height, width),
      [
        faceMat,
        faceMat,
        edgeMat,
        edgeMat,
        edgeMat,
        edgeMat
      ]
    );

    // 关键：现在往负 X 方向贴
    sign.position.set(
      wallX - 0.07,
      y,
      z
    );

    sign.castShadow = true;
    sign.receiveShadow = true;
    g.add(sign);
  }


  function createOuterWallProjectingSign({
    g,
    wallX,
    z,
    y,
    text,
    bg = "#d9c69d",
    fg = "#8d2e28",
    projection = 0.92,
    height = 0.46,
    vertical = false,
    smallText = ""
  }) {
    const boardHeight =
      vertical ? 1.08 : height;

    const boardProjection =
      vertical ? 0.66 : projection;

    const texture = makeSignTexture(
      text,
      bg,
      fg,
      vertical,
      smallText
    );

    const faceMat =
      new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.96
      });

    const edgeMat =
      mat(0x403a34, 0.98);

    // 牌子长度沿 X 伸出
    // 文字面朝 Z
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(
        boardProjection,
        boardHeight,
        0.10
      ),
      [
        edgeMat,
        edgeMat,
        edgeMat,
        edgeMat,
        faceMat,
        faceMat
      ]
    );

    board.position.set(
      wallX + boardProjection / 2 + 0.06,
      y,
      z
    );

    board.castShadow = true;
    board.receiveShadow = true;
    g.add(board);

    const supportMat =
      mat(0x353632, 1);

    // 上下支架
    for (const dy of [
      -boardHeight * 0.27,
      boardHeight * 0.27
    ]) {
      box(
        boardProjection * 0.92,
        0.035,
        0.035,
        supportMat,
        wallX + boardProjection * 0.46,
        y + dy,
        z,
        g
      );
    }

    // 墙面固定竖杆
    box(
      0.035,
      boardHeight + 0.12,
      0.035,
      supportMat,
      wallX + 0.03,
      y,
      z,
      g
    );
  }

  function createOuterSideWindow(
    g,
    wallX,
    z,
    y,
    withAC = false
  ) {
    const frameMat = mat(0x56605d, 0.98);
    const glassMat = mat(0x3d4a47, 0.98);
    const barMat = mat(0x7d7f79, 1);

    // 外框
    box(
      0.05,
      0.86,
      0.52,
      frameMat,
      wallX + 0.03,
      y,
      z,
      g
    );

    // 玻璃
    box(
      0.022,
      0.70,
      0.40,
      glassMat,
      wallX + 0.06,
      y,
      z,
      g
    );

    // 竖框
    box(
      0.02,
      0.72,
      0.03,
      barMat,
      wallX + 0.075,
      y,
      z,
      g
    );

    // 横框
    box(
      0.02,
      0.03,
      0.40,
      barMat,
      wallX + 0.075,
      y,
      z,
      g
    );

    // 两根栏杆
    box(
      0.02,
      0.80,
      0.02,
      barMat,
      wallX + 0.095,
      y,
      z - 0.14,
      g
    );
    box(
      0.02,
      0.80,
      0.02,
      barMat,
      wallX + 0.095,
      y,
      z + 0.14,
      g
    );

    // 窗台
    box(
      0.10,
      0.06,
      0.60,
      mat(0x8b8478, 1),
      wallX + 0.055,
      y - 0.46,
      z,
      g
    );

    if (withAC) {
      // 冷气机向外凸（X 方向）
      box(
        0.28,
        0.22,
        0.24,
        mat(0xd7d7ce, 0.98),
        wallX + 0.16,
        y - 0.18,
        z + 0.30,
        g
      );

      box(
        0.04,
        0.11,
        0.16,
        mat(0x9a9e98, 1),
        wallX + 0.30,
        y - 0.18,
        z + 0.30,
        g
      );

      box(
        0.18,
        0.02,
        0.15,
        mat(0x8a867f, 1),
        wallX + 0.14,
        y - 0.31,
        z + 0.30,
        g
      );
    }
  }

  function createOuterWallFlatSign({
    g,
    wallX,
    z,
    y,
    text,
    bg = "#decda7",
    fg = "#963029",
    width = 1.6,
    height = 0.46,
    smallText = ""
  }) {
    const tex = makeSignTexture(
      text,
      bg,
      fg,
      false,
      smallText
    );

    const faceMat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.97,
      metalness: 0
    });

    const edgeMat = mat(0x473d34, 0.98);

    // 文字面在 ±X
    const sign = new THREE.Mesh(
      new THREE.BoxGeometry(0.10, height, width),
      [
        faceMat,
        faceMat,
        edgeMat,
        edgeMat,
        edgeMat,
        edgeMat
      ]
    );

    sign.position.set(
      wallX + 0.07,
      y,
      z
    );

    sign.castShadow = true;
    sign.receiveShadow = true;
    g.add(sign);
  }

  function createOuterWallBladeSign({
    g,
    wallX,
    z,
    y,
    text,
    bg = "#e0d1aa",
    fg = "#983029",
    projection = 0.86,
    height = 0.44,
    vertical = false,
    smallText = ""
  }) {
    const boardHeight = vertical ? 1.02 : height;
    const boardLength = vertical ? 0.62 : projection;

    const tex = makeSignTexture(
      text,
      bg,
      fg,
      vertical,
      smallText
    );

    const faceMat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.97,
      metalness: 0
    });

    const edgeMat = mat(0x423930, 0.98);

    const board = new THREE.Mesh(
      new THREE.BoxGeometry(boardLength, boardHeight, 0.10),
      [
        edgeMat,
        edgeMat,
        edgeMat,
        edgeMat,
        faceMat,
        faceMat
      ]
    );

    // 关键：从 x=0 这面往左伸出去
    board.position.set(
      wallX - boardLength / 2 - 0.05,
      y,
      z
    );

    board.castShadow = true;
    board.receiveShadow = true;
    g.add(board);

    const rodMat = mat(0x393936, 1);

    // 贴墙竖杆
    box(
      0.03,
      boardHeight + 0.12,
      0.03,
      rodMat,
      wallX - 0.02,
      y,
      z,
      g
    );

    // 上下横支架
    box(
      boardLength * 0.90,
      0.03,
      0.03,
      rodMat,
      wallX - boardLength * 0.45,
      y + boardHeight * 0.28,
      z,
      g
    );

    box(
      boardLength * 0.90,
      0.03,
      0.03,
      rodMat,
      wallX - boardLength * 0.45,
      y - boardHeight * 0.28,
      z,
      g
    );
  }

  function enhanceRightEntranceCalendarBuilding() {
    const b = RIGHT_BUILDINGS[RIGHT_BUILDINGS.length - 1];
    if (!b || !b._group) return;

    const g = b._group;

    // =========================================================
    // 你要的是入口第一棟“左邊那個側面”
    // 對 RIGHT_BUILDINGS 來說，就是 x = 0 這一面
    // 所以不能用 b.depth，那是背外側
    // =========================================================
    const wallX = -0.035;

    const shopMinZ = -b.d / 2 + 0.08;
    const shopMaxZ = b.d / 2 - 0.08;
    const shopWidth = shopMaxZ - shopMinZ;
    const shopCenterZ = (shopMinZ + shopMaxZ) / 2;

    const outerFrame = 0x6a3a33;
    const innerWall = 0x8f7b67;
    const shutterDark = 0x565149;
    const shutterLine = 0x746f66;
    const canopyMain = 0x5a615c;
    const canopyEdge = 0x6f433b;
    const doorColor = 0x485451;

    // =========================================================
    // 1) 側面鋪頭（大華基金）
    // =========================================================

    // 外框
    box(
      0.12,
      2.58,
      shopWidth,
      mat(outerFrame, 0.98),
      wallX,
      1.24,
      shopCenterZ,
      g
    );

    // 內牆
    box(
      0.05,
      2.08,
      shopWidth - 0.12,
      mat(innerWall, 0.98),
      wallX - 0.07,
      1.05,
      shopCenterZ,
      g
    );

    // 左窄門 / 右鐵閘
    const sidePadding = 0.08;
    const doorWidth = 0.42;
    const gap = 0.07;
    const shutterWidth = shopWidth - sidePadding * 2 - doorWidth - gap;

    const doorZ = shopMinZ + sidePadding + doorWidth / 2;
    const shutterZ = doorZ + doorWidth / 2 + gap + shutterWidth / 2;

    // 窄門
    box(
      0.05,
      1.50,
      doorWidth,
      mat(doorColor, 1),
      wallX - 0.09,
      0.84,
      doorZ,
      g
    );

    box(
      0.03,
      1.34,
      doorWidth - 0.08,
      mat(0x96a19d, 0.98),
      wallX - 0.12,
      0.84,
      doorZ,
      g
    );

    // 大鐵閘
    box(
      0.05,
      1.42,
      shutterWidth,
      mat(shutterDark, 1),
      wallX - 0.09,
      0.82,
      shutterZ,
      g
    );

    for (let yy = 0.18; yy <= 1.34; yy += 0.11) {
      box(
        0.03,
        0.010,
        shutterWidth - 0.06,
        mat(shutterLine, 1),
        wallX - 0.115,
        yy,
        shutterZ,
        g
      );
    }

    // 鐵閘中間直條
    box(
      0.03,
      1.42,
      0.10,
      mat(0x9c8a6f, 0.96),
      wallX - 0.12,
      0.82,
      shutterZ,
      g
    );

    // 底部做舊
    box(
      0.03,
      0.05,
      shutterWidth - 0.04,
      mat(0x45413b, 1),
      wallX - 0.12,
      0.16,
      shutterZ,
      g
    );

    // 雨棚
    const canopy = box(
      0.34,
      0.055,
      shopWidth + 0.02,
      mat(canopyMain, 0.97),
      wallX - 0.16,
      1.92,
      shopCenterZ,
      g
    );
    canopy.rotation.z = 0.12;

    box(
      0.045,
      0.028,
      shopWidth + 0.02,
      mat(canopyEdge, 0.98),
      wallX - 0.31,
      1.89,
      shopCenterZ,
      g
    );

    // 主招牌
    createOuterWallFlatSign({
      g,
      wallX,
      z: shopCenterZ,
      y: 2.20,
      text: "大華基金",
      bg: "#d5c39a",
      fg: "#8d3029",
      width: shopWidth - 0.12,
      height: 0.48
    });

    // =========================================================
    // 2) 側面窗 / 冷氣
    // =========================================================
    createOuterSideWindow(g, wallX, -0.62, 3.55, false);
    createOuterSideWindow(g, wallX, 0.35, 3.62, true);
    createOuterSideWindow(g, wallX, -0.52, 4.82, true);
    createOuterSideWindow(g, wallX, 0.42, 4.95, false);
    createOuterSideWindow(g, wallX, -0.30, 6.08, false);

    // =========================================================
    // 3) 圖二那種不一樣大小 / 高低 / 顏色的招牌
    // =========================================================
    createOuterWallFlatSign({
      g,
      wallX,
      z: 0.08,
      y: 6.72,
      text: "嘉利時錶公司",
      bg: "#e1ce9f",
      fg: "#a0312a",
      width: Math.min(b.d - 0.18, 1.95),
      height: 0.54,
      smallText: "CRALY COMPANY SPORTWATCHES"
    });

    createOuterWallBladeSign({
      g,
      wallX,
      z: -0.68,
      y: 5.42,
      text: "美華地產",
      bg: "#e7dbc1",
      fg: "#8e3029",
      projection: 0.72,
      vertical: true
    });

    createOuterWallBladeSign({
      g,
      wallX,
      z: 0.66,
      y: 4.98,
      text: "大華基金",
      bg: "#cfae62",
      fg: "#812b27",
      projection: 0.80,
      vertical: true
    });

    createOuterWallBladeSign({
      g,
      wallX,
      z: 0.72,
      y: 4.00,
      text: "參茸\n海味",
      bg: "#343331",
      fg: "#b92d28",
      projection: 0.66,
      vertical: true
    });

    createOuterWallBladeSign({
      g,
      wallX,
      z: -0.62,
      y: 3.50,
      text: "紙品月曆",
      bg: "#8a2a24",
      fg: "#e5ce95",
      projection: 0.80,
      height: 0.38
    });

    createOuterWallBladeSign({
      g,
      wallX,
      z: 0.46,
      y: 3.15,
      text: "賀咭公司",
      bg: "#cfb36d",
      fg: "#7f2b26",
      projection: 0.66,
      height: 0.34
    });

    // 排水管
    box(
      0.07,
      5.8,
      0.07,
      mat(0x585c56, 1),
      wallX - 0.10,
      3.05,
      b.d / 2 - 0.14,
      g
    );

    for (const py of [1.55, 2.75, 3.95, 5.15]) {
      box(
        0.11,
        0.05,
        0.11,
        mat(0x6d7068, 1),
        wallX - 0.10,
        py,
        b.d / 2 - 0.14,
        g
      );
    }
  }

  function createWallAC(
    g,
    x,
    y,
    z
  ) {
    box(
      0.30,
      0.20,
      0.24,
      mat(0xd8d8d1, 0.98),
      x,
      y,
      z + 0.10,
      g
    );

    box(
      0.05,
      0.10,
      0.16,
      mat(0xa5a8a2, 1),
      x + 0.09,
      y,
      z + 0.16,
      g
    );

    box(
      0.20,
      0.025,
      0.16,
      mat(0x8b877e, 1),
      x,
      y - 0.13,
      z + 0.08,
      g
    );
  }

  function createDakSangShop(
    g,
    building,
    wallZ
  ) {
    const raiseY = 0.34;

    const buildingWidth = building.depth || 3.0;

    const shopLeft = -buildingWidth + 0.01;
    const shopRight = -0.01;

    const shopWidth =
      shopRight - shopLeft;

    const centerX =
      (shopLeft + shopRight) / 2;

    const sidePadding = 0.06;
    const doorWidth = 0.42;
    const gap = 0.06;

    const shutterWidth =
      shopWidth -
      sidePadding * 2 -
      doorWidth -
      gap;

    const doorCenter =
      shopLeft +
      sidePadding +
      doorWidth / 2;

    const shutterCenter =
      doorCenter +
      doorWidth / 2 +
      gap +
      shutterWidth / 2;

    const frameColor = 0x5f302b;       // 很旧的暗红木
    const wallInner = 0x917e66;        // 发灰旧米棕
    const wallInnerDark = 0x766957;    // 污旧区域

    const doorDark = 0x303b38;
    const doorFrame = 0x575a53;
    const trimColor = 0x8e755f;

    const shutterDark = 0x484741;      // 老铁闸
    const shutterLine = 0x6d6961;
    const shutterCenterStrip = 0x9d896b;

    const grimeDark = 0x36332f;
    const grimeMid = 0x4c4842;

    const canopyMain = 0x526b68;
    const canopyEdge = 0x663e38;

    box(
      shopWidth,
      2.56,
      0.11,
      mat(frameColor, 0.98),
      centerX,
      1.20 + raiseY,
      wallZ,
      g
    );

    // 內牆
    box(
      shopWidth - 0.12,
      2.04,
      0.05,
      mat(wallInner, 0.98),
      centerX,
      1.04 + raiseY,
      wallZ + 0.05,
      g
    );

    // 做舊：內牆左側偏暗
    box(
      0.18,
      1.94,
      0.02,
      mat(wallInnerDark, 0.92),
      shopLeft + 0.14,
      1.00 + raiseY,
      wallZ + 0.075,
      g
    );

    // 做舊：內牆右側偏暗
    box(
      0.16,
      1.90,
      0.02,
      mat(0x947d64, 0.90),
      shopRight - 0.14,
      0.98 + raiseY,
      wallZ + 0.075,
      g
    );

    // =========================================================
    // 4) 左邊窄門
    // =========================================================
    box(
      doorWidth,
      1.46,
      0.05,
      mat(doorDark, 1),
      doorCenter,
      0.82 + raiseY,
      wallZ + 0.07,
      g
    );

    // 門內框
    box(
      doorWidth - 0.08,
      1.28,
      0.025,
      mat(doorFrame, 0.98),
      doorCenter,
      0.82 + raiseY,
      wallZ + 0.095,
      g
    );

    // 左右框
    box(
      0.04,
      1.50,
      0.04,
      mat(trimColor, 0.98),
      doorCenter - doorWidth / 2 - 0.02,
      0.82 + raiseY,
      wallZ + 0.085,
      g
    );

    box(
      0.04,
      1.50,
      0.04,
      mat(trimColor, 0.98),
      doorCenter + doorWidth / 2 + 0.02,
      0.82 + raiseY,
      wallZ + 0.085,
      g
    );

    // 上框
    box(
      doorWidth + 0.04,
      0.04,
      0.04,
      mat(trimColor, 0.98),
      doorCenter,
      1.53 + raiseY,
      wallZ + 0.085,
      g
    );

    // =========================================================
    // 5) 右邊鐵閘
    // =========================================================
    box(
      shutterWidth,
      1.34,
      0.05,
      mat(shutterDark, 1),
      shutterCenter,
      0.80 + raiseY,
      wallZ + 0.07,
      g
    );

    // 鐵閘橫紋
    for (let yy = 0.26; yy <= 1.30; yy += 0.115) {
      box(
        shutterWidth - 0.06,
        0.010,
        0.034,
        mat(shutterLine, 1),
        shutterCenter,
        yy + raiseY,
        wallZ + 0.095,
        g
      );
    }

    // 中間舊色直條
    box(
      0.16,
      1.34,
      0.03,
      mat(shutterCenterStrip, 0.98),
      shutterCenter,
      0.80 + raiseY,
      wallZ + 0.10,
      g
    );

    // 鐵門污漬
    box(
      0.025,
      1.00,
      0.03,
      mat(grimeDark, 1),
      shutterCenter - shutterWidth * 0.22,
      0.84 + raiseY,
      wallZ + 0.10,
      g
    );

    box(
      0.028,
      0.82,
      0.03,
      mat(grimeMid, 1),
      shutterCenter + shutterWidth * 0.19,
      0.74 + raiseY,
      wallZ + 0.10,
      g
    );

    // 底部更黑
    box(
      shutterWidth - 0.04,
      0.05,
      0.03,
      mat(0x47423c, 1),
      shutterCenter,
      0.17 + raiseY,
      wallZ + 0.098,
      g
    );

    // =========================================================
    // 6) 招牌：德生辦行
    //    這次：更大、不扁、整體一起提高
    // =========================================================
    createSmallCanvasSign(
      g,
      "德生辦行",
      centerX,
      2.16 + raiseY,
      wallZ + 0.085,
      shopWidth - 0.12,
      0.52,
      {
        bg: "#d2c0a2",
        fg: "#8a2f28",
        border: "#7b322c",
        font: '"KaiTi","STKaiti","KaiTi_GB2312","DFKai-SB","BiauKai","楷体",serif',
        weight: "600",
        fontSize: 290
      }
    );

    // =========================================================
    // 7) 雨棚
    // =========================================================
    const canopy = box(
      shopWidth + 0.02,
      0.055,
      0.34,
      mat(canopyMain, 0.97),
      centerX,
      1.90 + raiseY,
      wallZ + 0.15,
      g
    );
    canopy.rotation.x = -0.18;

    // 雨棚前沿舊紅邊
    box(
      shopWidth + 0.02,
      0.028,
      0.045,
      mat(canopyEdge, 0.98),
      centerX,
      1.87 + raiseY,
      wallZ + 0.305,
      g
    );

    // =========================================================
    // 8) 外框做舊補丁（讓鋪頭不要太新）
    // =========================================================
    box(
      0.10,
      2.30,
      0.02,
      mat(0x5e2d27, 0.85),
      shopLeft + 0.08,
      1.16 + raiseY,
      wallZ + 0.075,
      g
    );

    box(
      0.12,
      2.10,
      0.02,
      mat(0x5b2b25, 0.82),
      shopRight - 0.08,
      1.08 + raiseY,
      wallZ + 0.075,
      g
    );
  }

  function createNarrowSideShop(
    g,
    x,
    wallZ
  ) {
    // 外框
    box(
      0.76,
      2.28,
      0.10,
      mat(0x7d4b3f, 0.98),
      x,
      1.14,
      wallZ,
      g
    );

    // 捲閘
    box(
      0.54,
      1.40,
      0.045,
      mat(0x5e5e57, 1),
      x + 0.02,
      0.76,
      wallZ + 0.06,
      g
    );

    for (let yy = 0.18; yy <= 1.30; yy += 0.14) {
      box(
        0.50,
        0.010,
        0.03,
        mat(0x8d8a81, 1),
        x + 0.02,
        yy,
        wallZ + 0.085,
        g
      );
    }

    // 側門
    box(
      0.18,
      1.56,
      0.03,
      mat(0x8e6428, 1),
      x + 0.29,
      0.85,
      wallZ + 0.065,
      g
    );

    // 小遮篷
    const canopy = box(
      0.72,
      0.05,
      0.32,
      mat(0x7d9a98, 0.96),
      x + 0.02,
      1.80,
      wallZ + 0.15,
      g
    );
    canopy.rotation.x = -0.18;
  }

  function createSmallCanvasSign(
    g,
    text,
    x,
    y,
    z,
    w,
    h,
    options = {}
  ) {
    const bg =
      options.bg || "#efe4cd";
    const fg =
      options.fg || "#7f2f26";
    const border =
      options.border || "#8c463c";
    const font =
      options.font ||
      '"BiauKai","DFKai-SB","KaiTi","KaiTi_GB2312","STKaiti","楷体",serif';
    const weight =
      options.weight || "700";
    let fontSize =
      options.fontSize || 220;

    // 這裡把畫布改成更扁更長，比例更像真實橫招牌
    const canvas =
      document.createElement("canvas");
    canvas.width = 1500;
    canvas.height = 420;

    const ctx =
      canvas.getContext("2d");

    ctx.fillStyle = bg;
    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    // 外框
    ctx.strokeStyle = border;
    ctx.lineWidth = 18;
    ctx.strokeRect(
      12,
      12,
      canvas.width - 24,
      canvas.height - 24
    );

    // 內框，讓它更像舊式招牌
    ctx.strokeStyle = "rgba(140,90,70,0.45)";
    ctx.lineWidth = 5;
    ctx.strokeRect(
      34,
      34,
      canvas.width - 68,
      canvas.height - 68
    );

    ctx.fillStyle = fg;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // 自動縮字，避免超出招牌
    const maxTextWidth = canvas.width - 180;
    ctx.font = `${weight} ${fontSize}px ${font}`;

    while (
      ctx.measureText(text).width > maxTextWidth &&
      fontSize > 160
    ) {
      fontSize -= 6;
      ctx.font = `${weight} ${fontSize}px ${font}`;
    }

    // 讓字體看起來更緊湊一些
    ctx.letterSpacing = "0px";

    ctx.fillText(
      text,
      canvas.width / 2,
      canvas.height / 2 + 4
    );

    // 很輕的做舊
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = "#8c7a63";
    for (let i = 0; i < 28; i++) {
      const px = (i * 53) % canvas.width;
      const py = (i * 37) % canvas.height;
      const pw = 16 + (i % 5) * 10;
      const ph = 6 + (i % 4) * 5;
      ctx.fillRect(px, py, pw, ph);
    }
    ctx.globalAlpha = 1;

    const tex =
      new THREE.CanvasTexture(canvas);
    tex.encoding =
      THREE.sRGBEncoding;
    tex.needsUpdate = true;

    const matSign =
      new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        depthWrite: false
      });

    const sign =
      new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        matSign
      );

    sign.position.set(x, y, z);
    sign.renderOrder = 60;

    g.add(sign);
  }

  function createEntranceEndWallText(
    building,
    text,
    x,
    y,
    scale = 1,
    colour = "#744136"
  ) {
    if (!building || !building._group) return;

    const canvas = document.createElement("canvas");
    canvas.width = 360;
    canvas.height = 1500;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const lines = text.includes("\n")
      ? text.split("\n")
      : [...text];

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = colour;

    // 強制優先楷體
    const fontSize = 220;
    ctx.font =
      `700 ${fontSize}px "BiauKai","DFKai-SB","KaiTi","KaiTi_GB2312","STKaiti","Kaiti TC","Kaiti SC","楷体",serif`;

    const gap = 255;
    const totalHeight = gap * (lines.length - 1);
    const startY = canvas.height / 2 - totalHeight / 2;

    lines.forEach((line, i) => {
      ctx.fillText(
        line,
        canvas.width / 2,
        startY + i * gap
      );
    });

    // 輕微做舊，不要太重
    ctx.globalCompositeOperation = "destination-out";

    for (let i = 0; i < 22; i++) {
      const px = (i * 67 + 31) % canvas.width;
      const py = (i * 137 + 41) % canvas.height;

      ctx.globalAlpha = 0.02 + (i % 3) * 0.01;
      ctx.fillRect(
        px,
        py,
        6 + (i % 3) * 5,
        4 + (i % 2) * 4
      );
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;

    const texture = new THREE.CanvasTexture(canvas);
    texture.encoding = THREE.sRGBEncoding;
    texture.needsUpdate = true;

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      depthTest: true,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -6,
      polygonOffsetUnits: -6
    });

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(
        1.05 * scale,
        6.40 * scale
      ),
      material
    );

    const entranceZ = building.d / 2 + 0.082;

    plane.position.set(x, y, entranceZ);
    plane.renderOrder = 90;

    building._group.add(plane);
  }

  function createEntranceLeftHeroWall() {
    const building =
      LEFT_BUILDINGS[LEFT_BUILDINGS.length - 1];

    if (!building || !building._group) return;

    const g = building._group;

    // 入口这一面
    const wallZ =
      building.d / 2 + 0.035;

    const frameMat =
      mat(0x56584f, 0.98);
    const glassMat =
      mat(0x2f3b39, 0.96);
    const sillMat =
      mat(0xd8ccb8, 0.98);
    const pipeMat =
      mat(0x6a665d, 0.98);
    const acMat =
      mat(0xd9d9d3, 1.0);
    const acDarkMat =
      mat(0x8e918b, 1.0);

    // =========================
    // 左边 4 排小窗（更像图二）
    // =========================
    const leftWindowRows = [
      8.15, 6.95, 5.75, 4.55
    ];

    leftWindowRows.forEach((yy) => {
      addHeroEndWindow(
        g,
        -0.95,
        yy,
        wallZ,
        frameMat,
        glassMat,
        sillMat
      );

      addHeroEndWindow(
        g,
        -0.42,
        yy,
        wallZ,
        frameMat,
        glassMat,
        sillMat
      );
    });

    // =========================
    // 右上单窗（图二右侧那扇）
    // =========================
    addHeroEndWindow(
      g,
      0.72,
      7.00,
      wallZ,
      frameMat,
      glassMat,
      sillMat
    );

    // =========================
    // 冷气机
    // =========================
    box(
      0.48,
      0.34,
      0.34,
      acMat,
      0.92,
      5.90,
      wallZ + 0.14,
      g
    );

    box(
      0.10,
      0.10,
      0.08,
      acDarkMat,
      1.12,
      5.90,
      wallZ + 0.24,
      g
    );

    box(
      0.20,
      0.04,
      0.18,
      acDarkMat,
      0.64,
      5.63,
      wallZ + 0.02,
      g
    );

    // =========================
    // 落水管（靠街道那边）
    // =========================
    box(
      0.07,
      8.90,
      0.07,
      pipeMat,
      0.46,
      4.85,
      wallZ + 0.015,
      g
    );

    // 管卡 / 横向接头
    [7.95, 6.10, 4.30].forEach((yy) => {
      box(
        0.24,
        0.05,
        0.05,
        pipeMat,
        0.35,
        yy,
        wallZ + 0.015,
        g
      );
    });

    // =========================
    // 下方小雨棚（模仿图二底部店面边缘）
    // =========================
    const awning =
      box(
        1.55,
        0.08,
        0.55,
        mat(0x68807a, 0.98),
        0.18,
        2.35,
        wallZ + 0.18,
        g
      );

    awning.rotation.x = -0.18;
  }

  function addHeroEndWindow(
    g,
    x,
    y,
    z,
    frameMat,
    glassMat,
    sillMat
  ) {
    // 外框
    box(
      0.42,
      0.70,
      0.08,
      frameMat,
      x,
      y,
      z,
      g
    );

    // 玻璃 / 深色窗面
    box(
      0.28,
      0.54,
      0.04,
      glassMat,
      x,
      y,
      z + 0.03,
      g
    );

    // 中竖框
    box(
      0.03,
      0.54,
      0.03,
      frameMat,
      x,
      y,
      z + 0.05,
      g
    );

    // 中横框
    box(
      0.28,
      0.03,
      0.03,
      frameMat,
      x,
      y,
      z + 0.05,
      g
    );

    // 窗台
    box(
      0.34,
      0.04,
      0.12,
      sillMat,
      x,
      y - 0.40,
      z + 0.04,
      g
    );
  }

  function createEndWallText(
    building,
    text,
    x,
    y,
    scale = 1,
    colour = "#703b32"
  ) {
    if (!building || !building._group) return;

    const canvas =
      document.createElement("canvas");

    canvas.width = 520;
    canvas.height = 1100;

    const ctx =
      canvas.getContext("2d");

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = colour;

    const lines =
      text.includes("\n")
        ? text.split("\n")
        : [...text];

    const fontSize =
      lines.length >= 4
        ? 150
        : 175;

    ctx.font =
      `900 ${fontSize}px "Microsoft JhengHei","Noto Sans TC",sans-serif`;

    const gap =
      lines.length >= 4
        ? 215
        : 255;

    const totalHeight =
      gap * (lines.length - 1);

    const startY =
      canvas.height / 2 -
      totalHeight / 2;

    lines.forEach(
      (line, i) => {
        ctx.fillText(
          line,
          canvas.width / 2,
          startY + i * gap
        );
      }
    );

    // 少量掉漆
    ctx.globalCompositeOperation =
      "destination-out";

    for (let i = 0; i < 36; i++) {
      const px =
        (i * 97) %
        canvas.width;

      const py =
        (i * 151) %
        canvas.height;

      ctx.globalAlpha =
        0.08 +
        (i % 4) * 0.025;

      ctx.fillRect(
        px,
        py,
        8 + (i % 5) * 7,
        3 + (i % 3) * 4
      );
    }

    ctx.globalCompositeOperation =
      "source-over";

    ctx.globalAlpha = 1;

    const texture =
      new THREE.CanvasTexture(canvas);

    texture.encoding =
      THREE.sRGBEncoding;

    texture.needsUpdate = true;

    const material =
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
        depthTest: true,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -4
      });

    const plane =
      new THREE.Mesh(
        new THREE.PlaneGeometry(
          1.85 * scale,
          4.65 * scale
        ),
        material
      );

    const endZ =
      -building.d / 2 - 0.09;

    plane.position.set(
      x,
      y,
      endZ
    );

    plane.renderOrder = 40;

    building._group.add(plane);
  }


  function createEntranceEndWindows() {
    addEndWallWindows(
      LEFT_BUILDINGS[0],
      "left",
      0
    );

    addEndWallWindows(
      RIGHT_BUILDINGS[0],
      "right",
      1
    );
  }

  function addEndWallWindows(
    building,
    side,
    seed
  ) {
    if (!building || !building._group) return;

    const g =
      building._group;

    const endZ =
      -building.d / 2 - 0.035;

    const windowMat =
      mat(0x35403d, 0.92);

    const frameMat =
      mat(0x555851, 0.98);

    let windows;

    if (side === "left") {
      windows = [
        [-0.92, 7.10],
        [-0.28, 7.10],

        [-0.92, 5.85],
        [-0.28, 5.85],

        [-0.92, 4.55]
      ];
    } else {
      windows = [
        [0.92, 7.05],
        [0.30, 7.05],

        [0.92, 5.75],
        [0.30, 5.75],

        [0.92, 4.45]
      ];
    }

    windows.forEach(
      ([x, y], i) => {

        box(
          0.48,
          0.78,
          0.055,
          frameMat,
          x,
          y,
          endZ,
          g
        );

        box(
          0.37,
          0.66,
          0.025,
          windowMat,
          x,
          y,
          endZ - 0.04,
          g
        );

        box(
          0.62,
          0.07,
          0.15,
          mat(0x777166, 0.98),
          x,
          y - 0.44,
          endZ - 0.02,
          g
        );

        if (
          (i + seed) % 2 === 0
        ) {
          createEndWindowCage(
            g,
            x,
            y,
            endZ - 0.13,
            i + seed
          );
        }
      }
    );
  }

  function createEndWindowCage(
    g,
    x,
    y,
    z,
    seed
  ) {
    const metal =
      mat(
        seed % 2 === 0
          ? 0x323632
          : 0x46463f,
        0.98
      );

    const width =
      0.55;

    const height =
      0.90;

    for (let i = -2; i <= 2; i++) {
      box(
        0.022,
        height,
        0.18,
        metal,
        x + i * width / 4,
        y,
        z,
        g
      );
    }

    for (let i = -1; i <= 1; i++) {
      box(
        width,
        0.022,
        0.18,
        metal,
        x,
        y + i * height / 2,
        z,
        g
      );
    }
  }

  function createWallAd(
    building,
    text,
    zOffset,
    y,
    scale = 0.5,
    colour = "#79352f"
  ) {
    if (!building || !building._group) return;

    const canvas =
      document.createElement("canvas");

    canvas.width = 512;
    canvas.height = 1024;

    const ctx =
      canvas.getContext("2d");

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.fillStyle = colour;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const lines = text.split("\n");

    if (lines.length > 1) {
      ctx.font =
        '900 150px "Microsoft JhengHei","Noto Sans TC",sans-serif';

      lines.forEach((line, i) => {
        ctx.fillText(
          line,
          256,
          180 + i * 200
        );
      });
    } else {
      ctx.font =
        '900 105px "Microsoft JhengHei","Noto Sans TC",sans-serif';

      ctx.save();

      ctx.translate(
        256,
        512
      );

      ctx.rotate(
        -Math.PI / 2
      );

      ctx.fillText(
        text,
        0,
        0
      );

      ctx.restore();
    }

    const texture =
      new THREE.CanvasTexture(canvas);

    texture.encoding =
      THREE.sRGBEncoding;

    const material =
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.68,
        depthWrite: false,
        side: THREE.DoubleSide
      });

    const plane =
      new THREE.Mesh(
        new THREE.PlaneGeometry(
          1.5 * scale,
          3.6 * scale
        ),
        material
      );

    const side =
      building._side;

    const dir =
      side === "left"
        ? 1
        : -1;

    plane.rotation.y =
      side === "left"
        ? Math.PI / 2
        : -Math.PI / 2;

    plane.position.set(
      building._facadeX +
      dir * 0.025,
      y,
      zOffset
    );

    building._group.add(plane);
  }

  function createOldWallAd(
    building,
    x,
    y,
    z,
    text,
    color
  ) {

    const canvas = document.createElement("canvas");

    canvas.width = 320;
    canvas.height = 700;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    ctx.globalAlpha = 0.82;

    ctx.fillStyle = color;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font =
      ctx.font =
      '900 94px "Microsoft JhengHei","Noto Sans TC",sans-serif';

    [...text].forEach((char, i) => {

      ctx.fillText(
        char,
        canvas.width / 2,
        110 + i * 115
      );

    });


    // 做舊
    ctx.globalCompositeOperation = "destination-out";

    for (let i = 0; i < 85; i++) {

      ctx.globalAlpha =
        Math.random() * 0.25;

      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 35,
        Math.random() * 9
      );
    }


    const texture =
      new THREE.CanvasTexture(canvas);

    texture.encoding =
      THREE.sRGBEncoding;


    const material =
      new THREE.MeshBasicMaterial({

        map: texture,

        transparent: true,

        depthWrite: false

      });


    const ad =
      new THREE.Mesh(

        new THREE.PlaneGeometry(
          1.8,
          4.3
        ),

        material

      );


    ad.position.set(
      x,
      y,
      z
    );


    building._group.add(ad);
  }

  // ============================================================
  // OLD WALL WEATHERING
  // ============================================================
  function createWallWeathering(
    g,
    facadeX,
    data,
    side,
    buildingIndex
  ) {
    const dir = side === "left" ? 1 : -1;

    const addPlane = (
      width,
      height,
      color,
      opacity,
      y,
      z
    ) => {
      const material =
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity,
          depthWrite: false,
          side: THREE.DoubleSide
        });

      const plane =
        new THREE.Mesh(
          new THREE.PlaneGeometry(
            width,
            height
          ),
          material
        );

      plane.rotation.y =
        side === "left"
          ? Math.PI / 2
          : -Math.PI / 2;

      plane.position.set(
        facadeX + dir * 0.026,
        y,
        z
      );

      g.add(plane);

      return plane;
    };


    addPlane(
      data.d * 0.88,
      0.34 + (buildingIndex % 3) * 0.08,
      0x4d493f,
      0.10,
      0.78,
      0
    );


    // 首层上方灰尘带

    if (buildingIndex % 2 === 0) {
      addPlane(
        data.d * 0.78,
        0.18,
        0x4b463d,
        0.10,
        2.80,
        0.04
      );
    }


    // 大面积褪色区域

    const fadedColours = [
      0xc0ad8f,
      0x81796c,
      0xb0927e,
      0x6c756d
    ];

    const fadeCount =
      3 +
      (buildingIndex % 3);

    for (let i = 0; i < fadeCount; i++) {
      const width =
        0.55 +
        ((buildingIndex + i) % 4) * 0.17;

      const height =
        0.70 +
        ((buildingIndex * 2 + i) % 4) * 0.28;

      const z =
        -data.d * 0.28 +
        i * data.d * 0.30 +
        ((buildingIndex % 2) * 0.09);

      const y =
        3.55 +
        i * 1.65 +
        (buildingIndex % 2) * 0.25;

      addPlane(
        width,
        height,
        fadedColours[
        (buildingIndex + i) %
        fadedColours.length
        ],
        0.16,
        y,
        z
      );
    }


    // 垂直雨水痕迹

    const rainCount =
      7 + (buildingIndex % 4);

    for (let i = 0; i < rainCount; i++) {
      const width =
        0.055 +
        (i % 3) * 0.035;

      const height =
        0.8 +
        (
          (
            buildingIndex * 5 +
            i * 3
          ) % 5
        ) * 0.36;

      const z =
        -data.d * 0.40 +
        (
          i /
          Math.max(
            rainCount - 1,
            1
          )
        ) *
        data.d *
        0.80;

      const y =
        4.0 +
        (
          (
            buildingIndex +
            i
          ) % 4
        ) *
        1.20;

      addPlane(
        width,
        height,
        i % 2 === 0
          ? 0x403e38
          : 0x756c5e,
        i % 2 === 0
          ? 0.10
          : 0.055,
        y,
        z
      );
    }


    // 窗下水迹

    const floorCount =
      Math.min(
        data.floors || 4,
        5
      );

    for (
      let floor = 0;
      floor < floorCount - 1;
      floor++
    ) {
      if (
        (
          buildingIndex +
          floor
        ) % 2 !== 0
      ) {
        continue;
      }

      const y =
        3.75 +
        floor * 1.55;

      const z =
        (
          floor % 2 === 0
            ? -0.22
            : 0.22
        ) *
        data.d;

      addPlane(
        0.16,
        0.65,
        0x47453f,
        0.13,
        y,
        z
      );
    }


    // 水泥修补块

    if (
      buildingIndex % 3 !== 1
    ) {
      const patchColour =
        buildingIndex % 2 === 0
          ? 0xa79b87
          : 0x817e73;

      addPlane(
        0.72 +
        (buildingIndex % 2) *
        0.20,
        0.43,
        patchColour,
        0.23,
        5.10 +
        (buildingIndex % 3) *
        0.55,
        data.d *
        (
          buildingIndex % 2 === 0
            ? 0.23
            : -0.23
        )
      );
    }


    // 小块脱漆

    const chipCount =
      3 + (buildingIndex % 2);

    for (
      let i = 0;
      i < chipCount;
      i++
    ) {
      const width =
        0.14 +
        (i % 3) * 0.08;

      const height =
        0.09 +
        (
          (
            buildingIndex +
            i
          ) % 3
        ) *
        0.07;

      const z =
        -data.d * 0.34 +
        (
          (
            i * 0.29 +
            buildingIndex * 0.11
          ) % 0.70
        ) *
        data.d;

      const y =
        3.15 +
        (
          (
            buildingIndex * 3 +
            i * 2
          ) % 7
        ) *
        0.72;

      addPlane(
        width,
        height,
        0xb6aa94,
        0.20,
        y,
        z
      );
    }


    // 局部深色老污迹

    if (
      buildingIndex === 0 ||
      buildingIndex === 3 ||
      buildingIndex === 5
    ) {
      addPlane(
        0.32,
        2.00,
        0x393a35,
        0.10,
        5.40,
        -data.d * 0.34
      );
    }


    // 屋檐下黑色积尘

    addPlane(
      data.d * 0.86,
      0.13,
      0x3b3934,
      0.13,
      data.h + 0.34,
      0
    );
  }

  function createOldBuilding(data, side, index) {
    const pose = getRoadPose(side, data.z);
    if (!pose) return;

    const g = new THREE.Group();

    const dir = side === "left" ? -1 : 1;

    const pavement = 1.15;

    // 每栋建筑可以独立前凸 / 后退
    const setback = data.setback || 0;

    // 基础距离
    const frontOffset =
      pavement +
      0.15 +
      setback;

    const depth =
      data.depth || 3.0;

    g.position.set(
      pose.x + dir * frontOffset,
      0,
      pose.z
    );

    g.rotation.y = pose.angle;

    stage.add(g);

    const wallTexture =
      makeOldWallTexture(
        data.color,
        index +
        (side === "left" ? 13 : 41)
      );

    const wall =
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: wallTexture,
        roughness: 1.0,
        metalness: 0.0
      });

    const localFacadeX =
      side === "left" ? -0.15 : 0.15;

    const localCenterX =
      side === "left"
        ? -depth / 2
        : depth / 2;

    box(
      depth,
      data.h,
      data.d,
      wall,
      localCenterX,
      0.55 + data.h / 2,
      0,
      g
    );

    createShopRow(
      g,
      localFacadeX,
      {
        ...data,
        z: 0
      },
      side,
      index
    );

    createUpperFacade(
      g,
      localFacadeX,
      {
        ...data,
        z: 0
      },
      side,
      index
    );

    createWallWeathering(
      g,
      localFacadeX,
      {
        ...data,
        z: 0
      },
      side,
      index
    );

    createFacadeClutter(
      g,
      localFacadeX,
      {
        ...data,
        z: 0
      },
      side,
      index
    );

    box(
      depth + 0.22,
      0.18,
      data.d + 0.18,

      mat(
        index % 3 === 0
          ? 0x777064
          : index % 3 === 1
            ? 0x82796b
            : 0x706d65,
        1
      ),

      localCenterX,
      data.h + 0.55,
      0,
      g
    );

    // ============================================================
    // IRREGULAR ROOFTOP STRUCTURES
    // ============================================================

    if (data.roofType === 0) {

      // 小型水泥机房
      box(
        depth * 0.42,
        0.72,
        data.d * 0.38,
        mat(0x777267),
        localCenterX - 0.12,
        data.h + 1.00,
        -data.d * 0.14,
        g
      );

    }

    else if (data.roofType === 1) {

      // 较大的旧屋顶加建
      box(
        depth * 0.58,
        0.92,
        data.d * 0.48,
        mat(0x857d6f),
        localCenterX + 0.08,
        data.h + 1.10,
        0.12,
        g
      );

    }

    else if (data.roofType === 2) {

      // 狭窄而高的屋顶机房
      box(
        depth * 0.32,
        1.18,
        data.d * 0.34,
        mat(0x6f7069),
        localCenterX - 0.18,
        data.h + 1.25,
        0.20,
        g
      );

    }

    if (
      (side === "left" &&
        (index === 1 || index === 5)) ||

      (side === "right" &&
        (index === 0 || index === 6))
    ) {
      cylinder(
        0.35,
        0.72,
        mat(0x777a74),
        localCenterX,
        data.h + 1.55,
        0.55,
        g
      );
    }

    if (
      (side === "left" &&
        (index === 0 || index === 3 || index === 6)) ||

      (side === "right" &&
        (index === 2 || index === 5))
    ) {
      createAntenna(
        localCenterX,
        data.h + 0.65,
        -0.65,
        g
      );
    }

    const facadeDir =
      side === "left" ? 1 : -1;

    box(
      0.10,
      data.h * 0.78,
      0.10,
      mat(0x5d625d),
      localFacadeX + facadeDir * 0.22,
      data.h * 0.48,
      data.d * 0.35,
      g
    );

    data._group = g;
    data._facadeX = localFacadeX;
    data._pose = pose;
    data._side = side;
    data._setback = data.setback || 0;
    data._outerX =
      side === "left"
        ? -depth
        : depth;
  }


  // ============================================================
  // SHOPS — OLD LEE TUNG STREET
  // ============================================================

  function createShopRow(
    g,
    facadeX,
    data,
    side,
    buildingIndex
  ) {
    const dir = side === "left" ? 1 : -1;

    // ============================================================
    // 1. 每栋楼的店铺数量不同
    // ============================================================

    let shopCount;

    if (data.d > 4.4) {
      shopCount = buildingIndex % 2 === 0 ? 3 : 2;
    } else if (data.d > 3.5) {
      shopCount = 2;
    } else {
      shopCount = buildingIndex % 3 === 0 ? 2 : 1;
    }

    const baseDepth = data.d / shopCount;

    // 旧香港店铺配色
    const framePalette = [
      0x71352f, // 暗红
      0x354c43, // 墨绿
      0x594a3b, // 旧棕
      0x343936, // 灰黑
      0x76533d, // 木棕
      0x5d302d  // 酒红
    ];

    const shutterPalette = [
      0x4a4c47,
      0x57564e,
      0x3e4541,
      0x625d50,
      0x484640
    ];

    for (let i = 0; i < shopCount; i++) {

      // ============================================================
      // 2. 每间店宽度、位置轻微错开
      // ============================================================

      const variation =
        ((buildingIndex * 7 + i * 11) % 5 - 2) * 0.035;

      const shopDepth =
        baseDepth * (0.91 + variation);

      const localZ =
        data.z -
        data.d / 2 +
        baseDepth * (i + 0.5) +
        ((buildingIndex + i) % 3 - 1) * 0.045;

      const seed =
        (side === "left" ? 37 : 109) +
        buildingIndex * 23 +
        i * 17;

      const shopState =
        buildingIndex === 7
          ? (side === "left"
            ? [0, 1, 2][i % 3]
            : [2, 4, 0][i % 3])
          : [0, 3, 2, 4, 1, 0, 2, 3][
          (buildingIndex * 3 + i + (side === "right" ? 2 : 0)) % 8
          ];

      const frameColor =
        framePalette[seed % framePalette.length];

      // 每间高度也不同
      const topHeight =
        2.42 + (seed % 4) * 0.10;

      const openingHeight =
        1.55 + (seed % 3) * 0.12;

      // ============================================================
      // SHOP BACKGROUND / FRAME
      // ============================================================

      box(
        0.17,
        topHeight,
        shopDepth * 0.92,
        mat(frameColor, 0.98),
        facadeX + dir * 0.09,
        1.55,
        localZ,
        g
      );

      // ============================================================
      // STATE 0 — CLOSED OLD SHUTTER
      // ============================================================

      if (shopState === 0) {

        createOldShutter(
          g,
          facadeX,
          dir,
          localZ,
          shopDepth,
          openingHeight,
          shutterPalette[seed % shutterPalette.length],
          seed
        );
      }

      // ============================================================
      // STATE 1 — OPEN PRINTING SHOP
      // ============================================================

      else if (shopState === 1) {

        createOpenOldShop(
          g,
          facadeX,
          dir,
          localZ,
          shopDepth,
          seed
        );
      }

      // ============================================================
      // STATE 2 — HALF OPEN SHUTTER
      // ============================================================

      else if (shopState === 2) {

        createHalfOpenShop(
          g,
          facadeX,
          dir,
          localZ,
          shopDepth,
          seed
        );
      }

      // ============================================================
      // STATE 3 — NARROW OLD DOOR
      // ============================================================

      else if (shopState === 3) {

        createNarrowOldShop(
          g,
          facadeX,
          dir,
          localZ,
          shopDepth,
          seed
        );
      }

      // ============================================================
      // STATE 4 — OLD GLASS / WOOD SHOP
      // ============================================================

      else {

        createOldGlassShop(
          g,
          facadeX,
          dir,
          localZ,
          shopDepth,
          seed
        );
      }
      dressOldShopfront(
        g, facadeX, dir, localZ, shopDepth,
        seed, shopState, buildingIndex, i
      );

      // 只保留入口店舖的招牌；其餘舊版細小牌停止生成。
      if (buildingIndex === 7 && i === 0) {
        createShopFasciaSign(
          g,
          facadeX,
          dir,
          localZ,
          shopDepth,
          seed,
          side,
          buildingIndex,
          i
        );
      }

      // 4. 每間店使用不同的舊雨棚
      const awningKind =
        buildingIndex === 7
          ? (side === "left" ? [0, 2, 1][i % 3] : [1, 0, 3][i % 3])
          : (buildingIndex * 2 + i + (side === "right" ? 1 : 0)) % 5;

      // 0、1：不同顏色的條紋帆布；2：舊鐵皮；
      // 3：褪色單色布；4：沒有雨棚，露出門面。
      if (awningKind !== 4) {
        const styles = [
          { base: 0x426258, stripe: 0xd7c8a9, type: "striped" },
          { base: 0x9b5143, stripe: 0xe3c9ab, type: "striped" },
          { base: 0x52666a, stripe: 0x343f40, type: "metal" },
          { base: 0xa88355, stripe: 0x755a43, type: "plain" }
        ];

        const style = styles[awningKind];
        const width = [0.88, 1.05, 0.74, 0.94][awningKind];
        const span = shopDepth * [0.91, 0.83, 0.96, 0.87][awningKind];
        const y = 2.31 + ((buildingIndex + i) % 3) * 0.075;
        const outerX = facadeX + dir * (0.26 + width);
        const centreX = facadeX + dir * (0.26 + width / 2);
        const tilt = dir === 1 ? -0.18 : 0.18;

        // 棚頂：整幅向街外伸出
        const roof = box(
          width, 0.07, span,
          mat(style.base, 1),
          centreX, y, localZ, g
        );
        roof.rotation.z = tilt;

        // 前沿厚邊：讓雨棚看起來不是一張薄片
        box(
          0.075, style.type === "metal" ? 0.12 : 0.17, span,
          mat(style.base, 1),
          outerX, y - 0.13, localZ, g
        );

        // 左右兩條舊金屬支架
        for (const edge of [-1, 1]) {
          const bracket = box(
            width * 0.84, 0.025, 0.025,
            mat(0x464943, 1),
            centreX, y - 0.14,
            localZ + edge * span * 0.46, g
          );
          bracket.rotation.z = tilt;
        }

        if (style.type === "striped") {
          const panels = 8;

          for (let p = 0; p < panels; p++) {
            if (p % 2 !== 0) continue;

            const panelZ =
              localZ - span / 2 + (p + 0.5) * span / panels;

            const stripe = box(
              width * 0.96, 0.012, span / panels * 0.97,
              mat(style.stripe, 1),
              centreX, y + 0.044, panelZ, g
            );
            stripe.rotation.z = tilt;
          }

          // 前沿垂簷與棚頂使用同一套條紋
          for (let p = 0; p < panels; p++) {
            box(
              0.082,
              0.18 + (p % 3 === 0 ? 0.035 : 0),
              span / panels * 0.98,
              mat(p % 2 === 0 ? style.stripe : style.base, 1),
              outerX + dir * 0.012,
              y - 0.17,
              localZ - span / 2 + (p + 0.5) * span / panels,
              g
            );
          }
        } else if (style.type === "metal") {
          // 鐵皮棚的密集折線與褪色前沿
          for (let p = -4; p <= 4; p++) {
            const rib = box(
              width * 0.96, 0.026, 0.022,
              mat(p % 3 === 0 ? 0x89918a : style.stripe, 1),
              centreX, y + 0.052,
              localZ + p * span / 10, g
            );
            rib.rotation.z = tilt;
          }

          box(
            0.087, 0.055, span * 0.91,
            mat(0x797363, 1),
            outerX + dir * 0.014, y - 0.19, localZ, g
          );
        } else {
          // 單色布棚不做規整條紋，改用幾塊褪色修補
          for (let p = 0; p < 3; p++) {
            box(
              width * (0.22 + p * 0.035), 0.013, span * 0.13,
              mat(p === 1 ? 0xc1ab84 : style.stripe, 1),
              centreX - dir * 0.12,
              y + 0.048,
              localZ + (p - 1) * span * 0.27,
              g
            );
          }
        }
      }

      // ============================================================
      // 5. SIDE POSTS
      // ============================================================

      if (seed % 3 !== 0) {

        const postZ =
          localZ -
          shopDepth * 0.43;

        box(
          0.09,
          2.15 + (seed % 2) * 0.16,
          0.075,
          mat(0x393a36, 0.98),
          facadeX + dir * 0.25,
          1.60,
          postZ,
          g
        );
      }

      // ============================================================
      // 6. 少量门口物件
      // 不再每家都有
      // ============================================================

      if (seed % 13 === 2) {

        // 小纸箱
        box(
          0.30,
          0.27,
          0.34,
          mat(0x806b50, 1),
          facadeX + dir * 0.48,
          0.72,
          localZ + shopDepth * 0.23,
          g
        );
      }

      if (seed % 17 === 4) {

        // 矮纸品箱
        box(
          0.22,
          0.18,
          0.42,
          mat(0x9b815a, 1),
          facadeX + dir * 0.44,
          0.66,
          localZ - shopDepth * 0.19,
          g
        );
      }
    }
  }

  function dressOldShopfront(
    g, facadeX, dir, z, depth,
    seed, state, buildingIndex, shopIndex
  ) {
    const variant =
      (buildingIndex + shopIndex + (dir < 0 ? 1 : 0)) % 4;

    const darkMetal = mat(
      [0x353a37, 0x51463e, 0x394944, 0x514e44][variant],
      1
    );

    // 每間舖都有稍微不同的石質門檻
    box(
      0.36,
      0.075,
      depth * (0.76 + variant * 0.045),
      mat([0x867d70, 0x6e716b, 0x9b8b75, 0x777166][variant], 1),
      facadeX + dir * 0.36,
      0.65,
      z,
      g
    );

    // 門檻上不規則的深色磨損
    if (variant !== 2) {
      box(
        0.13, 0.012, depth * 0.16,
        mat(0x504a41, 1),
        facadeX + dir * 0.46,
        0.695,
        z + depth * (variant === 0 ? -0.19 : 0.18),
        g
      );
    }

    // 舊鐵閘及窄門：加粗導軌，從遠處也看得見
    if (state === 0 || state === 3) {
      const faceX = facadeX + dir * 0.375;
      const gateWidth = depth * (state === 3 ? 0.44 : 0.75);
      const gateZ = state === 3 ? z + depth * 0.16 : z;

      for (const edge of [-1, 1]) {
        box(
          0.065, 1.75, 0.055,
          darkMetal,
          faceX, 1.53,
          gateZ + edge * gateWidth * 0.49,
          g
        );
      }

      // 有些舖頭的鐵閘帶豎向摺門骨架；
      // 另一些保留原本橫向卷閘紋，避免全部一樣。
      if (variant === 0 || variant === 2) {
        for (let bar = -2; bar <= 2; bar++) {
          box(
            0.026, 1.42, 0.035,
            mat(bar === 0 ? 0x8a7965 : 0x343d3a, 1),
            faceX + dir * 0.038,
            1.53,
            gateZ + bar * gateWidth * 0.17,
            g
          );
        }

        box(
          0.036, 0.07, gateWidth * 0.94,
          mat(0x3d403b, 1),
          faceX + dir * 0.055,
          1.66,
          gateZ,
          g
        );
      }

      // 閘腳積塵、生鏽：較大的色塊比細碎噪點清楚
      box(
        0.022,
        0.19 + variant * 0.035,
        gateWidth * (0.50 + variant * 0.07),
        mat([0x73523d, 0x47433a, 0x85674d, 0x5f5143][variant], 1),
        faceX + dir * 0.064,
        0.86,
        gateZ + gateWidth * (variant % 2 ? 0.11 : -0.10),
        g
      );
    }

    // 半開閘：門頂加可見的卷閘箱，與全關的店不同
    if (state === 2) {
      box(
        0.20, 0.24, depth * 0.81,
        mat(variant % 2 ? 0x51534c : 0x424844, 1),
        facadeX + dir * 0.32,
        2.24,
        z,
        g
      );

      box(
        0.025, 0.045, depth * 0.75,
        mat(0x927b61, 1),
        facadeX + dir * 0.435,
        2.13,
        z,
        g
      );
    }

    // 閘面上的舊告示；每間的位置、大小不同
    if ((state === 0 || state === 3) && variant !== 1) {
      const paperZ =
        z + depth * (variant === 2 ? 0.08 : -0.14);
      const paperX = facadeX + dir * 0.46;

      box(
        0.014,
        0.36 + variant * 0.045,
        Math.min(depth * 0.28, 0.43),
        mat(variant === 2 ? 0xb4a387 : 0xccc0a5, 1),
        paperX,
        1.38 + variant * 0.10,
        paperZ,
        g
      );

      // 告示的紅色抬頭與幾條手寫痕跡
      box(
        0.018, 0.045, Math.min(depth * 0.21, 0.32),
        mat(0x93473a, 1),
        paperX + dir * 0.013,
        1.48 + variant * 0.10,
        paperZ,
        g
      );

      for (let line = 0; line < 3; line++) {
        box(
          0.019, 0.013,
          Math.min(depth * (0.16 + line * 0.025), 0.30),
          mat(0x72665b, 1),
          paperX + dir * 0.016,
          1.38 + variant * 0.10 - line * 0.060,
          paperZ,
          g
        );
      }
    }

    // 少量店舖門前的舊紙箱，避免每家整齊擺一個
    if (seed % 5 === 1) {
      box(
        0.28, 0.25, 0.30,
        mat(0x846b4c, 1),
        facadeX + dir * 0.66,
        0.80,
        z + depth * 0.28,
        g
      );

      box(
        0.29, 0.022, 0.31,
        mat(0xb3996e, 1),
        facadeX + dir * 0.66,
        0.94,
        z + depth * 0.28,
        g
      );
    }
  }

  const SHOP_CATALOG = [
    ["德生辦行", "#e9deca", "#923128", "PRINTING", 0],
    ["祥利成章", "#9b302d", "#f1dfbb", "SEALS & STAMPS", 1],
    ["彩色世界", "#ebe0ca", "#38454c", "COLOUR WORLD", 2],
    ["萬興紙業", "#d7c19a", "#842e28", "PAPER MERCHANT", 3],
    ["柯式印務", "#354c46", "#f2dfb3", "OFFSET PRINT", 4],
    ["囍帖專門", "#b74237", "#fff0ca", "WEDDING CARDS", 1],
    ["永記喜帖", "#e8d7b9", "#87342e", "INVITATIONS", 0],
    ["福安文具", "#455d66", "#f4dfc4", "STATIONERY", 4],
    ["金星紙品", "#e9bd77", "#812f2d", "PAPER GOODS", 3],
    ["榮光照相", "#425e59", "#f4e8c9", "PHOTO STUDIO", 2],
    ["百合彩印", "#bb6944", "#f6e6cb", "COLOUR PRINT", 1],
    ["嘉利鐘錶", "#e2d7b4", "#8e3635", "WATCHES", 0],
    ["新興招牌", "#8a322f", "#e9d5a7", "SIGN WORKSHOP", 4],
    ["興記紙行", "#c5b796", "#24483e", "PAPER SHOP", 3],
    ["美華地產", "#e6d29b", "#a23630", "ESTATE", 2],
    ["通利印刷", "#9f4540", "#f5dcb1", "PRINTING", 1]
  ];

  function makeShopFasciaTexture(info, seed) {
    const [name, bg, fg, subtitle, style] = info;

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 320;

    const c = canvas.getContext("2d");
    const W = 1024;
    const H = 320;

    c.fillStyle = bg;
    c.fillRect(0, 0, W, H);

    c.fillStyle = "rgba(255,255,255,.11)";
    c.fillRect(0, 0, W, 95);

    // 五種不同的招牌邊框
    if (style === 0) {
      c.strokeStyle = fg;
      c.lineWidth = 13;
      c.strokeRect(12, 12, W - 24, H - 24);
      c.lineWidth = 3;
      c.strokeRect(35, 35, W - 70, H - 70);
    } else if (style === 1) {
      c.fillStyle = fg;
      c.fillRect(0, 0, W, 26);
      c.fillRect(0, H - 26, W, 26);
    } else if (style === 2) {
      c.fillStyle = fg;
      for (let x = 0; x < W; x += 96) {
        c.fillRect(x, 0, 38, 26);
      }
      c.fillRect(0, H - 28, W, 28);
    } else if (style === 3) {
      c.strokeStyle = fg;
      c.lineWidth = 8;
      c.strokeRect(20, 20, W - 40, H - 40);
      c.fillStyle = fg;
      c.fillRect(0, 0, 78, H);
    } else {
      c.fillStyle = fg;
      c.fillRect(0, 0, 26, H);
      c.fillRect(W - 26, 0, 26, H);
      c.strokeStyle = fg;
      c.lineWidth = 4;
      c.strokeRect(40, 20, W - 80, H - 40);
    }

    // 每間店的角落小標誌
    const emblem = ["囍", "印", "紙", "福", "藝", "彩"][seed % 6];

    c.fillStyle = fg;
    c.globalAlpha = 0.88;
    c.fillRect(52, 85, 115, 115);

    c.fillStyle = bg;
    c.font = '900 74px "Noto Serif CJK TC","PMingLiU",serif';
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(emblem, 110, 143);

    c.globalAlpha = 1;
    c.fillStyle = fg;

    const serif = style === 0 || style === 3;
    const fontFamily = serif
      ? '"Noto Serif CJK TC","PMingLiU",serif'
      : '"Noto Sans CJK TC","Microsoft JhengHei",sans-serif';

    c.font = `900 ${name.length > 5 ? 112 : 147}px ${fontFamily}`;
    c.fillText(name, 590, 135, 750);

    c.font = "800 41px Arial,sans-serif";
    c.fillText(subtitle, 585, 252, 750);

    const texture = new THREE.CanvasTexture(canvas);
    texture.encoding = THREE.sRGBEncoding;
    texture.needsUpdate = true;

    return texture;
  }

  function createShopFasciaSign(
    g,
    facadeX,
    dir,
    localZ,
    shopDepth,
    seed,
    side,
    buildingIndex,
    shopIndex
  ) {
    // 左右兩側錯開選款，不再產生鏡像店舖
    const slot =
      buildingIndex * 3 +
      shopIndex +
      (side === "right" ? 7 : 0);

    const info = SHOP_CATALOG[slot % SHOP_CATALOG.length];

    const signWidth = shopDepth * (0.92 + (seed % 3) * 0.02);
    const signHeight = 0.62 + (seed % 3) * 0.06;

    const face = new THREE.MeshStandardMaterial({
      map: makeShopFasciaTexture(info, seed),
      roughness: 0.96,
      side: THREE.DoubleSide
    });

    const edge = mat(0x493e37, 1);

    const sign = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, signHeight, signWidth),

      // BoxGeometry 前兩個面才是 ±X，也就是朝向街道的面。
      // 原代碼把文字貼在最後兩個 ±Z 面，導致正面看不到店名。
      [face, face, edge, edge, edge, edge]
    );

    sign.position.set(
      facadeX + dir * 0.36,
      2.62,
      localZ
    );

    sign.castShadow = true;
    g.add(sign);

    // 每間店的門柱顏色也不同
    const jamb = mat(
      [0x754537, 0x3d544c, 0x745d48, 0x465962][seed % 4],
      1
    );

    [-1, 1].forEach((k) => {
      box(
        0.095,
        1.95,
        0.07,
        jamb,
        facadeX + dir * 0.29,
        1.60,
        localZ + k * signWidth * 0.49,
        g
      );
    });
  }


  // ============================================================
  // CLOSED OLD SHUTTER
  // ============================================================

  function createOldShutter(
    g,
    facadeX,
    dir,
    z,
    shopDepth,
    height,
    colour,
    seed
  ) {

    const shutterY =
      0.72 + height / 2;

    // 部分舖頭使用直條摺閘，與橫紋卷閘形成明顯差別。
    if (seed % 3 === 1) {
      const dark = mat(0x343a37, 1);
      const bar = mat(0x777469, 1);
      const rust = mat(0x74513e, 1);
      const gateWidth = shopDepth * 0.77;
      const gateX = facadeX + dir * 0.29;

      // 閘後的暗色室內
      box(
        0.055, height, gateWidth,
        dark,
        facadeX + dir * 0.22,
        shutterY,
        z,
        g
      );

      // 每扇閘的兩側導軌和中央補強條
      for (const edge of [-1, 1]) {
        box(
          0.045, height + 0.12, 0.055,
          mat(seed % 2 ? 0x383c39 : 0x584b40, 1),
          facadeX + dir * 0.305,
          shutterY,
          z + edge * shopDepth * 0.39,
          g
        );
      }

      if (seed % 2 === 0) {
        box(
          0.026, height * 0.88, 0.045,
          mat(0x302f2b, 1),
          facadeX + dir * 0.31,
          shutterY,
          z + shopDepth * 0.08,
          g
        );
      }

      // 下半部不規則的大面積舊漆，比細小鏽點更容易看到
      for (let p = 0; p < 3; p++) {
        box(
          0.018,
          0.16 + (p % 2) * 0.12,
          Math.min(0.22, shopDepth * 0.16),
          mat([0x645947, 0x35413e, 0x82664e][(seed + p) % 3], 1),
          facadeX + dir * 0.307,
          0.95 + p * 0.29,
          z + (p - 1) * shopDepth * 0.22,
          g
        );
      }

      // 兩側較粗的門框
      [-1, 1].forEach(k => {
        box(
          0.105, height + 0.12, 0.075,
          rust,
          gateX,
          shutterY,
          z + k * gateWidth * 0.50,
          g
        );
      });

      // 密集直條；在近景可讀作舊式鐵閘
      const bars = 11;
      for (let k = 0; k < bars; k++) {
        const barZ =
          z - gateWidth * 0.45 +
          (k / (bars - 1)) * gateWidth * 0.90;

        box(
          0.042,
          height - 0.11,
          0.024,
          k % 4 === 0 ? rust : bar,
          gateX + dir * 0.035,
          shutterY,
          barZ,
          g
        );
      }

      // 不同高度的橫向扣條
      [0.93, 1.42, 1.93].forEach((barY, index) => {
        if (barY > 0.72 + height) return;
        box(
          0.047, 0.038, gateWidth * 0.94,
          index === 0 ? rust : bar,
          gateX + dir * 0.06,
          barY,
          z,
          g
        );
      });

      // 門鎖及下方鏽蝕
      box(
        0.075, 0.18, 0.12,
        rust,
        gateX + dir * 0.095,
        1.25,
        z + gateWidth * 0.12,
        g
      );
      box(
        0.055, 0.13, gateWidth * 0.93,
        rust,
        gateX + dir * 0.05,
        0.79,
        z,
        g
      );

      return; // 不再疊加下方的橫紋卷閘
    }

    box(
      0.075,
      height,
      shopDepth * 0.77,
      mat(colour, 1),
      facadeX + dir * 0.235,
      shutterY,
      z,
      g
    );

    // 不規則的褪色修補：每個鐵閘的位置不同
    const weatherColours = [
      0x343b39, // 深灰補漆
      0x806750, // 鏽棕
      0x9b927d, // 褪色灰
      0x6b5041  // 深鏽色
    ];

    for (let patch = 0; patch < 5; patch++) {
      const patchZ =
        z +
        (((seed * 7 + patch * 13) % 19) / 18 - 0.5) *
        shopDepth * 0.56;

      const patchY =
        0.94 + ((seed + patch * 7) % 11) * 0.115;

      box(
        0.014,
        0.11 + (patch % 3) * 0.11,
        Math.min(shopDepth * 0.10, 0.10 + (patch % 2) * 0.05),
        mat(weatherColours[(seed + patch) % weatherColours.length], 1),
        facadeX + dir * 0.292,
        patchY,
        patchZ,
        g
      );
    }

    // 下緣較深的鏽蝕帶
    box(
      0.021,
      0.085,
      shopDepth * 0.73,
      mat(seed % 2 ? 0x674e3e : 0x574d42, 1),
      facadeX + dir * 0.304,
      0.78,
      z,
      g
    );

    // 部分商舖貼有歪斜的舊告示
    if (seed % 3 === 0) {
      const notice = box(
        0.018,
        0.48,
        Math.min(0.34, shopDepth * 0.27),
        mat(0xc3b498, 1),
        facadeX + dir * 0.315,
        1.43,
        z - shopDepth * 0.12,
        g
      );

      notice.rotation.x = (seed % 2 ? 1 : -1) * 0.045;

      box(
        0.021,
        0.045,
        Math.min(0.27, shopDepth * 0.21),
        mat(0x954739, 1),
        facadeX + dir * 0.329,
        1.50,
        z - shopDepth * 0.12,
        g
      );
    }

    // 不規則的舊漆與鏽斑
    const rustColours = [
      0x493f39,
      0x805d48,
      0x6b5143,
      0x92836e
    ];

    for (let patch = 0; patch < 7; patch++) {
      const offsetZ =
        (((seed * 11 + patch * 7) % 19) / 18 - 0.5) *
        shopDepth * 0.58;

      const patchY =
        0.87 + ((seed + patch * 5) % 12) * 0.11;

      box(
        0.019,
        0.09 + (patch % 3) * 0.095,
        Math.min(0.12, shopDepth * 0.10),
        mat(rustColours[(seed + patch) % rustColours.length], 1),
        facadeX + dir * 0.292,
        patchY,
        z + offsetZ,
        g
      );
    }

    // 鐵閘腳部更深的潮濕鏽蝕
    box(
      0.023,
      0.14,
      shopDepth * 0.73,
      mat(seed % 2 === 0 ? 0x51423a : 0x625045, 1),
      facadeX + dir * 0.307,
      0.80,
      z,
      g
    );

    // 卷闸横纹
    const lineSpacing =
      0.15 + (seed % 3) * 0.018;

    if (seed % 4 !== 1) {

      for (
        let y = 0.82;
        y < 0.72 + height - 0.06;
        y += lineSpacing
      ) {

        box(
          0.025,
          0.017,
          shopDepth * 0.72,
          mat(
            seed % 3 === 0
              ? 0x706b61
              : 0x63655f,
            1
          ),
          facadeX + dir * 0.282,
          y,
          z,
          g
        );
      }

    }

    // ============================================================
    // OLD PATCHES
    // ============================================================

    if (seed % 2 === 0) {

      box(
        0.018,
        0.42,
        shopDepth * 0.22,
        mat(0x30322e, 1),
        facadeX + dir * 0.294,
        1.05,
        z + shopDepth * 0.19,
        g
      );
    }

    if (seed % 3 === 0) {

      box(
        0.019,
        0.19,
        shopDepth * 0.38,
        mat(0x6a5948, 1),
        facadeX + dir * 0.297,
        1.72,
        z - shopDepth * 0.10,
        g
      );
    }

    // 底部锈迹
    box(
      0.018,
      0.13,
      shopDepth * 0.73,
      mat(
        seed % 2 === 0
          ? 0x594236
          : 0x41413c,
        1
      ),
      facadeX + dir * 0.298,
      0.79,
      z,
      g
    );

    if (seed % 3 === 1) {

      const paperMat =
        new THREE.MeshStandardMaterial({
          color:
            seed % 2 === 0
              ? 0xb7aa8d
              : 0x8f8069,
          roughness: 1
        });

      box(
        0.015,
        0.46,
        shopDepth * 0.30,
        paperMat,
        facadeX + dir * 0.305,
        1.35,
        z - shopDepth * 0.13,
        g
      );
    }


    if (seed % 5 === 2) {

      box(
        0.016,
        0.25,
        shopDepth * 0.20,
        mat(0x7e302c, 1),
        facadeX + dir * 0.307,
        1.85,
        z + shopDepth * 0.17,
        g
      );
    }
  }


  // ============================================================
  // OPEN PRINTING SHOP
  // ============================================================

  function createOpenOldShop(
    g,
    facadeX,
    dir,
    z,
    shopDepth,
    seed
  ) {

    // 深色内部
    box(
      0.08,
      1.78,
      shopDepth * 0.76,
      mat(0x22231f, 1),
      facadeX + dir * 0.22,
      1.53,
      z,
      g
    );

    // 暖色内墙
    box(
      0.025,
      1.48,
      shopDepth * 0.64,
      mat(
        seed % 2 === 0
          ? 0x8c7254
          : 0x78644e,
        1
      ),
      facadeX + dir * 0.30,
      1.51,
      z,
      g
    );

    // 左右门框
    box(
      0.10,
      1.80,
      0.08,
      mat(0x4a382d, 1),
      facadeX + dir * 0.32,
      1.53,
      z - shopDepth * 0.34,
      g
    );

    box(
      0.10,
      1.80,
      0.08,
      mat(0x4a382d, 1),
      facadeX + dir * 0.32,
      1.53,
      z + shopDepth * 0.34,
      g
    );

    // 柜台
    if (seed % 3 !== 0) {

      box(
        0.28,
        0.47,
        shopDepth * 0.43,
        mat(0x49382c, 1),
        facadeX + dir * 0.47,
        0.99,
        z,
        g
      );
    }

    // 纸张层
    if (seed % 2 === 1) {

      const paperColours = [
        0xa89068,
        0xb7a57f,
        0x7e4439,
        0xc1b08e
      ];

      for (let p = 0; p < 4; p++) {

        box(
          0.075,
          0.065,
          0.24,
          mat(paperColours[p], 1),
          facadeX + dir * 0.52,
          1.06 + p * 0.075,
          z - 0.16 + p * 0.10,
          g
        );
      }
    }
  }


  // ============================================================
  // HALF OPEN SHOP
  // ============================================================

  function createHalfOpenShop(
    g,
    facadeX,
    dir,
    z,
    shopDepth,
    seed
  ) {

    // 店内黑色空间
    box(
      0.075,
      1.78,
      shopDepth * 0.76,
      mat(0x24241f, 1),
      facadeX + dir * 0.22,
      1.53,
      z,
      g
    );

    const shutterHeight =
      0.55 + (seed % 3) * 0.16;

    const shutterY =
      2.17 - shutterHeight / 2;

    box(
      0.075,
      shutterHeight,
      shopDepth * 0.76,
      mat(
        seed % 2 === 0
          ? 0x50514b
          : 0x414743,
        1
      ),
      facadeX + dir * 0.28,
      shutterY,
      z,
      g
    );

    for (
      let y =
        shutterY -
        shutterHeight / 2 +
        0.09;
      y <
      shutterY +
      shutterHeight / 2;
      y += 0.15
    ) {

      box(
        0.025,
        0.017,
        shopDepth * 0.71,
        mat(0x777269, 1),
        facadeX + dir * 0.315,
        y,
        z,
        g
      );
    }

    // 店内柜台 / 箱
    if (seed % 2 === 0) {

      box(
        0.26,
        0.40,
        shopDepth * 0.38,
        mat(0x5a4634, 1),
        facadeX + dir * 0.44,
        0.94,
        z + shopDepth * 0.12,
        g
      );
    }
  }


  // ============================================================
  // NARROW OLD SHOP
  // ============================================================

  function createNarrowOldShop(
    g,
    facadeX,
    dir,
    z,
    shopDepth,
    seed
  ) {

    // 背景卷闸
    box(
      0.07,
      1.70,
      shopDepth * 0.74,
      mat(0x4b4d47, 1),
      facadeX + dir * 0.23,
      1.50,
      z,
      g
    );

    // 一侧窄门
    const doorZ =
      z -
      shopDepth * 0.22;

    box(
      0.095,
      1.74,
      shopDepth * 0.27,
      mat(
        seed % 2 === 0
          ? 0x382d27
          : 0x293630,
        1
      ),
      facadeX + dir * 0.30,
      1.50,
      doorZ,
      g
    );

    // 门上窄玻璃
    box(
      0.018,
      0.82,
      shopDepth * 0.15,
      mat(0x3f504d, 0.82),
      facadeX + dir * 0.354,
      1.67,
      doorZ,
      g
    );

    // 卷闸纹
    for (let y = 0.83; y < 2.23; y += 0.18) {

      box(
        0.022,
        0.016,
        shopDepth * 0.39,
        mat(0x747168, 1),
        facadeX + dir * 0.286,
        y,
        z + shopDepth * 0.17,
        g
      );
    }
  }


  // ============================================================
  // OLD GLASS / WOOD SHOP
  // ============================================================

  function createOldGlassShop(
    g,
    facadeX,
    dir,
    z,
    shopDepth,
    seed
  ) {

    const wood =
      seed % 2 === 0
        ? 0x583d31
        : 0x35443e;

    // 深色背景
    box(
      0.07,
      1.72,
      shopDepth * 0.76,
      mat(0x272823, 1),
      facadeX + dir * 0.22,
      1.51,
      z,
      g
    );

    // 两块旧玻璃
    const glassMat =
      new THREE.MeshStandardMaterial({
        color: 0x53635e,
        roughness: 0.55,
        metalness: 0.05,
        transparent: true,
        opacity: 0.72
      });

    const panelDepth =
      shopDepth * 0.29;

    for (let p = -1; p <= 1; p += 2) {

      box(
        0.025,
        1.18,
        panelDepth,
        glassMat,
        facadeX + dir * 0.31,
        1.58,
        z + p * shopDepth * 0.19,
        g
      );
    }

    // 木框横梁
    box(
      0.065,
      0.08,
      shopDepth * 0.73,
      mat(wood, 1),
      facadeX + dir * 0.34,
      2.18,
      z,
      g
    );

    box(
      0.065,
      0.08,
      shopDepth * 0.73,
      mat(wood, 1),
      facadeX + dir * 0.34,
      0.92,
      z,
      g
    );

    // 中柱
    box(
      0.065,
      1.34,
      0.075,
      mat(wood, 1),
      facadeX + dir * 0.34,
      1.55,
      z,
      g
    );
  }


  // ============================================================
  // WINDOWS / CAGES / AC
  // ============================================================

  function createUpperFacade(
    g,
    facadeX,
    data,
    side,
    buildingIndex
  ) {
    const dir = side === "left" ? 1 : -1;

    const upperFloors = data.floors - 1;

    const floorStep =
      (data.h - 3.25) / upperFloors;

    let bays;

    if (data.d >= 4.2) {
      bays = 4;
    } else if (data.d >= 3.15) {
      bays = 3;
    } else {
      bays = 2;
    }

    for (
      let floor = 0;
      floor < upperFloors;
      floor++
    ) {
      const floorOffset =
        (
          (
            buildingIndex * 7 +
            floor * 13
          ) % 5
          - 2
        ) * 0.075;

      const y =
        3.55 +
        floor * floorStep +
        floorOffset;

      for (
        let bay = 0;
        bay < bays;
        bay++
      ) {
        const seed =
          buildingIndex * 37 +
          floor * 11 +
          bay * 19;

        const missingWindow =
          seed % 8 === 0 ||
          (
            buildingIndex % 3 === 1 &&
            floor % 2 === 0 &&
            bay === bays - 1
          );

        if (missingWindow) {
          continue;
        }

        const bayStep =
          data.d / bays;

        const zJitter =
          (
            (
              seed * 17 +
              bay * 23
            ) % 9
            - 4
          ) * 0.035;

        const z =
          -data.d / 2 +
          bayStep * (bay + 0.5) +
          zJitter;

        const windowWidth =
          0.39 +
          (seed % 4) * 0.075;

        const windowHeight =
          0.70 +
          (seed % 5) * 0.075;

        const recessColor =
          seed % 4 === 0
            ? 0x292d2b
            : seed % 4 === 1
              ? 0x343a37
              : 0x303431;

        box(
          0.10,
          windowHeight + 0.18,
          windowWidth + 0.14,
          mat(recessColor, 0.96),
          facadeX + dir * 0.07,
          y,
          z,
          g
        );

        const glassColors = [
          0x45514e,
          0x3d4845,
          0x4d5651,
          0x38423f
        ];

        box(
          0.065,
          windowHeight,
          windowWidth,
          mat(
            glassColors[
            seed % glassColors.length
            ],
            0.72
          ),
          facadeX + dir * 0.145,
          y,
          z,
          g
        );

        const sillColors = [
          0x777166,
          0x857d70,
          0x69675f,
          0x8b8172
        ];

        const sillWidth =
          windowWidth +
          0.24 +
          (seed % 2) * 0.10;

        box(
          0.25,
          0.075,
          sillWidth,
          mat(
            sillColors[
            seed % sillColors.length
            ],
            0.98
          ),
          facadeX + dir * 0.16,
          y - windowHeight / 2 - 0.09,
          z +
          ((seed % 3) - 1) * 0.025,
          g
        );

        const cageType =
          seed % 8;

        if (
          cageType === 0 ||
          cageType === 2 ||
          cageType === 3 ||
          cageType === 6
        ) {
          createWindowCage(
            g,
            facadeX + dir * 0.32,
            y,
            z,
            dir,
            cageType % 6,
            seed
          );
        }

        const hasAC =
          seed % 5 === 1 ||
          seed % 9 === 3 ||
          (
            buildingIndex % 4 === 0 &&
            bay === 0 &&
            floor > 0
          );

        if (hasAC) {
          createOldACUnit(
            g,
            facadeX,
            dir,
            y,
            z,
            seed
          );
        }

        if (
          seed % 8 === 3
        ) {
          const pipe =
            cylinder(
              0.022,
              0.75 +
              (seed % 3) * 0.18,
              mat(0x474b47, 1),
              facadeX +
              dir * 0.23,
              y - 0.30,
              z + windowWidth * 0.65,
              g
            );

          pipe.rotation.z =
            dir * 0.06;
        }
      }

      if (
        (
          floor +
          buildingIndex
        ) % 3 === 0
      ) {
        box(
          0.22,
          0.07,
          data.d *
          (
            0.52 +
            (
              buildingIndex % 3
            ) * 0.10
          ),
          mat(
            buildingIndex % 2 === 0
              ? 0x69665e
              : 0x7a7367,
            0.98
          ),
          facadeX + dir * 0.13,
          y - 0.72,
          (
            buildingIndex % 2 === 0
              ? -0.10
              : 0.12
          ),
          g
        );
      }
    }
  }


  function createWindowCage(
    g,
    x,
    y,
    z,
    dir,
    type = 0,
    seed = 0
  ) {
    const cageColors = [
      0x343936,
      0x41443f,
      0x292e2c,
      0x504d45
    ];

    const metal =
      mat(
        cageColors[
        seed % cageColors.length
        ],
        0.98
      );

    const width =
      0.54 +
      (seed % 3) * 0.07;

    const height =
      0.92 +
      (seed % 2) * 0.12;

    const depth =
      type === 5
        ? 0.36
        : 0.27;

    const verticalCount =
      type === 2
        ? 4
        : 3;

    for (
      let i = 0;
      i < verticalCount;
      i++
    ) {
      const t =
        verticalCount === 1
          ? 0
          : i /
          (verticalCount - 1);

      box(
        depth,
        height,
        0.022,
        metal,
        x +
        dir *
        (
          type === 5
            ? 0.05
            : 0
        ),
        y,
        z -
        width / 2 +
        width * t,
        g
      );
    }

    const horizontalCount =
      type === 0
        ? 2
        : 3;

    for (
      let i = 0;
      i < horizontalCount;
      i++
    ) {
      const t =
        horizontalCount === 1
          ? 0
          : i /
          (horizontalCount - 1);

      box(
        depth,
        0.022,
        width,
        metal,
        x,
        y -
        height / 2 +
        height * t,
        z,
        g
      );
    }

    if (type === 5) {
      box(
        depth,
        0.025,
        width,
        metal,
        x,
        y - height / 2,
        z,
        g
      );

      box(
        depth,
        0.025,
        width,
        metal,
        x,
        y + height / 2,
        z,
        g
      );
    }
  }

  function createOldACUnit(
    g,
    facadeX,
    dir,
    y,
    z,
    seed
  ) {
    const bodyColors = [
      0x676a65,
      0x77746b,
      0x5f6561,
      0x817b70,
      0x6f7069
    ];

    const bodyColor =
      bodyColors[
      seed % bodyColors.length
      ];

    const width =
      0.38 +
      (seed % 3) * 0.055;

    const height =
      0.28 +
      (seed % 2) * 0.05;

    const depth =
      0.40 +
      (seed % 2) * 0.05;

    box(
      depth,
      height,
      width,
      mat(bodyColor, 0.98),
      facadeX +
      dir * (0.34 + depth / 2),
      y -
      0.48 -
      (seed % 2) * 0.08,
      z +
      (
        seed % 2 === 0
          ? 0.28
          : -0.28
      ),
      g
    );

    const grilleX =
      facadeX +
      dir *
      (
        0.34 +
        depth +
        0.012
      );

    box(
      0.018,
      height * 0.70,
      width * 0.72,
      mat(
        seed % 2 === 0
          ? 0x303431
          : 0x3e403b,
        1
      ),
      grilleX,
      y -
      0.48 -
      (seed % 2) * 0.08,
      z +
      (
        seed % 2 === 0
          ? 0.28
          : -0.28
      ),
      g
    );

    for (
      let i = -2;
      i <= 2;
      i++
    ) {
      box(
        0.020,
        0.012,
        width * 0.58,
        mat(0x5b5d57, 1),
        grilleX +
        dir * 0.012,
        y -
        0.48 -
        (seed % 2) * 0.08 +
        i * 0.045,
        z +
        (
          seed % 2 === 0
            ? 0.28
            : -0.28
        ),
        g
      );
    }

    if (seed % 3 !== 0) {
      box(
        depth * 0.72,
        0.025,
        0.04,
        mat(0x41443f, 1),
        facadeX +
        dir * (0.32 + depth / 2),
        y -
        0.72,
        z +
        (
          seed % 2 === 0
            ? 0.10
            : -0.10
        ),
        g
      );
    }
  }

  function createBlankSideWallWeathering() {
    const targets = [
      LEFT_BUILDINGS[0],
      RIGHT_BUILDINGS[0]
    ];

    targets.forEach(
      (building, index) => {
        if (
          !building ||
          !building._group
        ) {
          return;
        }

        const dark =
          new THREE.MeshBasicMaterial({
            color: 0x4f483f,
            transparent: true,
            opacity: 0.08,
            depthWrite: false
          });

        for (
          let i = 0;
          i < 4;
          i++
        ) {
          const mark =
            new THREE.Mesh(
              new THREE.PlaneGeometry(
                0.16 +
                i * 0.05,
                1.2 +
                i * 0.35
              ),
              dark
            );

          mark.position.set(
            index === 0
              ? -0.8 + i * 0.35
              : 0.8 - i * 0.35,
            3.3 + i * 1.15,
            -building.depth / 2 - 0.045
          );

          building._group.add(mark);
        }
      }
    );
  }


  // ============================================================
  // ANTENNAS
  // ============================================================

  function createAntenna(
    x,
    y,
    z,
    parent
  ) {
    const metal =
      mat(0x484a46);


    box(
      0.045,
      1.4,
      0.045,
      metal,
      x,
      y + 0.7,
      z,
      parent
    );


    box(
      0.9,
      0.035,
      0.035,
      metal,
      x,
      y + 1.18,
      z,
      parent
    );


    for (
      let i = -3;
      i <= 3;
      i++
    ) {
      box(
        0.025,
        0.36,
        0.025,
        metal,
        x + i * 0.13,
        y + 1.18,
        z,
        parent
      );
    }
  }


  function makeSignTexture(
    text,
    bg,
    fg,
    vertical = false,
    smallText = ""
  ) {
    const canvas = document.createElement("canvas");

    canvas.width = vertical ? 360 : 1000;
    canvas.height = vertical ? 900 : 360;

    const ctx = canvas.getContext("2d");

    let hash = 0;

    for (let i = 0; i < text.length; i++) {
      hash =
        (
          hash * 31 +
          text.charCodeAt(i)
        ) >>> 0;
    }

    const style = hash % 6;

    ctx.fillStyle = bg;
    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    // 01 褪色底層

    const fade =
      ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );

    fade.addColorStop(
      0,
      "rgba(255,240,205,0.12)"
    );

    fade.addColorStop(
      0.48,
      "rgba(255,255,255,0)"
    );

    fade.addColorStop(
      1,
      "rgba(52,34,24,0.18)"
    );

    ctx.fillStyle = fade;

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    // 02 六種不同招牌邊框

    if (style === 0) {
      ctx.strokeStyle = "#45382c";
      ctx.lineWidth = vertical ? 13 : 12;

      ctx.strokeRect(
        10,
        10,
        canvas.width - 20,
        canvas.height - 20
      );

      ctx.strokeStyle =
        "rgba(224,190,125,0.72)";

      ctx.lineWidth = 4;

      ctx.strokeRect(
        28,
        28,
        canvas.width - 56,
        canvas.height - 56
      );
    }


    if (style === 1) {
      ctx.fillStyle =
        "rgba(61,42,30,0.78)";

      ctx.fillRect(
        0,
        0,
        vertical ? 26 : canvas.width,
        vertical ? canvas.height : 34
      );

      ctx.fillRect(
        vertical
          ? canvas.width - 26
          : 0,

        vertical
          ? 0
          : canvas.height - 34,

        vertical
          ? 26
          : canvas.width,

        vertical
          ? canvas.height
          : 34
      );

      ctx.strokeStyle = "#40352b";
      ctx.lineWidth = 7;

      ctx.strokeRect(
        14,
        14,
        canvas.width - 28,
        canvas.height - 28
      );
    }


    if (style === 2) {
      ctx.strokeStyle = "#6e321f";
      ctx.lineWidth = 18;

      ctx.strokeRect(
        9,
        9,
        canvas.width - 18,
        canvas.height - 18
      );

      ctx.strokeStyle = "#d8bd7b";
      ctx.lineWidth = 4;

      ctx.strokeRect(
        34,
        34,
        canvas.width - 68,
        canvas.height - 68
      );
    }


    if (style === 3) {
      ctx.fillStyle =
        "rgba(40,48,42,0.28)";

      if (vertical) {
        ctx.fillRect(
          0,
          0,
          canvas.width * 0.26,
          canvas.height
        );
      } else {
        ctx.fillRect(
          0,
          0,
          canvas.width,
          canvas.height * 0.20
        );
      }

      ctx.strokeStyle = "#3e382f";
      ctx.lineWidth = 9;

      ctx.strokeRect(
        12,
        12,
        canvas.width - 24,
        canvas.height - 24
      );
    }


    if (style === 4) {
      ctx.strokeStyle = "#332f28";
      ctx.lineWidth = 7;

      ctx.strokeRect(
        9,
        9,
        canvas.width - 18,
        canvas.height - 18
      );

      ctx.strokeStyle =
        "rgba(126,49,40,0.70)";

      ctx.lineWidth = 12;

      if (vertical) {
        ctx.beginPath();

        ctx.moveTo(
          canvas.width - 35,
          30
        );

        ctx.lineTo(
          canvas.width - 35,
          canvas.height - 30
        );

        ctx.stroke();
      } else {
        ctx.beginPath();

        ctx.moveTo(
          32,
          canvas.height - 46
        );

        ctx.lineTo(
          canvas.width - 32,
          canvas.height - 46
        );

        ctx.stroke();
      }
    }


    if (style === 5) {
      ctx.strokeStyle = "#3f382e";
      ctx.lineWidth = 10;

      ctx.strokeRect(
        12,
        12,
        canvas.width - 24,
        canvas.height - 24
      );

      ctx.fillStyle =
        "rgba(117,42,34,0.32)";

      if (!vertical) {
        ctx.fillRect(
          26,
          24,
          110,
          canvas.height - 48
        );
      }
    }


    // 03 主文字

    ctx.fillStyle = fg;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (vertical) {
      const chars = [...text];

      let fontSize =
        chars.length <= 2
          ? 158
          : chars.length === 3
            ? 132
            : chars.length === 4
              ? 112
              : 94;

      ctx.font =
        `900 ${fontSize}px "Microsoft JhengHei","Noto Sans TC",sans-serif`;

      const topMargin =
        smallText ? 72 : 55;

      const bottomMargin =
        smallText ? 155 : 65;

      const availableHeight =
        canvas.height -
        topMargin -
        bottomMargin;

      const step =
        availableHeight /
        chars.length;

      chars.forEach(
        (char, index) => {

          ctx.fillText(
            char,
            canvas.width / 2,
            topMargin +
            step *
            (
              index +
              0.5
            )
          );
        }
      );
    }

    else {
      let fontSize = 150;

      if (text.length >= 4) {
        fontSize = 132;
      }

      if (text.length >= 5) {
        fontSize = 116;
      }

      if (text.length >= 7) {
        fontSize = 96;
      }

      if (text.length >= 9) {
        fontSize = 78;
      }

      ctx.font =
        `900 ${fontSize}px "Microsoft JhengHei","Noto Sans TC",sans-serif`;

      const mainY =
        smallText
          ? canvas.height * 0.40
          : canvas.height * 0.50;

      ctx.fillText(
        text,
        canvas.width / 2,
        mainY
      );
    }


    // 04 英文 / 電話 / 副標

    if (smallText) {
      ctx.fillStyle = fg;

      ctx.globalAlpha = 0.90;

      if (vertical) {
        ctx.font =
          '700 36px Arial,sans-serif';

        ctx.fillText(
          smallText,
          canvas.width / 2,
          canvas.height - 70
        );
      }

      else {
        ctx.font =
          '700 43px Arial,sans-serif';

        ctx.fillText(
          smallText,
          canvas.width / 2,
          canvas.height * 0.73
        );
      }

      ctx.globalAlpha = 1;
    }


    // 05 部分招牌增加角落印章

    if (
      !vertical &&
      (
        style === 2 ||
        style === 5
      )
    ) {
      ctx.save();

      ctx.translate(
        canvas.width * 0.12,
        canvas.height * 0.51
      );

      ctx.rotate(-0.05);

      ctx.strokeStyle =
        fg;

      ctx.globalAlpha = 0.72;

      ctx.lineWidth = 6;

      ctx.strokeRect(
        -42,
        -42,
        84,
        84
      );

      ctx.font =
        '900 47px "Microsoft JhengHei","Noto Sans TC",sans-serif';

      ctx.fillStyle = fg;

      ctx.fillText(
        "囍",
        0,
        3
      );

      ctx.restore();

      ctx.globalAlpha = 1;
    }


    // 06 部分招牌加入電話號碼感的小字

    if (
      !vertical &&
      !smallText &&
      style === 1
    ) {
      ctx.globalAlpha = 0.74;

      ctx.font =
        '700 31px Arial,sans-serif';

      ctx.fillStyle = fg;

      const number =
        "2" +
        String(
          8100000 +
          (hash % 899999)
        );

      ctx.fillText(
        number,
        canvas.width / 2,
        canvas.height * 0.76
      );

      ctx.globalAlpha = 1;
    }


    // 07 表面污漬

    for (let i = 0; i < 85; i++) {
      const x =
        (
          Math.sin(
            i * 15.83 +
            hash * 0.001
          ) *
          0.5 +
          0.5
        ) *
        canvas.width;

      const y =
        (
          Math.sin(
            i * 28.11 +
            1.7 +
            hash * 0.002
          ) *
          0.5 +
          0.5
        ) *
        canvas.height;

      const w =
        4 +
        (i % 6) * 8;

      const h =
        2 +
        (i % 4) * 3;

      ctx.fillStyle =
        i % 3 === 0
          ? "rgba(46,35,27,0.065)"
          : "rgba(246,225,185,0.050)";

      ctx.fillRect(
        x,
        y,
        w,
        h
      );
    }


    // 08 垂直雨痕

    for (let i = 0; i < 5; i++) {
      const x =
        (
          (
            hash +
            i * 137
          ) %
          canvas.width
        );

      const gradient =
        ctx.createLinearGradient(
          x,
          0,
          x + 8,
          canvas.height
        );

      gradient.addColorStop(
        0,
        "rgba(255,235,195,0)"
      );

      gradient.addColorStop(
        0.35,
        "rgba(255,235,195,0.055)"
      );

      gradient.addColorStop(
        1,
        "rgba(45,31,23,0.035)"
      );

      ctx.fillStyle = gradient;

      ctx.fillRect(
        x,
        0,
        5 + i * 2,
        canvas.height
      );
    }


    // 09 邊緣舊化

    ctx.strokeStyle =
      "rgba(42,34,27,0.25)";

    ctx.lineWidth =
      vertical ? 13 : 10;

    ctx.strokeRect(
      8,
      8,
      canvas.width - 16,
      canvas.height - 16
    );


    // 10 幾個小掉漆

    for (let i = 0; i < 18; i++) {
      const x =
        (
          (
            hash * 7 +
            i * 89
          ) %
          canvas.width
        );

      const y =
        (
          (
            hash * 3 +
            i * 53
          ) %
          canvas.height
        );

      ctx.fillStyle =
        "rgba(214,196,161,0.14)";

      ctx.fillRect(
        x,
        y,
        8 + (i % 4) * 6,
        3 + (i % 3) * 3
      );
    }


    const texture =
      new THREE.CanvasTexture(canvas);

    texture.encoding =
      THREE.sRGBEncoding;

    texture.needsUpdate = true;

    return texture;
  }

  function createOuterWallText(
    building,
    text,
    color = "#74382f",
    scale = 1
  ) {
    if (!building || !building._group) return;

    const canvas = document.createElement("canvas");

    canvas.width = 420;
    canvas.height = 1100;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    const chars = [...text];

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font =
      '900 145px "Microsoft JhengHei","Noto Sans TC",sans-serif';

    ctx.fillStyle = color;

    const startY = 180;
    const gap = 240;

    chars.forEach((char, i) => {
      ctx.fillText(
        char,
        canvas.width / 2,
        startY + i * gap
      );
    });

    // 轻微掉漆
    ctx.globalCompositeOperation =
      "destination-out";

    for (let i = 0; i < 45; i++) {

      const x =
        (i * 79 + 37) %
        canvas.width;

      const y =
        (i * 137 + 71) %
        canvas.height;

      ctx.globalAlpha =
        0.06 +
        (i % 4) * 0.025;

      ctx.fillRect(
        x,
        y,
        8 + (i % 5) * 6,
        3 + (i % 3) * 4
      );
    }

    ctx.globalCompositeOperation =
      "source-over";

    ctx.globalAlpha = 1;

    const texture =
      new THREE.CanvasTexture(canvas);

    texture.encoding =
      THREE.sRGBEncoding;

    texture.needsUpdate = true;

    const material =
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.90,
        depthWrite: false,
        depthTest: true,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -5,
        polygonOffsetUnits: -5
      });

    const plane =
      new THREE.Mesh(
        new THREE.PlaneGeometry(
          1.9 * scale,
          5.5 * scale
        ),
        material
      );

    const side = building._side;

    plane.position.set(
      building._outerX +
      (side === "left" ? -0.07 : 0.07),
      5.15,
      -0.25
    );

    plane.rotation.y =
      side === "left"
        ? Math.PI / 2
        : -Math.PI / 2;

    plane.renderOrder = 60;

    building._group.add(plane);
  }

  function createWallText() {

    createVerticalWallText(
      RIGHT_BUILDINGS[2],
      "美華地產",
      "#794238",
      1.35
    );

    createVerticalWallText(
      LEFT_BUILDINGS[4],
      "印刷",
      "#6f4037",
      1.25
    );
  }

  function createVerticalWallText(
    building,
    text,
    color,
    scale = 1
  ) {

    if (!building || !building._group) return;

    const canvas = document.createElement("canvas");

    canvas.width = 256;
    canvas.height = 768;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.fillStyle = color;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font =
      '900 82px "Microsoft JhengHei", "Noto Sans TC", sans-serif';

    const chars = [...text];

    const spacing =
      canvas.height /
      (chars.length + 1);

    chars.forEach((char, index) => {

      ctx.fillText(
        char,
        canvas.width / 2,
        spacing * (index + 1)
      );

    });

    // 輕微褪色效果
    for (let i = 0; i < 60; i++) {

      ctx.fillStyle =
        `rgba(220,205,180,${Math.random() * 0.08})`;

      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        3 + Math.random() * 8,
        2 + Math.random() * 5
      );

    }

    const texture =
      new THREE.CanvasTexture(canvas);

    texture.encoding =
      THREE.sRGBEncoding;

    texture.needsUpdate = true;

    const material =
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide
      });

    const plane =
      new THREE.Mesh(
        new THREE.PlaneGeometry(
          1.05 * scale,
          3.5 * scale
        ),
        material
      );

    const side =
      building._side;

    const dir =
      side === "left"
        ? 1
        : -1;

    // 直接加入該棟樓的 Group
    // 這樣會跟著樓的彎曲角度一起旋轉
    plane.position.set(
      building._facadeX + dir * 0.035,
      5.5,
      -0.55
    );

    plane.rotation.y =
      side === "left"
        ? Math.PI / 2
        : -Math.PI / 2;

    building._group.add(plane);
  }

  function createProjectingSign({
    building,
    y,
    zOffset = 0,
    text,
    vertical = false,
    bg = "#a02e28",
    fg = "#eee0bd",
    length = 2.2,
    smallText = ""
  }) {

    if (
      text === "華藝裝修" ||
      text === "修裝藝華" ||
      text === "嘉利時錶公司" ||
      text === "健生辦行"
    ) {
      return;
    }

    if (!building || !building._group) return;

    const group = building._group;
    const side = building._side;

    // 朝向街道
    const dir = side === "left" ? 1 : -1;

    const wallX = building._facadeX;


    // ============================================================
    // 1. SIGN SIZE
    // ============================================================

    // 不再全部做得差不多大
    // 橫牌突出距離明顯增加
    const signLength = vertical
      ? 1.05
      : length;

    const signHeight = vertical
      ? 2.55 + Math.min(text.length, 5) * 0.14
      : (
        length >= 2.8
          ? 1.22
          : length >= 2.1
            ? 0.94
            : length >= 1.5
              ? 0.76
              : 0.62
      );

    let signHash = 0;

    for (let i = 0; i < text.length; i++) {
      signHash =
        (
          signHash * 31 +
          text.charCodeAt(i)
        ) >>> 0;
    }

    const signDepth =
      vertical
        ? 0.12 + (signHash % 3) * 0.025
        : 0.10 + (signHash % 4) * 0.022;


    // ============================================================
    // 2. TEXTURE
    // ============================================================

    const texture = makeSignTexture(
      text,
      bg,
      fg,
      vertical,
      smallText
    );


    // ============================================================
    // 3. MATERIAL
    // ============================================================

    const edgeColors = [
      0x3b342d,
      0x594637,
      0x71352d,
      0x344039,
      0x6d624f
    ];

    const edgeMat =
      new THREE.MeshStandardMaterial({
        color:
          edgeColors[
          signHash %
          edgeColors.length
          ],
        roughness: 0.97,
        metalness:
          signHash % 3 === 0
            ? 0.22
            : 0.08
      });

    const faceMat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.98,
      metalness: 0.0
    });


    // ============================================================
    // 4. SIGN BOARD
    //
    // 關鍵：
    // X = 從牆伸向街道
    // Y = 高度
    // Z = 薄度
    //
    // 不要 rotation.y = Math.PI / 2
    // ============================================================

    const board = new THREE.Mesh(
      new THREE.BoxGeometry(
        signLength,
        signHeight,
        signDepth
      ),
      [
        edgeMat,
        edgeMat,
        edgeMat,
        edgeMat,
        faceMat,
        faceMat
      ]
    );


    const projectionBoost =
      signLength >= 2.8
        ? 0.55
        : signLength >= 2.0
          ? 0.32
          : 0.14;

    board.position.set(
      wallX +
      dir *
      (
        signLength / 2 +
        0.08 +
        projectionBoost
      ),
      y,
      zOffset
    );


    // ============================================================
    // 5. OLD SIGN IMPERFECTION
    // ============================================================

    // 不要每一塊都像 CAD 對齊
    const seed =
      Math.sin(
        y * 11.31 +
        zOffset * 37.17 +
        text.length * 7.23
      );

    board.rotation.z =
      seed * 0.018;

    board.rotation.y =
      seed * 0.010;

    board.castShadow = true;
    board.receiveShadow = true;

    group.add(board);


    // ============================================================
    // 6. OLD METAL SUPPORT
    // ============================================================

    const supportMat =
      new THREE.MeshStandardMaterial({
        color: 0x34332f,
        roughness: 0.97,
        metalness: 0.20
      });


    // ------------------------------------------------------------
    // 牆面固定豎杆
    // ------------------------------------------------------------

    const wallPost = new THREE.Mesh(
      new THREE.BoxGeometry(
        0.055,
        signHeight + 0.30,
        0.055
      ),
      supportMat
    );

    wallPost.position.set(
      wallX + dir * 0.04,
      y,
      zOffset
    );

    group.add(wallPost);


    const supportLength =
      signLength +
      projectionBoost;

    const armYs = [
      y - signHeight * 0.37,
      y + signHeight * 0.37
    ];

    armYs.forEach((armY) => {

      const arm = new THREE.Mesh(
        new THREE.BoxGeometry(
          supportLength + 0.12,
          0.045,
          0.045
        ),
        supportMat
      );

      arm.position.set(
        wallX +
        dir *
        (
          supportLength / 2
        ),

        armY,

        zOffset
      );

      group.add(arm);

    });


    // ------------------------------------------------------------
    // 招牌最外端豎杆
    // ------------------------------------------------------------

    const outerPost = new THREE.Mesh(
      new THREE.BoxGeometry(
        0.05,
        signHeight + 0.12,
        0.05
      ),
      supportMat
    );

    outerPost.position.set(
      wallX +
      dir *
      supportLength,

      y,

      zOffset
    );

    group.add(outerPost);


    // ============================================================
    // 7. DIAGONAL BRACE
    //
    // 圖二那種老香港鐵架感的重要來源
    // ============================================================

    const braceLength =
      Math.sqrt(
        signLength * signLength +
        0.55 * 0.55
      );

    const brace = new THREE.Mesh(
      new THREE.BoxGeometry(
        braceLength,
        0.035,
        0.035
      ),
      supportMat
    );

    brace.position.set(
      wallX +
      dir *
      signLength * 0.50,

      y +
      signHeight * 0.46 +
      0.27,

      zOffset
    );

    brace.rotation.z =
      dir *
      Math.atan2(
        0.55,
        signLength
      );

    group.add(brace);


    // ============================================================
    // 8. LARGE SIGN — EXTRA FRAME
    // ============================================================

    if (!vertical && length >= 2.6) {

      // 大牌再增加一條斜撐
      const brace2 = new THREE.Mesh(
        new THREE.BoxGeometry(
          braceLength,
          0.035,
          0.035
        ),
        supportMat
      );

      brace2.position.set(
        wallX +
        dir *
        signLength * 0.50,

        y -
        signHeight * 0.46 -
        0.22,

        zOffset
      );

      brace2.rotation.z =
        -dir *
        Math.atan2(
          0.48,
          signLength
        );

      group.add(brace2);
    }
  }

  function createFacadeSign({
    building,
    y,
    zOffset = 0,
    text,
    bg = "#ded0ad",
    fg = "#8f3029",
    width = 1.8,
    height = 0.52,
    smallText = ""
  }) {
    if (!building || !building._group) return;

    const group = building._group;
    const side = building._side;
    const dir = side === "left" ? 1 : -1;

    const texture = makeSignTexture(
      text,
      bg,
      fg,
      false,
      smallText
    );

    const material =
      new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.96
      });

    const frameMat =
      mat(0x423a31, 0.96);

    const sign = box(
      0.07,
      height,
      width,
      material,
      building._facadeX + dir * 0.08,
      y,
      zOffset,
      group
    );

    const top = box(
      0.09,
      0.045,
      width + 0.12,
      frameMat,
      building._facadeX + dir * 0.10,
      y + height / 2,
      zOffset,
      group
    );

    const bottom = box(
      0.09,
      0.045,
      width + 0.12,
      frameMat,
      building._facadeX + dir * 0.10,
      y - height / 2,
      zOffset,
      group
    );

    sign.castShadow = true;
  }

  function createSquareProjectingSign({
    building,
    y,
    zOffset = 0,
    text,
    bg = "#263d38",
    fg = "#e4c96f",
    size = 1.25,
    smallText = ""
  }) {
    if (!building || !building._group) return;

    const group = building._group;
    const side = building._side;
    const dir = side === "left" ? 1 : -1;
    const wallX = building._facadeX;

    const canvas =
      document.createElement("canvas");

    canvas.width = 512;
    canvas.height = 512;

    const ctx =
      canvas.getContext("2d");

    ctx.fillStyle = bg;
    ctx.fillRect(
      0,
      0,
      512,
      512
    );

    ctx.strokeStyle = "#44392d";
    ctx.lineWidth = 18;

    ctx.strokeRect(
      14,
      14,
      484,
      484
    );

    ctx.fillStyle = fg;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font =
      '900 150px "Microsoft JhengHei","Noto Sans TC",sans-serif';

    ctx.fillText(
      text,
      256,
      smallText ? 215 : 256
    );

    if (smallText) {
      ctx.font =
        '700 44px Arial,sans-serif';

      ctx.fillText(
        smallText,
        256,
        340
      );
    }

    const texture =
      new THREE.CanvasTexture(canvas);

    texture.encoding =
      THREE.sRGBEncoding;

    const faceMat =
      new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.93
      });

    const edgeMat =
      mat(0x34332f, 0.96);

    const board =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          size,
          size,
          0.13
        ),
        [
          edgeMat,
          edgeMat,
          edgeMat,
          edgeMat,
          faceMat,
          faceMat
        ]
      );

    board.position.set(
      wallX + dir * (size / 2 + 0.08),
      y,
      zOffset
    );

    board.castShadow = true;

    group.add(board);

    // 上下支架
    [-0.38, 0.38].forEach(
      offsetY => {

        const arm =
          box(
            size + 0.14,
            0.045,
            0.045,
            edgeMat,
            wallX + dir * size / 2,
            y + offsetY,
            zOffset,
            group
          );
      }
    );

    const outer =
      box(
        0.045,
        size + 0.12,
        0.045,
        edgeMat,
        wallX + dir * size,
        y,
        zOffset,
        group
      );
  }


  // ============================================================
  // WALL SIGN
  // ============================================================

  function createWallSign({
    side,
    z,
    y,
    text,
    bg,
    fg,
    width = 2.3,
    height = 0.75
  }) {
    const facadeX =
      side === "left"
        ? -5.20
        : 5.20;

    const dir =
      side === "left"
        ? 1
        : -1;


    const texture =
      makeSignTexture(
        text,
        bg,
        fg,
        false
      );


    const material =
      new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
      });


    const sign =
      box(
        0.08,
        height,
        width,
        material,
        facadeX +
        dir * 0.27,
        y,
        z
      );

    sign.castShadow = true;
  }


  function getBuildingFrontX(side, z) {
    const buildings =
      side === "left"
        ? LEFT_BUILDINGS
        : RIGHT_BUILDINGS;

    let nearest = buildings[0];
    let minDistance = Infinity;

    buildings.forEach((building) => {
      const distance = Math.abs(building.z - z);

      if (distance < minDistance) {
        minDistance = distance;
        nearest = building;
      }
    });

    return nearest.frontX;
  }

  function makeLandmarkTexture(kind) {
    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 540;

    const ctx = canvas.getContext("2d");

    const cream = "#efe6d3";
    const red = "#aa3028";
    const ink = "#242c2d";

    ctx.fillStyle = kind === "express" ? "#b63329" : cream;
    ctx.fillRect(0, 0, 1600, 540);

    ctx.strokeStyle = kind === "express" ? cream : "#685445";
    ctx.lineWidth = 14;
    ctx.strokeRect(10, 10, 1580, 520);

    ctx.lineWidth = 4;
    ctx.strokeRect(34, 34, 1532, 472);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (kind === "express") {
      ctx.fillStyle = cream;
      ctx.font =
        '900 202px "Noto Serif CJK TC","PMingLiU",serif';
      ctx.fillText("健生辦行", 800, 186, 1400);

      ctx.fillStyle = cream;
      ctx.fillRect(70, 296, 1460, 176);

      ctx.fillStyle = red;
      ctx.font = "italic 900 152px Arial,sans-serif";
      ctx.fillText("EXPRESS", 800, 385);
    } else if (kind === "watch") {
      ctx.fillStyle = red;
      ctx.fillRect(56, 103, 186, 195);

      ctx.fillStyle = cream;
      ctx.font =
        '900 143px "Noto Serif CJK TC","PMingLiU",serif';
      ctx.fillText("嘉", 149, 207);

      ctx.fillStyle = red;
      ctx.font =
        '900 183px "Noto Serif CJK TC","PMingLiU",serif';
      ctx.fillText("嘉利時錶公司", 915, 220, 1250);

      ctx.fillStyle = ink;
      ctx.font = "800 74px Arial,sans-serif";
      ctx.fillText(
        "CRALY COMPANY · SPORT WATCHES",
        870,
        402,
        1270
      );
    } else {
      ctx.fillStyle = red;
      ctx.font =
        '900 248px "Noto Serif CJK TC","PMingLiU",serif';
      ctx.fillText("華藝裝修", 800, 223, 1460);

      ctx.font = "800 72px Arial,sans-serif";
      ctx.fillText(
        "歡迎電話查詢  2833 1955",
        800,
        401,
        1400
      );
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.encoding = THREE.sRGBEncoding;
    texture.needsUpdate = true;

    return texture;
  }

  function createVisualLandmarks() {
    const L = LEFT_BUILDINGS;
    const R = RIGHT_BUILDINGS;

    const iron = new THREE.MeshStandardMaterial({
      color: 0x383b38,
      metalness: 0.45,
      roughness: 0.82
    });

    function beam(group, a, b, thickness = 0.05) {
      const start = new THREE.Vector3(...a);
      const end = new THREE.Vector3(...b);
      const direction = new THREE.Vector3().subVectors(end, start);

      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(direction.length(), thickness, thickness),
        iron
      );

      mesh.position.copy(start).add(end).multiplyScalar(0.5);
      mesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(1, 0, 0),
        direction.normalize()
      );
      group.add(mesh);
    }

    // 為後排招牌繪製不同的底色、邊框與字體。
    // 不再使用舊版所有小牌共用的版式。
    function signTexture(title, subtitle, style = "paper") {
      const vertical = style === "verticalRed" ||
        style === "verticalCream";

      const canvas = document.createElement("canvas");
      canvas.width = vertical ? 480 : 1200;
      canvas.height = vertical ? 1050 : 470;

      const ctx = canvas.getContext("2d");
      const w = canvas.width;
      const h = canvas.height;

      const styles = {
        paper: {
          bg: "#e8dec5",
          text: "#992f29",
          border: "#544b3c"
        },
        red: {
          bg: "#a2322c",
          text: "#f1deb7",
          border: "#57312c"
        },
        green: {
          bg: "#304b42",
          text: "#e9d6a8",
          border: "#a18b61"
        },
        yellow: {
          bg: "#d1ac66",
          text: "#8c302a",
          border: "#77553d"
        },
        verticalRed: {
          bg: "#a12d29",
          text: "#f3dca8",
          border: "#69312c"
        },
        verticalCream: {
          bg: "#eadcba",
          text: "#982e28",
          border: "#725742"
        }
      };

      const colors = styles[style] || styles.paper;

      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = colors.border;
      ctx.lineWidth = vertical ? 19 : 14;
      ctx.strokeRect(12, 12, w - 24, h - 24);

      ctx.lineWidth = vertical ? 5 : 4;
      ctx.strokeRect(35, 35, w - 70, h - 70);

      ctx.fillStyle = colors.text;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (vertical) {
        const characters = [...title];
        const spacing = Math.min(190, 690 / characters.length);
        const firstY = (h - spacing * (characters.length - 1)) / 2;

        ctx.font =
          '900 165px "Noto Serif CJK TC","PMingLiU",serif';

        characters.forEach((character, i) => {
          ctx.fillText(character, w / 2, firstY + i * spacing);
        });
      } else {
        ctx.font =
          '900 155px "Noto Serif CJK TC","PMingLiU",serif';
        ctx.fillText(title, w / 2, subtitle ? 188 : 230, w - 105);

        if (subtitle) {
          ctx.font = "800 58px Arial, sans-serif";
          ctx.fillText(subtitle, w / 2, 345, w - 105);
        }
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.encoding = THREE.sRGBEncoding;
      texture.needsUpdate = true;
      return texture;
    }

    function bigMTexture() {
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 760;
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#26343a";
      ctx.fillRect(0, 0, 640, 760);
      ctx.strokeStyle = "#b3a384";
      ctx.lineWidth = 13;
      ctx.strokeRect(16, 16, 608, 728);

      [
        [108, 78, "#e1d19c"],
        [242, 78, "#859a90"],
        [376, 78, "#ba7180"],
        [108, 188, "#ede5d1"],
        [242, 188, "#d3ad68"],
        [376, 188, "#788ea5"]
      ].forEach(([x, y, color]) => {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 124, 102);
      });

      ctx.textAlign = "center";
      ctx.fillStyle = "#f1eadb";
      ctx.font = "900 116px Arial, sans-serif";
      ctx.fillText("BIG M", 320, 455);
      ctx.font = '700 40px "Noto Sans TC",sans-serif';
      ctx.fillText("廣 告 百 貨", 320, 510);

      ctx.fillStyle = "#ede7d8";
      ctx.fillRect(43, 557, 554, 126);
      ctx.fillStyle = "#28343a";
      ctx.font = "900 89px Arial, sans-serif";
      ctx.fillText("28611363", 320, 652);

      const texture = new THREE.CanvasTexture(canvas);
      texture.encoding = THREE.sRGBEncoding;
      texture.needsUpdate = true;
      return texture;
    }

    function weatherSign(original) {
      const image = original && original.image;
      if (!image || !image.width || !image.height) return original;

      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;

      const c = canvas.getContext("2d");
      const w = canvas.width;
      const h = canvas.height;
      c.drawImage(image, 0, 0, w, h);

      // 固定亂數：重新整理後污痕不會亂跳。
      let seed = (w * 131 + h * 37) >>> 0;
      const random = () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296;
      };

      // 輕微泛黃和不均勻積塵，不遮住主要文字。
      const wash = c.createLinearGradient(0, 0, w, h);
      wash.addColorStop(0, "rgba(113,78,42,0.035)");
      wash.addColorStop(0.56, "rgba(255,246,217,0)");
      wash.addColorStop(1, "rgba(68,53,39,0.09)");
      c.fillStyle = wash;
      c.fillRect(0, 0, w, h);

      // 掉漆主要集中在四邊。
      for (let i = 0; i < 115; i++) {
        const onEdge = random() < 0.77;
        const x = onEdge
          ? (random() < 0.5 ? random() * 75 : w - random() * 75)
          : random() * w;
        const y = onEdge
          ? (random() < 0.5 ? random() * 55 : h - random() * 55)
          : random() * h;

        c.fillStyle = random() < 0.5
          ? "rgba(59,49,41,0.12)"
          : "rgba(243,228,196,0.22)";

        c.fillRect(x, y, 2 + random() * 15, 1 + random() * 5);
      }

      // 少量向下流的雨痕。
      for (let i = 0; i < 13; i++) {
        const x = random() * w;
        const y = random() * h * 0.38;
        c.strokeStyle = "rgba(66,57,47,0.045)";
        c.lineWidth = 1 + random() * 5;
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(x + random() * 12, y + 45 + random() * 170);
        c.stroke();
      }

      const result = new THREE.CanvasTexture(canvas);
      result.encoding = THREE.sRGBEncoding;
      result.anisotropy = 8;
      result.needsUpdate = true;
      return result;
    }

    function board(building, {
      width,
      height,
      y,
      z = 0,
      projection = 0.12,
      texture,
      outerWall = false,
      frameColor = 0x50483d
    }) {
      if (!building || !building._group) return;

      const group = building._group;

      // 普通招牌：從兩側朝街心伸出。
      // outerWall：只給右前樓鐘錶牌使用，改從外牆向畫面右側伸出。
      const dir = outerWall
        ? 1
        : building._side === "left" ? 1 : -1;

      const wallX = outerWall
        ? building.depth - 0.02
        : building._facadeX;

      const innerX = wallX + dir * projection;
      const outerX = innerX + dir * width;
      const centerX = (innerX + outerX) / 2;

      texture = weatherSign(texture);
      const face = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.88,
        metalness: 0.02,
        side: THREE.DoubleSide
      });

      const edge = new THREE.MeshStandardMaterial({
        color: frameColor,
        metalness: 0.20,
        roughness: 0.82
      });

      const sign = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, 0.30),
        [edge, edge, edge, edge, face, face]
      );

      // 右前樓的棕色側牆：牆面位於局部座標 z = d / 2。
      // 招牌直接貼牆，而不是從牆邊向畫面右方飛出去。
      if (outerWall) {
        const wallZ = building.d / 2 + 0.105;

        sign.position.set(
          building.depth / 2,
          y,
          wallZ
        );
        sign.castShadow = true;
        group.add(sign);

        beam(
          group,
          [0.16, y + height / 2 + 0.09, wallZ + 0.035],
          [building.depth - 0.16, y + height / 2 + 0.09, wallZ + 0.035],
          0.04
        );

        return;
      }
      sign.position.set(centerX, y, z);
      sign.castShadow = true;
      group.add(sign);
      // 大牌才加立體金屬包邊；小牌維持較薄的搪瓷板。
      if (width >= 2.45 && height >= 0.95) {
        const rimDepth = 0.39;

        box(
          width + 0.12, 0.075, rimDepth,
          edge,
          centerX, y + height / 2, z,
          group
        );
        box(
          width + 0.12, 0.075, rimDepth,
          edge,
          centerX, y - height / 2, z,
          group
        );
        box(
          0.075, height + 0.12, rimDepth,
          edge,
          centerX - width / 2, y, z,
          group
        );
        box(
          0.075, height + 0.12, rimDepth,
          edge,
          centerX + width / 2, y, z,
          group
        );
      }

      const top = y + height / 2 + 0.17;
      const bottom = y - height / 2 - 0.13;

      beam(group, [wallX, top, z], [outerX + dir * 0.08, top, z]);
      beam(group, [wallX, bottom, z], [outerX, bottom, z], 0.04);
      beam(group, [wallX, bottom - 0.43, z], [centerX, top, z], 0.045);
      beam(group, [wallX, bottom - 0.43, z], [wallX, top, z], 0.055);
    }

    // 01｜左側主牌：仍屬於萬興紙業後面一棟，
    // 但整組向街心移，令招牌在畫面中更突出。
    board(L[L.length - 2], {
      width: 4.35,
      height: 1.53,
      y: 9.72,
      z: 0.12,
      projection: 2.65,
      texture: makeLandmarkTexture("print")
    });

    board(L[L.length - 2], {
      width: 3.45,
      height: 1.22,
      y: 7.48,
      z: 0.55,
      projection: 2.32,
      texture: makeLandmarkTexture("express"),
      frameColor: 0x67372f
    });

    // 02｜右側主牌：BIG M 向街心移；
    // 嘉利時錶繼續貼在右前樓棕色牆面上。
    board(R[R.length - 3], {
      width: 2.35,
      height: 2.70,
      y: 9.35,
      z: 0.30,
      projection: 2.72,
      texture: bigMTexture(),
      frameColor: 0x303b3b
    });

    board(R[R.length - 1], {
      width: 2.76,
      height: 1.17,
      y: 9.42,
      outerWall: true,
      texture: makeLandmarkTexture("watch")
    });

    // 03｜逐塊設計招牌。刪除舊的 signTexture 小牌及 denseSigns 迴圈。
    // 每一款都有自己的排字、圖案與比例，不共用舊版雙線邊框模板。
    function bespokeSignTexture(kind) {
      const vertical = [
        "sealBlade", "estateBlade", "redBlade", "paperBlade"
      ].includes(kind);

      const canvas = document.createElement("canvas");
      canvas.width = vertical ? 440 : 1200;
      canvas.height = vertical ? 1100 : 520;
      const c = canvas.getContext("2d");
      const w = canvas.width;
      const h = canvas.height;

      c.textAlign = "center";
      c.textBaseline = "middle";

      function fill(color) {
        c.fillStyle = color;
        c.fillRect(0, 0, w, h);
      }

      function text(value, x, y, size, color, font = "serif", max = w - 70) {
        c.fillStyle = color;
        c.font = `900 ${size}px ${font}`;
        c.fillText(value, x, y, max);
      }

      function verticalText(value, color, size = 144) {
        const chars = [...value];
        const gap = Math.min(190, 810 / Math.max(1, chars.length - 1));
        const start = h / 2 - gap * (chars.length - 1) / 2;
        chars.forEach((char, i) => {
          text(char, w / 2, start + i * gap, size, color);
        });
      }

      switch (kind) {
        // 深紅店牌：大字偏右，左側獨立方形印章。
        case "sealHouse":
          fill("#722921");
          c.fillStyle = "#e2c494";
          c.fillRect(28, 28, 220, h - 56);
          text("囍", 138, 250, 170, "#9b3029");
          text("祥利成章", 725, 211, 148, "#f4e5c9");
          text("WEDDING PRINTING", 730, 388, 53, "#e5c79f",
            "Arial, sans-serif");
          break;

        // 奶白底黑字：手寫招牌式上下錯列，不設完整邊框。
        case "colourWorld":
          fill("#ddd6bf");
          c.fillStyle = "#ad4137";
          c.fillRect(0, 0, w, 30);
          text("彩 色 世 界", 590, 192, 147, "#303632");
          text("COLOUR WORLD", 585, 368, 83, "#a43c32",
            "Arial, sans-serif");
          c.fillStyle = "#426969";
          c.fillRect(1010, 60, 112, 112);
          c.fillStyle = "#d2ad5d";
          c.fillRect(1010, 177, 112, 112);
          break;

        // 紅色窄直牌：舊式白字，頂部金色圓章。
        case "sealBlade":
          fill("#8c2627");
          c.strokeStyle = "#d2ad69";
          c.lineWidth = 12;
          c.strokeRect(19, 19, w - 38, h - 38);
          c.fillStyle = "#d4ac6b";
          c.beginPath();
          c.arc(w / 2, 125, 63, 0, Math.PI * 2);
          c.fill();
          text("印", w / 2, 125, 88, "#832526");
          verticalText("印章開", "#f4e2bf", 146);
          break;

        // 黃底燙金：右側不規則紅色標章，左側大字。
        case "goldPrint":
          fill("#d5ae67");
          c.fillStyle = "#9d352c";
          c.fillRect(0, 0, 32, h);
          text("大華燙金", 514, 214, 161, "#873027");
          text("GOLD FOIL · HOT STAMPING", 518, 388, 57, "#493c2e",
            "Arial, sans-serif");
          c.fillStyle = "#a5382c";
          c.beginPath();
          c.arc(1048, 257, 111, 0, Math.PI * 2);
          c.fill();
          text("金", 1048, 254, 124, "#f1dcaa");
          break;

        // 淺色直牌：字體和排列不同於紅色印章牌。
        case "estateBlade":
          fill("#e6d8b9");
          c.fillStyle = "#477069";
          c.fillRect(0, 0, 26, h);
          c.fillRect(w - 26, 0, 26, h);
          verticalText("美華地產", "#9b3a31", 130);
          break;

        // 小幅紅白橫牌：大字與斜切白底形成兩層。
        case "weddingCards":
          fill("#a8342c");
          c.fillStyle = "#efe4ca";
          c.beginPath();
          c.moveTo(0, 295);
          c.lineTo(w, 195);
          c.lineTo(w, h);
          c.lineTo(0, h);
          c.fill();
          text("香港賀咭", 590, 174, 148, "#fff0d7");
          text("WEDDING CARDS", 590, 398, 72, "#913328",
            "Arial, sans-serif");
          break;

        // 深色印務牌：左側巨大的單字，右側細字。
        case "inkWorks":
          fill("#243b38");
          c.fillStyle = "#c6a65f";
          c.fillRect(0, 0, 25, h);
          text("印", 205, 252, 276, "#d4ba81");
          text("裕華印務", 800, 196, 140, "#f0ddbd");
          text("LETTERPRESS · PRINTING", 803, 365, 49, "#b3b7a8",
            "Arial, sans-serif");
          break;

        // 紙店：綠色搪瓷感，無紅白邊框。
        case "paperShop":
          fill("#37564c");
          c.fillStyle = "#d6bc83";
          c.fillRect(0, h - 65, w, 65);
          text("美利紙袋", 600, 200, 153, "#efe3c2");
          text("紙品  ·  包裝  ·  喜帖", 596, 362, 68, "#d8c795");
          break;

        // 直式金字紅牌：頂端招牌與中間字距明顯不同。
        case "redBlade":
          fill("#9d2e2b");
          c.fillStyle = "#e4c179";
          c.fillRect(0, 0, w, 35);
          text("囍", w / 2, 160, 139, "#e6c68c");
          verticalText("裕華印務", "#f6e7cb", 130);
          break;

        // 喜帖店：奶白底，紅色紙樣及黑色細字。
        case "invitation":
          fill("#eee5d2");
          c.fillStyle = "#a73731";
          c.fillRect(55, 63, 250, 388);
          text("囍", 180, 245, 165, "#f3e0bd");
          text("喜帖印刷", 749, 193, 141, "#a7342b");
          text("INVITATIONS & PAPER", 748, 359, 54, "#3d4540",
            "Arial, sans-serif");
          break;

        // 商品圖錄：牌面就是一格格不同紙品色樣。
        case "catalogue":
          fill("#ebe1ca");
          const swatches = [
            "#a53930", "#b48b55", "#36564b",
            "#e5b9a4", "#313f3d", "#c7b184"
          ];
          swatches.forEach((color, i) => {
            c.fillStyle = color;
            c.fillRect(45 + i * 115, 107, 91, 186);
          });
          text("紙 品 圖 錄", 817, 218, 99, "#37423d");
          text("PAPER · PRINT · PACK", 812, 360, 48, "#9d4034",
            "Arial, sans-serif");
          break;

        // 窄直紙牌：黃褐底、黑字，作街道深處的遠景牌。
        case "paperBlade":
          fill("#bd9d67");
          c.fillStyle = "#453e32";
          c.fillRect(22, 22, w - 44, 13);
          verticalText("紙品印刷", "#473d34", 122);
          break;

        // 小型黑底白字：與周圍暖色牌形成明顯間隔。
        case "typeShop":
          fill("#303534");
          c.fillStyle = "#c5a76c";
          c.fillRect(40, 48, 155, h - 96);
          text("字", 118, 246, 142, "#303534");
          text("柯式印刷", 723, 195, 140, "#eee6d4");
          text("OFFSET PRINTING", 723, 361, 56, "#c9b689",
            "Arial, sans-serif");
          break;
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.encoding = THREE.sRGBEncoding;
      texture.anisotropy = 8;
      texture.needsUpdate = true;
      return texture;
    }

    // 霓虹牌使用發光筆畫和暗色底板；白天仍能看清字形。
    function neonTexture(kind) {
      // 沿用函數名稱，讓後面的 board(...) 呼叫不用改。
      // 這裏已完全移除發光、陰影和霓虹描邊。
      const vertical = [
        "redVertical", "blueVertical", "amberVertical"
      ].includes(kind);

      const canvas = document.createElement("canvas");
      canvas.width = vertical ? 480 : 1200;
      canvas.height = vertical ? 1180 : 520;

      const c = canvas.getContext("2d");
      const w = canvas.width;
      const h = canvas.height;

      c.textAlign = "center";
      c.textBaseline = "middle";

      const serif = '"PMingLiU","Songti TC","Noto Serif CJK TC",serif';
      const sans = '"Microsoft JhengHei","Noto Sans TC",Arial,sans-serif';

      function writing(value, x, y, size, color, font = serif, max = w - 70) {
        c.fillStyle = color;
        c.font = `900 ${size}px ${font}`;
        c.fillText(value, x, y, max);
      }

      function verticalWriting(value, color, size = 145) {
        const chars = [...value];
        const gap = Math.min(207, 870 / Math.max(1, chars.length - 1));
        const first = h / 2 - (chars.length - 1) * gap / 2;

        chars.forEach((char, index) => {
          writing(char, w / 2, first + index * gap,
            size, color, serif, w - 70);
        });
      }

      switch (kind) {
        // 紅字白底：大字佔滿牌面，像手繪印刷店牌。
        case "redScript":
          c.fillStyle = "#e9dfc8";
          c.fillRect(0, 0, w, h);
          c.fillStyle = "#a6332b";
          c.fillRect(0, 0, 22, h);
          c.fillRect(0, h - 45, w, 45);
          writing("喜帖印務", 605, 210, 199, "#a23029");
          writing("WEDDING PRINTING", 600, 396, 61,
            "#3c3931", "900 61px Arial", 1080);
          break;

        // 綠底金字：與旁邊紅白招牌形成差別。
        case "jade":
          c.fillStyle = "#315044";
          c.fillRect(0, 0, w, h);
          c.fillStyle = "#b99c66";
          c.fillRect(34, 31, w - 68, 10);
          writing("麗華紙業", 600, 210, 191, "#e9d4a2");
          writing("PAPER MERCHANTS", 600, 401, 58,
            "#eee3c5", sans);
          break;

        // 藍色直牌：舊搪瓷底、白字，沒有發光效果。
        case "blueVertical":
          c.fillStyle = "#334e61";
          c.fillRect(0, 0, w, h);
          c.fillStyle = "#e1d6b7";
          c.fillRect(0, 0, 24, h);
          c.fillRect(w - 24, 0, 24, h);
          verticalWriting("彩色印刷", "#f2e8cf", 153);
          break;

        // 紅色直牌：黃字及上下裝飾，不複製藍牌構圖。
        case "redVertical":
          c.fillStyle = "#9c342d";
          c.fillRect(0, 0, w, h);
          c.fillStyle = "#dfb677";
          c.fillRect(34, 30, w - 68, 24);
          c.fillRect(34, h - 54, w - 68, 24);
          verticalWriting("囍帖專門", "#f5e2ad", 151);
          break;

        // 黃底牌：橫排大字，右邊一枚紅色印章。
        case "goldArc":
          c.fillStyle = "#dbbc7b";
          c.fillRect(0, 0, w, h);
          c.fillStyle = "#8f372b";
          c.fillRect(0, 0, w, 26);
          writing("金華喜帖", 490, 211, 183, "#8d3229");
          writing("INVITATIONS", 484, 395, 66,
            "#463a31", sans);
          c.fillStyle = "#a9362d";
          c.beginPath();
          c.arc(1028, 256, 109, 0, Math.PI * 2);
          c.fill();
          writing("囍", 1028, 256, 143, "#f0ddae");
          break;

        // 白色紙牌：左方紅印、右方黑紅混排。
        case "magentaSeal":
          c.fillStyle = "#e8dfca";
          c.fillRect(0, 0, w, h);
          c.fillStyle = "#a83c31";
          c.fillRect(50, 68, 246, 378);
          writing("囍", 173, 255, 180, "#f5e9d2");
          writing("新華印刷", 749, 220, 155, "#343833");
          writing("PRINTING WORKS", 752, 385, 52,
            "#a83c31", sans);
          break;

        // 深藍商號：左方方格商標，右方粗黑體。
        case "blueShop":
          c.fillStyle = "#e5dbc2";
          c.fillRect(0, 0, w, h);

          const squares = [
            [72, 111, "#284457"],
            [171, 111, "#c57970"],
            [72, 210, "#c7a55e"],
            [171, 210, "#718b82"]
          ];

          squares.forEach(([x, y, color]) => {
            c.fillStyle = color;
            c.fillRect(x, y, 91, 91);
          });

          writing("南洋紙品", 748, 205, 169, "#304350",
            sans, 835);
          writing("PAPER & CARDS", 748, 390, 66,
            "#a43c32", sans, 835);
          break;

        // 黃褐色直牌：黑字，像老舖的油漆木牌。
        case "amberVertical":
          c.fillStyle = "#c9a86f";
          c.fillRect(0, 0, w, h);
          c.fillStyle = "#64513b";
          c.fillRect(25, 24, w - 50, 15);
          c.fillRect(25, h - 39, w - 50, 15);
          verticalWriting("燙金工藝", "#4b3e33", 148);
          break;
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.encoding = THREE.sRGBEncoding;
      texture.anisotropy = 8;
      texture.needsUpdate = true;
      return texture;
    }

    // L/R[7] 靠入口，[0] 在街道深處。
    // 懸臂牌在不同樓棟、不同高度及前後位置交錯；
    // 地舖門楣用貼牆牌填密街道下半部。

    function shopHeader(building, {
      texture, width, height = 0.65, y = 3.52, z = 0
    }) {
      if (!building || !building._group) return;

      const side = building._side;
      const direction = side === "left" ? 1 : -1;

      // 樓面朝街心的是 x 面；貼牆牌沿 z 方向展開。
      const face = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide
        })
      );

      face.rotation.y = side === "left"
        ? Math.PI / 2
        : -Math.PI / 2;

      face.position.set(
        building._facadeX + direction * 0.13,
        y,
        z
      );

      building._group.add(face);
    }

    // ── 左邊：先處理近景，讓萬興後面的鋪頭連成一排 ──
    board(L[6], {
      width: 2.65, height: 0.96, y: 5.72, z: 0.97,
      projection: 1.22,
      texture: bespokeSignTexture("colourWorld"),
      frameColor: 0x585246
    });

    board(L[5], {
      width: 2.78,
      height: 1.00,
      y: 8.54,
      z: -0.61,
      projection: 2.03,
      texture: bespokeSignTexture("sealHouse"),
      frameColor: 0x60332b
    });

    board(L[5], {
      width: 0.78, height: 2.37, y: 5.78, z: 0.78,
      projection: 0.72,
      texture: bespokeSignTexture("sealBlade"),
      frameColor: 0x672b29
    });

    board(L[4], {
      width: 2.78,
      height: 0.99,
      y: 6.30,
      z: 0.87,
      projection: 1.75,
      texture: neonTexture("redScript"),
      frameColor: 0x67483d
    });

    board(L[4], {
      width: 2.17, height: 0.77, y: 4.95, z: -0.69,
      projection: 0.72,
      texture: bespokeSignTexture("weddingCards"),
      frameColor: 0x703c31
    });

    board(L[3], {
      width: 0.72, height: 2.07, y: 6.67, z: -0.70,
      projection: 0.52,
      texture: neonTexture("blueVertical"),
      frameColor: 0x334e61
    });

    board(L[3], {
      width: 2.20, height: 0.76, y: 4.83, z: 0.71,
      projection: 0.74,
      texture: bespokeSignTexture("paperShop"),
      frameColor: 0x34483d
    });

    board(L[2], {
      width: 2.06, height: 0.73, y: 6.37, z: 0.33,
      projection: 0.46,
      texture: neonTexture("jade"),
      frameColor: 0x34483d
    });

    // 左側地舖：牌子貼在門楣，不再伸到街心遮住後方大字。
    shopHeader(L[6], {
      texture: bespokeSignTexture("paperShop"),
      width: 2.07, height: 0.58, y: 3.36, z: 0.08
    });
    shopHeader(L[5], {
      texture: bespokeSignTexture("weddingCards"),
      width: 1.85, height: 0.56, y: 3.48, z: -0.07
    });
    shopHeader(L[4], {
      texture: bespokeSignTexture("goldPrint"),
      width: 2.15, height: 0.61, y: 3.43, z: 0.04
    });
    shopHeader(L[3], {
      texture: bespokeSignTexture("typeShop"),
      width: 1.88, height: 0.57, y: 3.38, z: -0.05
    });
    shopHeader(L[2], {
      texture: bespokeSignTexture("invitation"),
      width: 1.67, height: 0.54, y: 3.40, z: 0
    });

    // ── 右邊：BIG M 上下留白，其他牌向兩側及地舖分散 ──
    board(R[6], {
      width: 2.52, height: 0.94, y: 6.09, z: 0.81,
      projection: 1.08,
      texture: bespokeSignTexture("goldPrint"),
      frameColor: 0x795438
    });

    board(R[6], {
      width: 0.76, height: 2.23, y: 4.99, z: -0.66,
      projection: 0.48,
      texture: neonTexture("redVertical"),
      frameColor: 0x602c2b
    });

    board(R[5], {
      width: 2.40, height: 0.82, y: 5.42, z: 0.75,
      projection: 0.83,
      texture: bespokeSignTexture("invitation"),
      frameColor: 0x6b5a48
    });

    board(R[5], {
      width: 0.73, height: 2.02, y: 5.00, z: -0.79,
      projection: 0.55,
      texture: bespokeSignTexture("estateBlade"),
      frameColor: 0x665444
    });

    board(R[4], {
      width: 2.70,
      height: 0.94,
      y: 7.04,
      z: 0.82,
      projection: 1.72,
      texture: neonTexture("blueShop"),
      frameColor: 0x33423d
    });

    board(R[4], {
      width: 2.21, height: 0.78, y: 4.80, z: 0.68,
      projection: 0.72,
      texture: bespokeSignTexture("inkWorks"),
      frameColor: 0x33423d
    });

    board(R[3], {
      width: 0.72, height: 2.13, y: 6.45, z: 0.54,
      projection: 0.51,
      texture: neonTexture("amberVertical"),
      frameColor: 0x65513b
    });

    board(R[3], {
      width: 2.03, height: 0.72, y: 4.55, z: -0.45,
      projection: 0.55,
      texture: neonTexture("magentaSeal"),
      frameColor: 0x6b5a48
    });

    board(R[2], {
      width: 1.98, height: 0.73, y: 6.03, z: 0.42,
      projection: 0.40,
      texture: neonTexture("goldArc"),
      frameColor: 0x574133
    });

    // 右側地舖填密：位於大牌下方，從近到遠漸小。
    shopHeader(R[6], {
      texture: bespokeSignTexture("catalogue"),
      width: 2.02, height: 0.61, y: 3.44, z: 0.02
    });
    shopHeader(R[5], {
      texture: bespokeSignTexture("paperShop"),
      width: 1.97, height: 0.56, y: 3.43, z: -0.05
    });
    shopHeader(R[4], {
      texture: bespokeSignTexture("sealHouse"),
      width: 1.65, height: 0.54, y: 3.46, z: 0.05
    });
    shopHeader(R[3], {
      texture: bespokeSignTexture("colourWorld"),
      width: 1.65, height: 0.53, y: 3.41, z: -0.04
    });

    // 右前樓側牆：舊式窗、窗花、冷氣機與落水管。
    // 嘉利時錶位於較高處，這些細節只放在其下方。
    {
      const building = R[7];
      const g = building && building._group;

      if (g) {
        const wallZ = building.d / 2 + 0.11;

        const frame = new THREE.MeshStandardMaterial({
          color: 0x514f47,
          roughness: 0.95
        });
        const glass = new THREE.MeshStandardMaterial({
          color: 0x465b59,
          roughness: 0.67,
          metalness: 0.08
        });
        const oldMetal = new THREE.MeshStandardMaterial({
          color: 0x77766d,
          roughness: 0.91
        });
        const shade = new THREE.MeshStandardMaterial({
          color: 0x9a947f,
          roughness: 0.98
        });

        // 兩列、三層，特意略有不同，避免整齊的辦公樓外觀。
        const windows = [
          [0.73, 3.79, 0.67, 0.78],
          [2.14, 3.85, 0.59, 0.82],
          [0.75, 5.60, 0.72, 0.84],
          [2.17, 5.55, 0.62, 0.76],
          [0.73, 7.36, 0.65, 0.79],
          [2.16, 7.27, 0.68, 0.85]
        ];

        windows.forEach(([x, y, width, height], i) => {
          // 深色窗框與窗洞
          box(
            width + 0.12, height + 0.12, 0.085,
            frame, x, y, wallZ, g
          );

          // 舊玻璃
          box(
            width, height, 0.035,
            glass, x, y, wallZ + 0.065, g
          );

          // 中間窗柱
          box(
            0.045, height, 0.058,
            oldMetal, x, y, wallZ + 0.095, g
          );

          // 下沿突出的舊窗台
          box(
            width + 0.19, 0.065, 0.18,
            shade, x, y - height / 2 - 0.06,
            wallZ + 0.105, g
          );

          // 部分窗加鐵枝；其他窗保持普通玻璃。
          if (i === 1 || i === 2 || i === 5) {
            for (let bar = -1; bar <= 1; bar++) {
              box(
                0.025, height + 0.03, 0.034,
                oldMetal,
                x + bar * width * 0.28,
                y,
                wallZ + 0.126,
                g
              );
            }
          }
        });

        // 兩部不同位置的舊式窗機
        [
          [1.11, 5.03],
          [2.48, 7.03]
        ].forEach(([x, y]) => {
          box(
            0.43, 0.33, 0.33,
            oldMetal, x, y, wallZ + 0.22, g
          );
          box(
            0.32, 0.21, 0.018,
            frame, x, y, wallZ + 0.397, g
          );

          for (let k = -2; k <= 2; k++) {
            box(
              0.27, 0.012, 0.019,
              shade,
              x, y + k * 0.032,
              wallZ + 0.409,
              g
            );
          }
        });

        // 一條由天台延伸至地舖的外露落水管
        cylinder(
          0.045, 6.46,
          oldMetal,
          building.depth - 0.22,
          5.55,
          wallZ + 0.18,
          g
        );
      }
    }
    function streetAwning(building, {
      base, stripe, y = 3.08, width = 1.92, z = 0
    }) {
      if (!building || !building._group) return;

      const g = building._group;
      const dir = building._side === "left" ? 1 : -1;
      const front = building._facadeX + dir * 0.57;

      const cloth = new THREE.MeshStandardMaterial({
        color: base,
        roughness: 1
      });
      const bands = new THREE.MeshStandardMaterial({
        color: stripe,
        roughness: 1
      });
      const metal = new THREE.MeshStandardMaterial({
        color: 0x585a52,
        roughness: 0.88,
        metalness: 0.15
      });

      // 雨棚面：沿店面橫向展開，從牆上伸向街心。
      box(
        1.02, 0.065, width,
        cloth,
        building._facadeX + dir * 0.50,
        y,
        z,
        g
      );

      // 每間店條紋的間距相同，但底色和寬度不同。
      const count = Math.floor(width / 0.24);
      for (let i = 0; i < count; i += 2) {
        const bandZ = z - width / 2 +
          (i + 0.5) * (width / count);

        box(
          1.025, 0.012, width / count,
          bands,
          building._facadeX + dir * 0.50,
          y + 0.043,
          bandZ,
          g
        );
      }

      // 前沿布簾
      box(
        0.075, 0.22, width,
        cloth,
        front,
        y - 0.12,
        z,
        g
      );

      // 左右各一根細支架
      [-1, 1].forEach(side => {
        box(
          0.035, 0.035, 0.035,
          metal,
          front,
          y - 0.30,
          z + side * (width / 2 - 0.08),
          g
        );
      });
    }

    streetAwning(L[6], {
      base: 0x446b62,
      stripe: 0xd4c4a0,
      width: 2.04,
      z: 0.06
    });

    streetAwning(L[4], {
      base: 0x9a4c42,
      stripe: 0xe7cda6,
      width: 1.82,
      y: 3.04,
      z: -0.02
    });

    streetAwning(R[6], {
      base: 0xb39b6c,
      stripe: 0x596a60,
      width: 2.08,
      z: 0.02
    });

    streetAwning(R[4], {
      base: 0x607877,
      stripe: 0xe2c8aa,
      width: 1.76,
      y: 3.04,
      z: -0.04
    });

    // 右側入口：大牌安在臨街正面，與側牆的嘉利時錶錯位。
    board(R[7], {
      width: 2.75,
      height: 1.18,
      y: 7.36,
      z: -0.46,
      projection: 1.08,
      texture: bespokeSignTexture("sealHouse"),
      frameColor: 0x65382f
    });

    // 左側中後段：暖黃色牌，與前景紅白主牌分層。
    board(L[2], {
      width: 2.67,
      height: 1.13,
      y: 8.17,
      z: 0.68,
      projection: 1.03,
      texture: neonTexture("goldArc"),
      frameColor: 0x72513a
    });

    // 右側街道深處：白底紙樣牌，稍伸向街心。
    board(R[2], {
      width: 2.45,
      height: 1.03,
      y: 8.02,
      z: -0.34,
      projection: 1.12,
      texture: bespokeSignTexture("catalogue"),
      frameColor: 0x5e5446
    });
    function oldShopTexture(kind) {
      const tall = kind === "verticalWedding" ||
        kind === "verticalPrinting";

      const canvas = document.createElement("canvas");
      canvas.width = tall ? 540 : 1200;
      canvas.height = tall ? 1080 : 620;

      const c = canvas.getContext("2d");
      const w = canvas.width;
      const h = canvas.height;
      c.textAlign = "center";
      c.textBaseline = "middle";

      const song = '"PMingLiU","Songti TC",serif';
      const hei = '"Microsoft JhengHei","Noto Sans TC",sans-serif';

      function label(value, x, y, size, color, font = song) {
        c.fillStyle = color;
        c.font = `900 ${size}px ${font}`;
        // 沒有 maxWidth：字體不會被 Canvas 壓窄。
        c.fillText(value, x, y);
      }

      if (kind === "printing") {
        c.fillStyle = "#e5d6b7";
        c.fillRect(0, 0, w, h);

        c.fillStyle = "#a43730";
        c.fillRect(35, 43, 190, 205);
        label("印", 130, 143, 139, "#f3e3c5");

        label("合興印刷", 708, 204, 190, "#9a342c");
        label("喜帖 · 利是封 · 請柬", 700, 399, 91, "#343b37", hei);
        label("TEL  2833 1955", 700, 541, 54, "#825a43", hei);

        c.fillStyle = "#704c38";
        c.fillRect(0, h - 28, w, 28);
      }

      if (kind === "paper") {
        c.fillStyle = "#324d45";
        c.fillRect(0, 0, w, h);

        c.fillStyle = "#d6b97d";
        c.fillRect(38, 45, 16, h - 90);
        c.fillRect(w - 54, 45, 16, h - 90);

        label("大昌紙品", 600, 199, 205, "#ead7ad");
        label("彩紙 · 信封 · 印刷材料", 600, 391, 88,
          "#f0e1c1", hei);
        label("PAPER & PRINTING SUPPLIES", 600, 535, 45,
          "#b9bca6", hei);
      }

      if (kind === "verticalWedding") {
        c.fillStyle = "#a33831";
        c.fillRect(0, 0, w, h);
        c.fillStyle = "#dec28c";
        c.fillRect(26, 28, w - 52, 13);
        c.fillRect(26, h - 41, w - 52, 13);

        label("囍", w / 2, 142, 156, "#f1dbac");

        ["龍", "鳳", "喜", "帖"].forEach((char, i) => {
          label(char, w / 2, 347 + i * 177, 151, "#f5e8ca");
        });

        label("專門店", w / 2, 1034, 46, "#e5c893", hei);
      }

      if (kind === "verticalPrinting") {
        c.fillStyle = "#ded0ac";
        c.fillRect(0, 0, w, h);

        c.fillStyle = "#38574f";
        c.fillRect(0, 0, 31, h);
        c.fillRect(w - 31, 0, 31, h);

        ["華", "興", "印", "務"].forEach((char, i) => {
          label(char, w / 2, 182 + i * 196, 159, "#9e392e");
        });

        label("OFFSET", w / 2, 1008, 51, "#3d524c", hei);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.encoding = THREE.sRGBEncoding;
      texture.anisotropy = 8;
      texture.needsUpdate = true;
      return texture;
    }

    // 橫牌更高，直牌更闊；四塊分處左右及前後樓棟。
    board(L[4], {
      width: 3.10,
      height: 1.60,
      y: 9.31,
      z: 0.54,
      projection: 1.47,
      texture: oldShopTexture("printing"),
      frameColor: 0x6b4b3b
    });

    board(R[6], {
      width: 3.17,
      height: 1.65,
      y: 8.18,
      z: -0.33,
      projection: 1.48,
      texture: oldShopTexture("paper"),
      frameColor: 0x35473e
    });

    board(L[3], {
      width: 1.10,
      height: 2.20,
      y: 7.63,
      z: 0.84,
      projection: 0.78,
      texture: oldShopTexture("verticalWedding"),
      frameColor: 0x703a32
    });

    board(R[3], {
      width: 1.07,
      height: 2.14,
      y: 8.24,
      z: -0.62,
      projection: 0.70,
      texture: oldShopTexture("verticalPrinting"),
      frameColor: 0x665643
    });
  }

  function createSigns() {
    const L = LEFT_BUILDINGS;
    const R = RIGHT_BUILDINGS;

    const P = (
      building,
      y,
      zOffset,
      text,
      bg,
      fg,
      length,
      vertical = false,
      smallText = ""
    ) => {
      createProjectingSign({
        building,
        y,
        zOffset,
        text,
        bg,
        fg,
        length,
        vertical,
        smallText
      });
    };

    const F = (
      building,
      y,
      zOffset,
      text,
      bg,
      fg,
      width,
      height = 0.52,
      smallText = ""
    ) => {
      createFacadeSign({
        building,
        y,
        zOffset,
        text,
        bg,
        fg,
        width,
        height,
        smallText
      });
    };


    // ============================================================
    // LEFT — 前景
    // ============================================================

    F(
      L[0],
      2.72,
      -0.62,
      "德生辦行",
      "#e3d2ac",
      "#8f2d29",
      1.75,
      0.48
    );

    P(
      L[0],
      5.25,
      0.25,
      "華藝裝修",
      "#e3d2ad",
      "#a2332c",
      3.25,
      false,
      "歡迎電話查詢"
    );

    P(
      L[0],
      3.85,
      -0.85,
      "健生辦行",
      "#a02d28",
      "#ead6a1",
      2.20
    );


    // ============================================================
    // LEFT — 第二棟
    // ============================================================

    P(
      L[1],
      6.10,
      -0.52,
      "印章開",
      "#922824",
      "#ebd59d",
      1.0,
      true
    );

    P(
      L[1],
      4.75,
      0.32,
      "彩色世界",
      "#ddd2b6",
      "#363833",
      2.45,
      false,
      "COLOUR WORLD"
    );

    F(
      L[1],
      2.82,
      0.44,
      "祥利成章",
      "#772c28",
      "#e1c891",
      1.45,
      0.44
    );


    // ============================================================
    // LEFT — 第三棟
    // ============================================================

    P(
      L[2],
      5.55,
      -0.32,
      "鴻發標籤",
      "#ddc998",
      "#8f2e29",
      1.02,
      true
    );

    P(
      L[2],
      4.00,
      0.35,
      "柯式印刷",
      "#365044",
      "#e0c98f",
      1.70
    );

    P(
      L[2],
      3.16,
      -0.70,
      "香港賀咭",
      "#8e2926",
      "#ecd6a1",
      1.34
    );


    // ============================================================
    // LEFT — 中段
    // ============================================================

    P(
      L[3],
      6.35,
      0.20,
      "萬興紙業",
      "#952c27",
      "#ead498",
      1.05,
      true
    );

    P(
      L[3],
      4.70,
      -0.36,
      "月曆印刷",
      "#d5bd88",
      "#8b2d28",
      1.80
    );

    F(
      L[3],
      2.77,
      0.50,
      "囍帖專門",
      "#84312b",
      "#e5ce96",
      1.46,
      0.44
    );


    P(
      L[4],
      5.35,
      0.12,
      "紙袋",
      "#3c5247",
      "#dfc98e",
      0.96,
      true
    );

    P(
      L[4],
      3.75,
      -0.40,
      "美華印務",
      "#d4be8a",
      "#902f29",
      1.48
    );


    // ============================================================
    // LEFT — 後段
    // ============================================================

    P(
      L[5],
      5.82,
      -0.20,
      "聯合印務",
      "#3e5148",
      "#e2cf99",
      1.90
    );

    P(
      L[5],
      4.14,
      0.48,
      "請柬",
      "#922b27",
      "#e7d19c",
      1.15
    );

    F(
      L[6],
      3.00,
      -0.20,
      "利是封",
      "#d5bc83",
      "#862b27",
      1.38,
      0.42
    );


    // ============================================================
    // RIGHT — 前景
    // ============================================================

    F(
      R[0],
      2.74,
      -0.52,
      "聯合印務",
      "#dbc69a",
      "#8e2e29",
      1.72,
      0.48
    );

    P(
      R[0],
      5.38,
      0.18,
      "嘉利時錶公司",
      "#e5d2a8",
      "#a1322b",
      3.25,
      false,
      "CRALY COMPANY SPORTWATCHES"
    );

    P(
      R[0],
      3.70,
      -0.72,
      "廣告招牌",
      "#c8a75f",
      "#6d3029",
      1.55
    );


    // ============================================================
    // RIGHT — 第二棟
    // ============================================================

    P(
      R[1],
      6.18,
      0.42,
      "囍帖",
      "#8e2925",
      "#ecd49a",
      1.02,
      true
    );

    P(
      R[1],
      4.70,
      -0.32,
      "香港賀咭",
      "#ddd0ad",
      "#8d2d28",
      2.15
    );

    F(
      R[1],
      2.82,
      0.52,
      "請柬印刷",
      "#8d2b27",
      "#e6cf95",
      1.52,
      0.44
    );


    // ============================================================
    // RIGHT — 第三棟
    // ============================================================

    P(
      R[2],
      5.30,
      0.28,
      "美利紙袋",
      "#decba0",
      "#9a3029",
      2.32
    );

    P(
      R[2],
      3.78,
      -0.50,
      "紙品",
      "#344d43",
      "#e2ce94",
      1.0,
      true
    );

    F(
      R[2],
      2.85,
      0.25,
      "柯式印務",
      "#c6a960",
      "#712e28",
      1.45,
      0.44
    );


    // ============================================================
    // RIGHT — 中段
    // ============================================================

    P(
      R[3],
      6.28,
      -0.28,
      "月曆",
      "#882824",
      "#e5d098",
      1.0,
      true
    );

    P(
      R[3],
      4.52,
      0.35,
      "燙金印刷",
      "#caae6a",
      "#812c27",
      1.82
    );

    F(
      R[3],
      2.78,
      -0.48,
      "喜帖專門",
      "#812b27",
      "#e5ca91",
      1.44,
      0.42
    );


    P(
      R[4],
      5.15,
      0.16,
      "請柬印刷",
      "#ded0aa",
      "#9a312b",
      2.00
    );

    P(
      R[4],
      3.58,
      -0.36,
      "紙品公司",
      "#3c5146",
      "#dec88f",
      1.38
    );


    // ============================================================
    // RIGHT — 後段
    // ============================================================

    P(
      R[5],
      5.72,
      -0.22,
      "印務",
      "#932b27",
      "#e5ce96",
      0.98,
      true
    );

    P(
      R[5],
      4.02,
      0.38,
      "美華地產",
      "#d1bd8a",
      "#8a2d28",
      1.62
    );

    F(
      R[6],
      2.85,
      0.15,
      "紙品月曆",
      "#3a5147",
      "#e0cc93",
      1.42,
      0.43
    );


    // ============================================================
    // SQUARE / LOGO SIGNS
    // ============================================================

    createSquareProjectingSign({
      building: R[2],
      y: 6.65,
      zOffset: -0.15,
      text: "百",
      bg: "#293d3b",
      fg: "#e0c36e",
      size: 1.28,
      smallText: "BIG M"
    });

    createSquareProjectingSign({
      building: L[2],
      y: 6.70,
      zOffset: -0.18,
      text: "囍",
      bg: "#8c2925",
      fg: "#e6c981",
      size: 1.05
    });
  }

  function createDenseSignForest() {
    const L = LEFT_BUILDINGS;
    const R = RIGHT_BUILDINGS;

    const P = (
      building,
      y,
      zOffset,
      text,
      bg,
      fg,
      length,
      vertical = false,
      smallText = ""
    ) => {
      createProjectingSign({
        building,
        y,
        zOffset,
        text,
        bg,
        fg,
        length,
        vertical,
        smallText
      });
    };

    // LEFT

    P(
      L[1],
      6.75,
      0.72,
      "修裝藝華",
      "#eadab9",
      "#a52e28",
      3.65,
      false,
      "28331955"
    );

    P(
      L[1],
      5.35,
      -0.72,
      "印務",
      "#9b2724",
      "#ecd59d",
      1.05,
      true
    );

    P(
      L[2],
      6.05,
      0.82,
      "健生辦行",
      "#e4d4b3",
      "#a32c27",
      2.95,
      false,
      "EXPRESS"
    );

    P(
      L[2],
      4.75,
      -0.76,
      "祥利成章",
      "#982b27",
      "#ead49a",
      2.15
    );

    P(
      L[3],
      6.85,
      -0.58,
      "香港賀咭",
      "#d8c494",
      "#992c27",
      2.65
    );

    P(
      L[3],
      5.35,
      0.64,
      "彩色世界",
      "#ded1b1",
      "#32332f",
      2.75,
      false,
      "COLOUR WORLD"
    );

    P(
      L[4],
      6.55,
      0.48,
      "柯式印刷",
      "#3a5146",
      "#ead39a",
      2.05
    );

    P(
      L[4],
      4.35,
      -0.70,
      "請柬專門",
      "#9a2b26",
      "#ead19a",
      1.82
    );

    P(
      L[5],
      6.25,
      -0.45,
      "囍帖",
      "#962824",
      "#ead49b",
      1.10,
      true
    );

    P(
      L[5],
      5.05,
      0.68,
      "萬興紙業",
      "#d2b879",
      "#8f2b27",
      2.35
    );


    // RIGHT

    P(
      R[1],
      6.90,
      -0.62,
      "嘉利時錶公司",
      "#ead8b4",
      "#a12d27",
      3.70,
      false,
      "CRALY COMPANY"
    );

    P(
      R[1],
      5.30,
      0.78,
      "月曆",
      "#982824",
      "#ead49a",
      1.10,
      true
    );

    P(
      R[2],
      6.20,
      -0.75,
      "美利紙袋",
      "#dfcc9f",
      "#9b2c27",
      2.85
    );

    P(
      R[2],
      4.65,
      0.70,
      "紙品",
      "#344e43",
      "#e3cf94",
      1.05,
      true
    );

    P(
      R[3],
      6.75,
      0.55,
      "印章開",
      "#952925",
      "#ecd49a",
      1.05,
      true
    );

    P(
      R[3],
      5.35,
      -0.75,
      "賀咭公司",
      "#d8bd82",
      "#922b27",
      2.35
    );

    P(
      R[4],
      6.20,
      0.65,
      "燙金印刷",
      "#c5a45e",
      "#792722",
      2.25
    );

    P(
      R[4],
      4.50,
      -0.70,
      "聯合印務",
      "#3c5046",
      "#e7d29a",
      1.85
    );

    P(
      R[5],
      6.65,
      -0.42,
      "囍帖專門",
      "#912824",
      "#ead49a",
      2.05
    );

    P(
      R[5],
      5.15,
      0.65,
      "月曆紙品",
      "#ddd0aa",
      "#932b27",
      2.20
    );
  }

  function createSignSupportFrames() {
    const L = LEFT_BUILDINGS;
    const R = RIGHT_BUILDINGS;

    const frames = [
      [L[0], -0.35, 5.25, 2.55, 2.25, 1.35],
      [L[1], 0.55, 5.85, 2.85, 2.40, 1.55],
      [L[2], -0.45, 6.30, 2.45, 2.70, 1.45],
      [L[3], 0.40, 5.45, 3.10, 2.35, 1.70],
      [L[4], -0.25, 6.10, 2.60, 2.55, 1.50],

      [R[0], 0.35, 5.30, 2.85, 2.30, 1.55],
      [R[1], -0.45, 6.00, 3.10, 2.55, 1.75],
      [R[2], 0.40, 5.55, 2.45, 2.65, 1.45],
      [R[3], -0.35, 6.20, 3.00, 2.45, 1.70],
      [R[4], 0.45, 5.20, 2.55, 2.25, 1.50]
    ];

    frames.forEach((f, index) => {
      createOldSignFrame(
        f[0],
        f[1],
        f[2],
        f[3],
        f[4],
        f[5],
        index
      );
    });
  }

  function createOldSignFrame(
    building,
    z,
    y,
    width,
    height,
    projection,
    seed
  ) {
    if (!building || !building._group) return;

    // 按原圖比例擴大牌面較短的一邊，不再拉扁中文字。
    // 嘉利時錶是貼牆牌，維持已確認的大小和位置。
    if (!outerWall && texture && texture.image) {
      const image = texture.image;
      const imageRatio = image.width / image.height;
      const boardRatio = width / height;

      if (boardRatio > imageRatio) {
        height = width / imageRatio;
      } else {
        width = height * imageRatio;
      }
    }

    const g = building._group;
    const side = building._side;
    const dir = side === "left" ? 1 : -1;
    const wallX = building._facadeX;

    const metal = new THREE.MeshStandardMaterial({
      color:
        seed % 3 === 0
          ? 0x272a27
          : seed % 3 === 1
            ? 0x343632
            : 0x403e38,
      roughness: 0.98,
      metalness: 0.18
    });

    const outerX =
      wallX + dir * projection;

    const centerX =
      wallX + dir * projection * 0.50;

    const postLeftZ =
      z - width * 0.50;

    const postRightZ =
      z + width * 0.50;

    box(
      0.045,
      height,
      0.045,
      metal,
      wallX + dir * 0.08,
      y,
      postLeftZ,
      g
    );

    box(
      0.045,
      height,
      0.045,
      metal,
      wallX + dir * 0.08,
      y,
      postRightZ,
      g
    );

    box(
      projection,
      0.045,
      0.045,
      metal,
      centerX,
      y + height * 0.48,
      postLeftZ,
      g
    );

    box(
      projection,
      0.045,
      0.045,
      metal,
      centerX,
      y + height * 0.48,
      postRightZ,
      g
    );

    box(
      projection,
      0.045,
      0.045,
      metal,
      centerX,
      y - height * 0.48,
      postLeftZ,
      g
    );

    box(
      projection,
      0.045,
      0.045,
      metal,
      centerX,
      y - height * 0.48,
      postRightZ,
      g
    );

    box(
      0.045,
      height * 0.94,
      0.045,
      metal,
      outerX,
      y,
      postLeftZ,
      g
    );

    box(
      0.045,
      height * 0.94,
      0.045,
      metal,
      outerX,
      y,
      postRightZ,
      g
    );

    addFrameDiagonal(
      g,
      wallX + dir * 0.08,
      y - height * 0.44,
      postLeftZ,
      outerX,
      y + height * 0.42,
      postLeftZ,
      metal
    );

    if (seed % 2 === 0) {
      addFrameDiagonal(
        g,
        wallX + dir * 0.08,
        y + height * 0.40,
        postRightZ,
        outerX,
        y - height * 0.42,
        postRightZ,
        metal
      );
    }

    if (seed % 3 !== 1) {
      box(
        0.04,
        0.04,
        width,
        metal,
        outerX,
        y,
        z,
        g
      );
    }
  }

  function addFrameDiagonal(
    parent,
    x1,
    y1,
    z1,
    x2,
    y2,
    z2,
    material
  ) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;

    const length =
      Math.sqrt(
        dx * dx +
        dy * dy +
        dz * dz
      );

    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(
        0.04,
        0.04,
        length
      ),
      material
    );

    beam.position.set(
      (x1 + x2) / 2,
      (y1 + y2) / 2,
      (z1 + z2) / 2
    );

    beam.lookAt(
      new THREE.Vector3(
        x2,
        y2,
        z2
      )
    );

    parent.add(beam);
  }

  function createFacadePipeBands() {
    const buildings = [
      LEFT_BUILDINGS[1],
      LEFT_BUILDINGS[2],
      LEFT_BUILDINGS[3],
      LEFT_BUILDINGS[5],
      RIGHT_BUILDINGS[1],
      RIGHT_BUILDINGS[2],
      RIGHT_BUILDINGS[3],
      RIGHT_BUILDINGS[5]
    ];

    buildings.forEach((building, index) => {
      if (!building || !building._group) return;

      const g = building._group;
      const side = building._side;
      const dir =
        side === "left" ? 1 : -1;

      const wallX =
        building._facadeX;

      const metal =
        mat(
          index % 2 === 0
            ? 0x353834
            : 0x44433d,
          0.98
        );

      const levels =
        index % 3 === 0
          ? [4.45, 5.05, 6.75]
          : [4.75, 6.15];

      levels.forEach((y, i) => {
        box(
          0.055,
          0.055,
          building.d * (
            i % 2 === 0
              ? 0.78
              : 0.58
          ),
          metal,
          wallX + dir * 0.19,
          y,
          i % 2 === 0
            ? -0.05
            : 0.16,
          g
        );
      });
    });
  }


  // ============================================================
  // OVERHEAD WIRES
  // ============================================================
  function createOverheadWires() {

    const wires = [
      [7.0, 6.25, 0.42],
      [4.2, 5.75, 0.55],
      [1.2, 6.10, 0.48],
      [-1.8, 5.55, 0.62],
      [-4.8, 5.95, 0.50],
      [-7.0, 5.60, 0.66]
    ];


    wires.forEach(
      ([z, y, sag], index) => {

        const leftPose =
          getRoadPose(
            "left",
            z
          );

        const rightPose =
          getRoadPose(
            "right",
            z
          );


        if (
          !leftPose ||
          !rightPose
        ) {
          return;
        }


        // 電線端點跟隨兩側樓宇
        const x1 =
          leftPose.x - 1.25;

        const x2 =
          rightPose.x + 1.25;


        createSaggingWire(
          x1,
          x2,
          y,
          z,
          sag
        );


        // 部分位置增加第二根亂線
        // 不再像整齊的景觀電線
        if (
          index % 2 === 0
        ) {

          createSaggingWire(
            x1 + 0.10,
            x2 - 0.13,
            y - 0.18,
            z - 0.12,
            sag * 0.82
          );

        }

      }
    );
  }



  function createSaggingWire(
    x1,
    x2,
    y,
    z,
    sag
  ) {

    const points = [];

    const segments = 28;


    for (
      let i = 0;
      i <= segments;
      i++
    ) {

      const t =
        i / segments;


      const x =
        THREE.MathUtils.lerp(
          x1,
          x2,
          t
        );


      const drop =
        Math.sin(
          Math.PI * t
        ) * sag;


      // 很輕微的不規則
      const wobble =
        Math.sin(
          t *
          Math.PI *
          3
        ) * 0.035;


      points.push(
        new THREE.Vector3(
          x,
          y - drop,
          z + wobble
        )
      );

    }


    const geometry =
      new THREE.BufferGeometry()
        .setFromPoints(
          points
        );


    const material =
      new THREE.LineBasicMaterial({

        // 更黑、更舊
        color: 0x282a27,

        transparent: true,

        opacity: 0.86

      });


    const line =
      new THREE.Line(
        geometry,
        material
      );


    stage.add(line);
  }


  // ============================================================
  // STREET FURNITURE
  // ============================================================
  function createStreetFurniture() {

    const poleMat =
      mat(
        0x3a3b37,
        0.98
      );


    const lampPositions = [

      ["left", 7.4],

      ["right", 5.5],

      ["left", 1.2],

      ["right", -1.7],

      ["left", -5.0],

      ["right", -7.0]

    ];


    lampPositions.forEach(
      ([side, z]) => {

        const pose =
          getRoadPose(
            side,
            z
          );


        if (!pose) {
          return;
        }


        // ======================================================
        // ROAD EDGE → PAVEMENT
        // ======================================================

        // 左邊往左走
        // 右邊往右走

        const outward =
          side === "left"
            ? -1
            : 1;


        const roadDirection =
          -outward;


        // 從馬路邊緣向外 0.72
        // 正好落在人行道
        const x =
          pose.x +
          outward * 0.72;


        // ======================================================
        // POLE
        // ======================================================

        cylinder(
          0.07,
          3.55,
          poleMat,
          x,
          2.30,
          z
        );


        // 底座
        cylinder(
          0.12,
          0.16,
          mat(
            0x32332f,
            1
          ),
          x,
          0.70,
          z
        );


        // ======================================================
        // LAMP ARM
        // ======================================================

        box(
          0.44,
          0.045,
          0.045,
          poleMat,

          x +
          roadDirection *
          0.20,

          4.02,

          z
        );


        // ======================================================
        // LIGHT
        // ======================================================

        const lamp =
          new THREE.Mesh(

            new THREE.SphereGeometry(
              0.16,
              12,
              8
            ),

            new THREE.MeshStandardMaterial({

              color:
                0xd6c8a5,

              emissive:
                0x675638,

              emissiveIntensity:
                0.10,

              roughness:
                0.78

            })

          );


        lamp.position.set(

          x +
          roadDirection *
          0.39,

          4.02,

          z

        );


        stage.add(lamp);

      }
    );
  }


  // ============================================================
  // STREET CLUTTER
  // ============================================================

  function createStreetClutter() {
    [
      [-3.45, 7.2, 0.55, 0.55, 0.55, 0x645b4f],
      [3.45, 5.8, 0.70, 0.35, 0.55, 0x806d53],
      [-3.45, 2.1, 0.65, 0.30, 0.70, 0x8b7657],
      [3.45, -1.2, 0.50, 0.65, 0.50, 0x4d5d53],
      [-3.45, -4.7, 0.75, 0.32, 0.55, 0x887153]
    ].forEach(
      ([x, z, w, h, d, color]) => {
        box(
          w,
          h,
          d,
          mat(color),
          x,
          0.62 + h / 2,
          z
        );
      }
    );


    [
      [-2.8, 8.3],
      [2.8, 6.8],
      [-2.8, 0.1],
      [2.8, -4.8]
    ].forEach(
      ([x, z]) => {

        cylinder(
          0.09,
          0.65,
          mat(0x4b4945),
          x,
          0.88,
          z
        );

      }
    );
  }


  // ============================================================
  // CONTROLS
  // ============================================================

  function bindControls() {
    if (!renderer) return;

    const canvas =
      renderer.domElement;

    canvas.style.cursor = "grab";


    canvas.addEventListener(
      "pointerdown",
      e => {
        control.dragging = true;

        control.lastX =
          e.clientX;

        control.lastY =
          e.clientY;

        canvas.setPointerCapture?.(
          e.pointerId
        );

        canvas.style.cursor =
          "grabbing";
      }
    );


    canvas.addEventListener(
      "pointermove",
      e => {
        if (!control.dragging) {
          return;
        }


        const dx =
          e.clientX -
          control.lastX;

        const dy =
          e.clientY -
          control.lastY;


        control.lastX =
          e.clientX;

        control.lastY =
          e.clientY;


        if (
          control.mode === "model"
        ) {
          control.targetYaw -=
            dx * 0.006;

          control.targetPitch +=
            dy * 0.0045;

          control.targetPitch =
            THREE.MathUtils.clamp(
              control.targetPitch,
              -0.16,
              1.10
            );

        } else {

          control.cornerYaw -=
            dx * 0.0025;

          control.cornerPitch -=
            dy * 0.002;

          control.cornerYaw =
            THREE.MathUtils.clamp(
              control.cornerYaw,
              -0.32,
              0.32
            );

          control.cornerPitch =
            THREE.MathUtils.clamp(
              control.cornerPitch,
              -0.18,
              0.20
            );
        }
      }
    );


    const stopDragging =
      e => {
        control.dragging = false;

        canvas.style.cursor =
          "grab";

        if (
          e &&
          e.pointerId !== undefined
        ) {
          try {
            canvas.releasePointerCapture?.(
              e.pointerId
            );
          } catch (_) { }
        }
      };


    canvas.addEventListener(
      "pointerup",
      stopDragging
    );

    canvas.addEventListener(
      "pointercancel",
      stopDragging
    );


    canvas.addEventListener(
      "wheel",
      e => {
        e.preventDefault();


        if (
          control.mode === "corner"
        ) {
          control.targetCornerZoom -=
            e.deltaY * 0.0012;

          control.targetCornerZoom =
            THREE.MathUtils.clamp(
              control.targetCornerZoom,
              1.3,
              2.6
            );

        } else {

          control.targetDistance +=
            e.deltaY * 0.018;

          control.targetDistance =
            THREE.MathUtils.clamp(
              control.targetDistance,
              27,
              58
            );
        }
      },
      {
        passive: false
      }
    );
  }


  // ============================================================
  // CAMERA
  // ============================================================

  function updateCamera(
    force = false
  ) {
    if (
      control.mode === "corner"
    ) {
      control.cornerProgress =
        THREE.MathUtils.lerp(
          control.cornerProgress,
          1,
          0.055
        );


      control.cornerZoom =
        THREE.MathUtils.lerp(
          control.cornerZoom,
          control.targetCornerZoom,
          0.08
        );


      const t =
        THREE.MathUtils.smoothstep(
          control.cornerProgress,
          0,
          1
        );

      const start = new THREE.Vector3(-20, 16, 22);
      const end = new THREE.Vector3(-8.8, 5.8, 13.2);

      camera.position.lerpVectors(
        start,
        end,
        t
      );


      camera.lookAt(
        control.cornerYaw * 7,
        3.6 +
        control.cornerPitch * 6,
        -3.0
      );


      camera.zoom =
        THREE.MathUtils.lerp(
          1.15,
          control.cornerZoom,
          t
        );


      camera.updateProjectionMatrix();

      return;
    }


    control.cornerProgress =
      THREE.MathUtils.lerp(
        control.cornerProgress,
        0,
        0.08
      );


    if (force) {
      control.yaw =
        control.targetYaw;

      control.pitch =
        control.targetPitch;

      control.distance =
        control.targetDistance;

    } else {

      control.yaw =
        THREE.MathUtils.lerp(
          control.yaw,
          control.targetYaw,
          0.10
        );

      control.pitch =
        THREE.MathUtils.lerp(
          control.pitch,
          control.targetPitch,
          0.10
        );

      control.distance =
        THREE.MathUtils.lerp(
          control.distance,
          control.targetDistance,
          0.10
        );
    }


    const horizontal =
      Math.cos(
        control.pitch
      ) *
      control.distance;

    const eyeHeight = Math.max(
      1.45,
      Math.sin(control.pitch) * control.distance
    );

    camera.position.set(
      Math.sin(
        control.yaw
      ) *
      horizontal,

      eyeHeight,

      Math.cos(
        control.yaw
      ) *
      horizontal
    );


    camera.lookAt(
      0,
      3.6,
      -1.3
    );


    camera.zoom =
      47 /
      control.distance;


    camera.updateProjectionMatrix();
  }


  // ============================================================
  // RESIZE
  // ============================================================

  function resize() {
    if (
      !camera ||
      !renderer
    ) {
      return;
    }


    const aspect =
      innerWidth /
      innerHeight;

    const view = 30;


    camera.left =
      (-view * aspect) / 2;

    camera.right =
      (view * aspect) / 2;

    camera.top =
      view / 2;

    camera.bottom =
      -view / 2;


    camera.updateProjectionMatrix();


    renderer.setSize(
      innerWidth,
      innerHeight
    );
  }


  // ============================================================
  // ANIMATION
  // ============================================================

  function animate() {
    animationId =
      requestAnimationFrame(
        animate
      );

    updateCamera();

    renderer.render(
      scene,
      camera
    );
  }


  // ============================================================
  // PUBLIC
  // ============================================================

  function open() {
    if (!overlay) {
      createOverlay();
      buildScene();
    }

    overlay.style.display =
      "block";

    document.body.style.overflow =
      "hidden";


    if (!animationId) {
      animate();
    }
  }


  function closeScene() {
    if (!overlay) {
      return;
    }

    overlay.style.display =
      "none";

    document.body.style.overflow =
      "";


    if (animationId) {
      cancelAnimationFrame(
        animationId
      );

      animationId = null;
    }
  }


  window.UrbanStreetScene = {
    open,
    close: closeScene
  };

})();
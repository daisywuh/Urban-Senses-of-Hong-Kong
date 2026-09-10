const DATA_PATHS = {
  places: "./data/places.geojson",
  tramTracks: "./data/tram-tracks.geojson",
  tramServices: "./data/tram-services.json",
  ferryRoutes: "./data/ferry-routes.geojson"
};

const STORAGE_KEYS = {
  contributions: "urban-senses-contributions",
  illuminatedPlaces: "urban-senses-illuminated"
};

const PLACE_PHOTO_DATABASE = {
  name: "urban-senses-place-photos",
  version: 1,
  storeName: "placePhotos",
  placeIndexName: "placeId"
};

const HONG_KONG_BOUNDS = [
  [113.82, 22.14],
  [114.46, 22.52]
];

const DEFAULT_CAMERA = {
  center: [114.145, 22.29],
  zoom: 10.85,
  pitch: 0,
  bearing: 0
};

let placesData = [];
let communityPlaces = [];
let allPlaces = [];

let selectedPlace = null;
let selectedMarker = null;
let contributionMarker = null;

let storyPhotoItems = [];
let storyPhotoIndex = 0;
let storyPhotoMode = "current";
let storyPhotoRequestId = 0;
let placePhotoDatabasePromise = null;

let historicalPanoramaViewer = null;
let historicalPanoramaIsOpen = false;

let currentArchiveFilter = "all";
let contributionModeIsOpen = false;
let editingContributionId = "";

let illuminatedPlaces = loadStoredArray(
  STORAGE_KEYS.illuminatedPlaces
);

let tramTrackData = null;
let tramServiceData = null;
let ferryRouteData = null;

const placeMarkers = [];
const transportVehicles = [];
const tramLyricMarkers = [];
const placeDecorationMarkers = [];
const foodClusterMarkers = [];

let placeLabelLayoutFrame = null;
let activeTramLyricLocation = null;
let tramFollowingIsActive = false;

let animationFrameId = null;
let placeSceneAnimationFrameId = null;
let previousAnimationTime = 0;
let lastFollowUpdate = 0;

let roadSourceDescriptors = [];
let streetHighlightRequestId = 0;

const placeGeometryCache = new Map();

// ========================================
// 頁面元素
// ========================================

const pageElements = {
  mapShell: document.querySelector(
    ".map-shell"
  ),

  mapLoading: document.querySelector(
    "#map-loading"
  ),

  archivePanel: document.querySelector(
    "#archive-panel"
  ),

  archivePanelToggle: document.querySelector(
    "#archive-panel-toggle"
  ),

  archiveList: document.querySelector(
    "#archive-list"
  ),

  archiveFilterButtons: document.querySelectorAll(
    ".archive-filter-button"
  ),

  mapFilterButtons: document.querySelectorAll(
    ".map-filter-button"
  ),

  storyPanel: document.querySelector(
    "#story-panel"
  ),

  storyPanelClose: document.querySelector(
    "#story-panel-close"
  ),

  storyCategory: document.querySelector(
    "#story-category"
  ),

  storyTitle: document.querySelector(
    "#story-title"
  ),

  storyMeta: document.querySelector(
    "#story-meta"
  ),

  storyExcerptHeading: document.querySelector(
    "#story-excerpt-heading"
  ),

  storyExcerpt: document.querySelector(
    "#story-excerpt"
  ),

  storyDescription: document.querySelector(
    "#story-description"
  ),

  storyTimeSection: document.querySelector(
    "#story-time-section"
  ),

  storyImage: document.querySelector(
    "#story-image"
  ),

  storyImageFrame: document.querySelector(
    "#story-image-frame"
  ),

  storyImagePlaceholder: document.querySelector(
    "#story-image-placeholder"
  ),

  storyImageCaption: document.querySelector(
    "#story-image-caption"
  ),

  storyPreviousPhotoButton: document.querySelector(
    "#story-previous-photo"
  ),

  storyNextPhotoButton: document.querySelector(
    "#story-next-photo"
  ),

  storyPhotoCount: document.querySelector(
    "#story-photo-count"
  ),

  storyPhotoToolbar: document.querySelector(
    ".story-photo-toolbar"
  ),

  storyAddPhotoButton: document.querySelector(
    "#story-add-photo-button"
  ),

  storyDeletePhotoButton: document.querySelector(
    "#story-delete-photo-button"
  ),

  storyAddPhotoInput: document.querySelector(
    "#story-add-photo-input"
  ),

  showCurrentImageButton: document.querySelector(
    "#show-current-image"
  ),

  showPastImageButton: document.querySelector(
    "#show-past-image"
  ),

  storyMusicSection: document.querySelector(
    "#story-music-section"
  ),

  storySpotifyPlayer: document.querySelector(
    "#story-spotify-player"
  ),

  storyAudioButton: document.querySelector(
    "#story-audio-button"
  ),

  storyLightButton: document.querySelector(
    "#story-light-button"
  ),

  editContributionButton: document.querySelector(
    "#edit-contribution-button"
  ),

  deleteContributionButton: document.querySelector(
    "#delete-contribution-button"
  ),

  lightProgressText: document.querySelector(
    "#light-progress-text"
  ),

  lightProgressBar: document.querySelector(
    "#light-progress-bar"
  ),

  tramLyricCard: document.querySelector(
    "#tram-lyric-card"
  ),

  tramLyricLocation: document.querySelector(
    "#tram-lyric-location"
  ),

  tramLyricText: document.querySelector(
    "#tram-lyric-text"
  ),

  tramFollowButton: document.querySelector(
    "#tram-follow-button"
  ),

  openContributionButton: document.querySelector(
    "#open-contribution-button"
  ),

  contributionDialog: document.querySelector(
    "#contribution-dialog"
  ),

  closeContributionButton: document.querySelector(
    "#close-contribution-button"
  ),

  contributionForm: document.querySelector(
    "#contribution-form"
  ),

  contributionTitle: document.querySelector(
    "#contribution-title"
  ),

  contributionSubtitle: document.querySelector(
    "#contribution-subtitle"
  ),

  saveContributionButton: document.querySelector(
    "#save-contribution-button"
  ),

  contributionPhoto: document.querySelector(
    "#contribution-photo"
  ),

  contributionPhotoPreview: document.querySelector(
    "#contribution-photo-preview"
  ),

  contributionPreviewImage: document.querySelector(
    "#contribution-preview-image"
  ),

  contributionLongitude: document.querySelector(
    "#contribution-longitude"
  ),

  contributionLatitude: document.querySelector(
    "#contribution-latitude"
  ),

  historicalPanorama: document.querySelector(
    "#historical-panorama"
  ),

  historicalPanoramaContainer: document.querySelector(
    "#historical-panorama-viewer"
  ),

  historicalPanoramaTitle: document.querySelector(
    "#historical-panorama-title"
  ),

  historicalPanoramaYear: document.querySelector(
    "#historical-panorama-year"
  ),

  historicalPanoramaLoading: document.querySelector(
    "#historical-panorama-loading"
  ),

  closeHistoricalPanoramaButton: document.querySelector(
    "#close-historical-panorama"
  ),

  toast: document.querySelector(
    "#toast"
  )
};

// ========================================
// 建立香港地圖
// ========================================

const map = new maplibregl.Map({
  container: "map",
  style: "https://tiles.openfreemap.org/styles/bright",
  ...DEFAULT_CAMERA,
  minZoom: 9.4,
  maxZoom: 19,
  maxBounds: HONG_KONG_BOUNDS,
  pitchWithRotate: false,
  dragRotate: false,
  fadeDuration: 0,
  attributionControl: false,
  canvasContextAttributes: {
    antialias: true
  }
});

map.addControl(
  new maplibregl.NavigationControl({
    showCompass: false,
    visualizePitch: false
  }),
  "bottom-right"
);

// ========================================
// 地圖載入完成
// ========================================

map.on("load", async () => {
  try {
    collectRoadSourceDescriptors();
    simplifyBaseMap();

    await loadProjectData();

    createAllPlaceMarkers();
    createArchiveList();
    addTransportLayers();
    createTransportVehicles();
    updateLightProgress();

    map.resize();

    window.setTimeout(() => {
      pageElements.mapLoading?.classList.add(
        "is-hidden"
      );
    }, 500);

    startTransportAnimation();

    console.log(
      "香港城市記憶地圖載入成功"
    );
  } catch (error) {
    console.error(
      "地圖資料載入失敗：",
      error
    );

    pageElements.mapLoading?.classList.add(
      "has-error"
    );

    showToast(
      "部分地圖資料未能載入，請檢查資料檔案。"
    );
  }
});

// ========================================
// 記錄底圖內可查詢的道路資料層
// ========================================

function collectRoadSourceDescriptors() {
  const seen = new Set();

  roadSourceDescriptors = (
    map.getStyle().layers || []
  )
    .filter((layer) => {
      if (
        layer.type !== "line" ||
        !layer.source ||
        !layer["source-layer"]
      ) {
        return false;
      }

      const description =
        `${layer.id} ${layer["source-layer"]}`
          .toLowerCase();

      return (
        description.includes("transportation") ||
        description.includes("road") ||
        description.includes("street")
      );
    })
    .map((layer) => ({
      source: layer.source,
      sourceLayer: layer["source-layer"]
    }))
    .filter((descriptor) => {
      const key =
        `${descriptor.source}:${descriptor.sourceLayer}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);

      return true;
    });
}

// ========================================
// 建立簡約的香港插畫底圖
// ========================================

function simplifyBaseMap() {
  const layers =
    map.getStyle().layers || [];

  layers.forEach((layer) => {
    const layerId =
      layer.id.toLowerCase();

    if (layer.type === "background") {
      map.setPaintProperty(
        layer.id,
        "background-color",
        "#f7f1e8"
      );

      return;
    }

    if (layer.type === "line") {
      map.setLayoutProperty(
        layer.id,
        "visibility",
        "none"
      );

      return;
    }

    if (
      layer.type === "symbol" ||
      layer.type === "circle"
    ) {
      map.setLayoutProperty(
        layer.id,
        "visibility",
        "none"
      );

      return;
    }

    if (
      layer.type === "fill-extrusion" ||
      layer.type === "hillshade"
    ) {
      map.setLayoutProperty(
        layer.id,
        "visibility",
        "none"
      );

      return;
    }

    if (layer.type !== "fill") {
      return;
    }

    if (
      layerId.includes("water") ||
      layerId.includes("ocean") ||
      layerId.includes("river") ||
      layerId.includes("lake")
    ) {
      setFillLayerColour(
        layer.id,
        "#acd8e3",
        1
      );

      return;
    }

    if (
      layerId.includes("wood") ||
      layerId.includes("forest") ||
      layerId.includes("natural") ||
      layerId.includes("landcover")
    ) {
      setFillLayerColour(
        layer.id,
        "#a8c99a",
        0.94
      );

      return;
    }

    if (
      layerId.includes("park") ||
      layerId.includes("garden") ||
      layerId.includes("recreation")
    ) {
      setFillLayerColour(
        layer.id,
        "#c8ddb6",
        0.96
      );

      return;
    }

    if (
      layerId.includes("grass") ||
      layerId.includes("pitch") ||
      layerId.includes("meadow")
    ) {
      setFillLayerColour(
        layer.id,
        "#dbe8c7",
        0.94
      );

      return;
    }

    if (
      layerId.includes("sand") ||
      layerId.includes("beach")
    ) {
      setFillLayerColour(
        layer.id,
        "#ead9ad",
        0.96
      );

      return;
    }

    if (
      layerId.includes("building")
    ) {
      setFillLayerColour(
        layer.id,
        "#eee7dd",
        0.42
      );

      return;
    }

    if (
      layerId.includes("hospital") ||
      layerId.includes("school") ||
      layerId.includes("industrial") ||
      layerId.includes("commercial")
    ) {
      setFillLayerColour(
        layer.id,
        "#f2ece3",
        0.62
      );

      return;
    }

    setFillLayerColour(
      layer.id,
      "#f7f1e8",
      0.9
    );
  });
}

// ========================================
// 安全修改地圖填色
// ========================================

function setFillLayerColour(
  layerId,
  colour,
  opacity
) {
  if (!map.getLayer(layerId)) {
    return;
  }

  map.setPaintProperty(
    layerId,
    "fill-color",
    colour
  );

  map.setPaintProperty(
    layerId,
    "fill-opacity",
    opacity
  );

  if (
    map.getPaintProperty(
      layerId,
      "fill-outline-color"
    ) !== undefined
  ) {
    map.setPaintProperty(
      layerId,
      "fill-outline-color",
      colour
    );
  }
}

// ========================================
// 讀取所有專案資料
// ========================================

async function loadProjectData() {
  const [
    placesResponse,
    tramTracksResponse,
    tramServicesResponse,
    ferryRoutesResponse
  ] = await Promise.all([
    fetch(DATA_PATHS.places),
    fetch(DATA_PATHS.tramTracks),
    fetch(DATA_PATHS.tramServices),
    fetch(DATA_PATHS.ferryRoutes)
  ]);

  const responses = [
    placesResponse,
    tramTracksResponse,
    tramServicesResponse,
    ferryRoutesResponse
  ];

  if (
    responses.some(
      (response) => !response.ok
    )
  ) {
    throw new Error(
      "一個或多個資料檔案讀取失敗。"
    );
  }

  const placesGeoJSON =
    await placesResponse.json();

  tramTrackData =
    await tramTracksResponse.json();

  tramServiceData =
    await tramServicesResponse.json();

  ferryRouteData =
    await ferryRoutesResponse.json();

  placesData =
    placesGeoJSON.features.filter(
      (place) =>
        place.properties.status ===
        "published"
    );

  communityPlaces =
    loadStoredArray(
      STORAGE_KEYS.contributions
    );

  allPlaces = [
    ...placesData,
    ...communityPlaces
  ];
}

// ========================================
// 根據縮放層級控制地點標籤密度
// ========================================

function updatePlaceLabelDensity() {
  const zoom = map.getZoom();

  /*
 * 食物圖標隨地圖縮放。
 * 遠景較小，近景逐漸放大。
 */
  const foodMarkerScale =
    Math.min(
      1.08,
      Math.max(
        0.5,
        0.5 +
        (
          zoom - 11
        ) * 0.1
      )
    );

  const foodMarkerHoverScale =
    Math.min(
      1.2,
      foodMarkerScale + 0.1
    );

  pageElements.mapShell
    .style.setProperty(
      "--food-marker-scale",
      foodMarkerScale.toFixed(3)
    );

  pageElements.mapShell
    .style.setProperty(
      "--food-marker-hover-scale",
      foodMarkerHoverScale
        .toFixed(3)
    );

  pageElements.mapShell.classList.toggle(
    "is-compact-labels",
    zoom < 11.8
  );

  pageElements.mapShell.classList.toggle(
    "is-food-labels-compact",
    zoom < 13.4
  );

  pageElements.mapShell.classList.toggle(
    "show-tram-location-labels",
    zoom >= 11.35
  );
}

// ========================================
// 清除食物地點聚合標記
// ========================================

function clearFoodClusterMarkers() {
  foodClusterMarkers.forEach(
    (record) => {
      record.marker.remove();
    }
  );

  foodClusterMarkers.length = 0;

  placeMarkers.forEach(
    (record) => {
      record.marker
        ?.getElement?.()
        ?.classList.remove(
          "is-food-cluster-hidden"
        );
    }
  );
}

// ========================================
// 建立食物地點聚合標記
// ========================================

function updateFoodMarkerClusters() {
  console.log(
    "正在計算食物聚合",
    map.getZoom(),
    placeMarkers.length
  );

  clearFoodClusterMarkers();

  if (
    !map ||
    map.getZoom() >= 12.7
  ) {
    return;
  }

  const zoom =
    map.getZoom();

  const gridSize =
    zoom < 11.5
      ? 82
      : zoom < 12.3
        ? 66
        : 50;

  const foodRecords =
    placeMarkers.filter(
      (record) => {
        const information =
          record.place?.properties;

        return (
          information
            ?.mediaType === "food" &&
          placeMatchesContentFilter(
            record.place
          )
        );
      }
    );

  const groups =
    new Map();

  foodRecords.forEach(
    (record) => {
      const coordinates =
        record.place.geometry
          .coordinates;

      const screenPoint =
        map.project(
          coordinates
        );

      const column =
        Math.floor(
          screenPoint.x /
          gridSize
        );

      const row =
        Math.floor(
          screenPoint.y /
          gridSize
        );

      const groupKey =
        `${column}-${row}`;

      if (!groups.has(groupKey)) {
        groups.set(
          groupKey,
          []
        );
      }

      groups.get(groupKey).push(
        record
      );
    }
  );

  groups.forEach(
    (records) => {
      if (records.length < 2) {
        return;
      }

      records.forEach(
        (record) => {
          record.marker
            ?.getElement?.()
            ?.classList.add(
              "is-food-cluster-hidden"
            );
        }
      );

      const coordinates =
        records.map(
          (record) =>
            record.place.geometry
              .coordinates
        );

      const averageLongitude =
        coordinates.reduce(
          (total, coordinate) =>
            total + coordinate[0],
          0
        ) /
        coordinates.length;

      const averageLatitude =
        coordinates.reduce(
          (total, coordinate) =>
            total + coordinate[1],
          0
        ) /
        coordinates.length;

      const clusterElement =
        document.createElement(
          "button"
        );

      clusterElement.type =
        "button";

      clusterElement.className =
        "food-cluster-marker";

      clusterElement.setAttribute(
        "aria-label",
        `這裡有${records.length}個城市味道地點`
      );

      const icon =
        document.createElement(
          "span"
        );

      icon.className =
        "food-cluster-rice";

      icon.innerHTML = `
  <svg
    class="food-cluster-rice-svg"
    viewBox="0 0 64 56"
    aria-hidden="true"
  >
    <!-- 底部陰影 -->
    <ellipse
      class="cluster-rice-shadow"
      cx="32"
      cy="49"
      rx="20"
      ry="4"
    ></ellipse>

    <!-- 白米飯 -->
    <path
      class="cluster-rice-grains"
      d="
        M15 27
        C16 17 22 10 31 9
        C41 8 48 15 50 27
        Z
      "
    ></path>

    <!-- 米飯紋理 -->
    <g class="cluster-rice-lines">
      <path d="M21 23 Q23 17 27 14"></path>
      <path d="M30 22 Q31 15 34 13"></path>
      <path d="M39 22 Q41 17 44 17"></path>
    </g>

    <!-- 小瓷碗 -->
    <path
      class="cluster-rice-bowl"
      d="
        M11 26
        Q32 33 53 26
        L49 40
        Q44 48 32 49
        Q20 48 15 40
        Z
      "
    ></path>

    <!-- 碗口 -->
    <path
      class="cluster-rice-rim"
      d="M11 26 Q32 33 53 26"
    ></path>

    <!-- 碗上的小裝飾 -->
    <path
      class="cluster-rice-decoration"
      d="M24 39 Q32 34 40 39"
    ></path>
  </svg>
`;

      const count =
        document.createElement(
          "strong"
        );

      count.className =
        "food-cluster-count";

      count.textContent =
        String(records.length);

      clusterElement.append(
        icon,
        count
      );

      clusterElement.addEventListener(
        "click",
        (event) => {
          event.stopPropagation();

          const bounds =
            new maplibregl
              .LngLatBounds();

          coordinates.forEach(
            (coordinate) => {
              bounds.extend(
                coordinate
              );
            }
          );

          map.fitBounds(
            bounds,
            {
              padding: 120,
              maxZoom: 14.2,
              duration: 1000,
              essential: true
            }
          );
        }
      );

      const marker =
        new maplibregl.Marker({
          element:
            clusterElement,

          anchor:
            "center"
        })
          .setLngLat([
            averageLongitude,
            averageLatitude
          ])
          .addTo(map);

      foodClusterMarkers.push({
        marker,
        records
      });
    }
  );
}

// ========================================
// 建立全部地點標記
// ========================================

function createAllPlaceMarkers() {
  placeMarkers.forEach(
    (markerRecord) => {
      markerRecord.marker.remove();
    }
  );

  placeMarkers.length = 0;

  allPlaces.forEach((place) => {
    createPlaceMarker(place);
  });

  updateMapMarkerVisibility();
  schedulePlaceLabelLayout();

  window.requestAnimationFrame(
    () => {
      updateFoodMarkerClusters();
    }
  );

  window.setTimeout(
    () => {
      updateFoodMarkerClusters();
    },
    350
  );
}

// ========================================
// 自動整理互相重疊的地點標籤
// ========================================

function schedulePlaceLabelLayout() {
  if (placeLabelLayoutFrame) {
    cancelAnimationFrame(
      placeLabelLayoutFrame
    );
  }

  placeLabelLayoutFrame =
    requestAnimationFrame(() => {
      placeLabelLayoutFrame =
        requestAnimationFrame(() => {
          arrangePlaceLabels();

          placeLabelLayoutFrame =
            null;
        });
    });
}

// ========================================
// 判斷標籤是否超出地圖範圍
// ========================================

function placeLabelInsideMap(
  labelRect,
  mapRect,
  padding = 10
) {
  return (
    labelRect.left >=
    mapRect.left + padding &&
    labelRect.right <=
    mapRect.right - padding &&
    labelRect.top >=
    mapRect.top + padding &&
    labelRect.bottom <=
    mapRect.bottom - padding
  );
}

// ========================================
// 設定地點標籤位置
// ========================================

function setPlaceLabelPosition(
  label,
  position
) {
  label.dataset.labelPosition =
    position.name;

  label.style.setProperty(
    "--place-label-x",
    `${position.x}px`
  );

  label.style.setProperty(
    "--place-label-y",
    `${position.y}px`
  );
}

// ========================================
// 取得標籤多層避讓位置
// ========================================

function getPlaceLabelPositions(
  labelWidth,
  labelHeight,
  placeId
) {
  const defaultAngles = [
    0,
    180,
    90,
    270,
    45,
    135,
    315,
    225
  ];

  const preferredAngles = {
    "lee-tung-street": [
      0,
      45,
      315,
      90,
      270,
      180,
      135,
      225
    ],

    "star-street-two-songs": [
      90,
      45,
      135,
      0,
      180,
      270,
      315,
      225
    ],

    "queens-road-east": [
      0,
      315,
      45,
      270,
      90,
      180,
      225,
      135
    ],

    "golden-age-causeway-bay": [
      45,
      0,
      90,
      315,
      135,
      180,
      270,
      225
    ],

    "next-station-tin-hau": [
      315,
      270,
      0,
      225,
      45,
      180,
      90,
      135
    ],

    "kowloon-park-pool": [
      180,
      225,
      135,
      270,
      90,
      0,
      315,
      45
    ],

    "hillwood-road": [
      0,
      315,
      45,
      270,
      90,
      180,
      225,
      135
    ],

    "peking-road-snow": [
      180,
      225,
      135,
      270,
      90,
      0,
      315,
      45
    ]
  };

  const angles =
    preferredAngles[placeId] ||
    defaultAngles;

  const ringDistances = [
    0,
    38,
    76,
    114,
    152
  ];

  const positions = [];

  ringDistances.forEach(
    (ringDistance, ringIndex) => {
      angles.forEach((angle) => {
        const radians =
          angle *
          Math.PI /
          180;

        const baseDistance =
          20 +
          Math.max(
            labelWidth,
            labelHeight
          ) /
          2 +
          ringDistance;

        const labelCentreX =
          Math.cos(radians) *
          baseDistance;

        const labelCentreY =
          Math.sin(radians) *
          baseDistance;

        const cssX =
          labelCentreX -
          23 -
          labelWidth / 2;

        const cssY =
          labelCentreY;

        positions.push({
          name:
            `angle-${angle}-ring-${ringIndex}`,
          angle,
          ring: ringIndex,
          x: cssX,
          y: cssY,
          distance: baseDistance
        });
      });
    }
  );

  return positions;
}

// ========================================
// 執行地點標籤多層自動避讓
// ========================================

function arrangePlaceLabels() {
  if (!map || !map.loaded()) {
    return;
  }

  const mapContainer =
    map.getContainer();

  const mapRect =
    mapContainer.getBoundingClientRect();

  const occupiedRects = [];

  pageElements.mapShell.classList.add(
    "is-arranging-place-labels"
  );

  placeMarkers.forEach((record) => {
    const label =
      record.element?.querySelector(
        ".place-marker-label"
      );

    if (!label) {
      return;
    }

    label.style.removeProperty(
      "--place-label-x"
    );

    label.style.removeProperty(
      "--place-label-y"
    );

    delete label.dataset.labelPosition;
    delete label.dataset.labelRing;
  });

  mapContainer.offsetHeight;

  const visibleMarkerRecords =
    placeMarkers
      .map((record, index) => {
        const button =
          record.element;

        const label =
          button?.querySelector(
            ".place-marker-label"
          );

        if (!button || !label) {
          return null;
        }

        const buttonStyle =
          window.getComputedStyle(
            button
          );

        const labelStyle =
          window.getComputedStyle(
            label
          );

        const isHidden =
          buttonStyle.display ===
          "none" ||
          buttonStyle.visibility ===
          "hidden" ||
          labelStyle.display ===
          "none" ||
          labelStyle.visibility ===
          "hidden" ||
          Number(labelStyle.opacity) ===
          0;

        if (isHidden) {
          return null;
        }

        const buttonRect =
          button.getBoundingClientRect();

        return {
          record,
          button,
          label,
          index,
          screenX:
            buttonRect.left +
            buttonRect.width / 2,
          screenY:
            buttonRect.top +
            buttonRect.height / 2,
          isSelected:
            button.classList.contains(
              "is-selected"
            )
        };
      })
      .filter(Boolean);

  const mapCentreX =
    mapRect.left +
    mapRect.width / 2;

  const mapCentreY =
    mapRect.top +
    mapRect.height / 2;

  visibleMarkerRecords.sort(
    (first, second) => {
      const getPriority = (item) => {
        const mediaType =
          item.record.place
            ?.properties
            ?.mediaType;

        if (mediaType === "song") {
          return 1;
        }

        if (
          mediaType === "film" ||
          mediaType === "television"
        ) {
          return 2;
        }

        if (
          mediaType === "personal"
        ) {
          return 3;
        }

        if (mediaType === "food") {
          return 4;
        }

        return 3;
      };

      if (
        first.isSelected !==
        second.isSelected
      ) {
        return first.isSelected
          ? -1
          : 1;
      }

      const priorityDifference =
        getPriority(first) -
        getPriority(second);

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      const firstDistance =
        Math.hypot(
          first.screenX -
          mapCentreX,
          first.screenY -
          mapCentreY
        );

      const secondDistance =
        Math.hypot(
          second.screenX -
          mapCentreX,
          second.screenY -
          mapCentreY
        );

      return (
        firstDistance -
        secondDistance
      );
    }
  );

  visibleMarkerRecords.forEach(
    ({
      record,
      label
    }) => {
      const baseRect =
        label.getBoundingClientRect();

      const positions =
        getPlaceLabelPositions(
          baseRect.width,
          baseRect.height,
          record.id
        );

      let chosenPosition = null;
      let chosenRect = null;
      let bestFallbackPosition = null;
      let bestFallbackScore =
        Number.POSITIVE_INFINITY;

      for (
        const position of positions
      ) {
        setPlaceLabelPosition(
          label,
          position
        );

        label.dataset.labelRing =
          String(position.ring);

        const candidateRect =
          label.getBoundingClientRect();

        const insideMap =
          placeLabelInsideMap(
            candidateRect,
            mapRect,
            8
          );

        let overlapArea = 0;

        occupiedRects.forEach(
          (occupiedRect) => {
            const overlapWidth =
              Math.max(
                0,
                Math.min(
                  candidateRect.right,
                  occupiedRect.right
                ) -
                Math.max(
                  candidateRect.left,
                  occupiedRect.left
                ) +
                10
              );

            const overlapHeight =
              Math.max(
                0,
                Math.min(
                  candidateRect.bottom,
                  occupiedRect.bottom
                ) -
                Math.max(
                  candidateRect.top,
                  occupiedRect.top
                ) +
                10
              );

            overlapArea +=
              overlapWidth *
              overlapHeight;
          }
        );

        if (
          insideMap &&
          overlapArea === 0
        ) {
          chosenPosition =
            position;

          chosenRect =
            candidateRect;

          break;
        }

        let fallbackScore =
          overlapArea;

        if (!insideMap) {
          const overflowLeft =
            Math.max(
              0,
              mapRect.left + 8 -
              candidateRect.left
            );

          const overflowRight =
            Math.max(
              0,
              candidateRect.right -
              mapRect.right +
              8
            );

          const overflowTop =
            Math.max(
              0,
              mapRect.top + 8 -
              candidateRect.top
            );

          const overflowBottom =
            Math.max(
              0,
              candidateRect.bottom -
              mapRect.bottom +
              8
            );

          fallbackScore +=
            (
              overflowLeft +
              overflowRight +
              overflowTop +
              overflowBottom
            ) *
            1000;
        }

        fallbackScore +=
          position.distance *
          0.25;

        if (
          fallbackScore <
          bestFallbackScore
        ) {
          bestFallbackScore =
            fallbackScore;

          bestFallbackPosition =
            position;
        }
      }

      if (
        !chosenPosition &&
        bestFallbackPosition
      ) {
        chosenPosition =
          bestFallbackPosition;

        setPlaceLabelPosition(
          label,
          chosenPosition
        );

        label.dataset.labelRing =
          String(
            chosenPosition.ring
          );

        chosenRect =
          label.getBoundingClientRect();
      }

      if (
        chosenPosition &&
        chosenRect
      ) {
        occupiedRects.push({
          left:
            chosenRect.left - 5,
          right:
            chosenRect.right + 5,
          top:
            chosenRect.top - 5,
          bottom:
            chosenRect.bottom + 5
        });
      }
    }
  );

  requestAnimationFrame(() => {
    pageElements.mapShell.classList.remove(
      "is-arranging-place-labels"
    );
  });
}

// ========================================
// 判斷美食地點類型
// ========================================

function getFoodMarkerType(information) {
  if (information.foodType) {
    return information.foodType;
  }

  const foodName =
    [
      information.title,
      information.shopName,
      information.location
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

  if (
    foodName.includes("菠蘿") ||
    foodName.includes("pineapple")
  ) {
    return "pineapple-bun";
  }

  if (
    foodName.includes("燒賣") ||
    foodName.includes("燒麥") ||
    foodName.includes("siu mai")
  ) {
    return "siu-mai";
  }

  if (
    foodName.includes("沙爹") ||
    foodName.includes("satay")
  ) {
    return "satay-beef-noodles";
  }

  if (
    foodName.includes("鮮茄") ||
    foodName.includes("番茄飯") ||
    foodName.includes("tomato rice")
  ) {
    return "baked-tomato-rice";
  }

  if (
    foodName.includes("港奶") ||
    foodName.includes("奶茶") ||
    foodName.includes("紅豆冰") ||
    foodName.includes("红豆冰") ||
    foodName.includes("milk tea")
  ) {
    return "milk-tea-red-bean-ice";
  }

  return "local-food";
}

// ========================================
// 建立紅磡體育館地標圖形
// ========================================

function createLandmarkMarkerVisual(
  information
) {
  const visual =
    document.createElement("span");

  visual.className =
    `landmark-marker-icon landmark-marker-${information.landmarkType || "default"}`;

  visual.setAttribute(
    "aria-hidden",
    "true"
  );

  if (
    information.landmarkType ===
    "hong-kong-coliseum"
  ) {
    visual.innerHTML = `
      <svg
        class="coliseum-marker-svg"
        viewBox="0 0 140 112"
        role="img"
        aria-label="香港體育館"
      >
        <defs>
          <linearGradient
            id="coliseum-roof-top"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0"
              stop-color="#fffdf2"
            ></stop>

            <stop
              offset="0.55"
              stop-color="#e9dfc9"
            ></stop>

            <stop
              offset="1"
              stop-color="#c8bca8"
            ></stop>
          </linearGradient>

          <linearGradient
            id="coliseum-roof-left"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0"
              stop-color="#ede4d2"
            ></stop>

            <stop
              offset="1"
              stop-color="#bdb09d"
            ></stop>
          </linearGradient>

          <linearGradient
            id="coliseum-roof-right"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0"
              stop-color="#d8cdbb"
            ></stop>

            <stop
              offset="1"
              stop-color="#aa9d8d"
            ></stop>
          </linearGradient>

          <linearGradient
            id="coliseum-light-band"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop
              offset="0"
              stop-color="#7dcac8"
            ></stop>

            <stop
              offset="0.34"
              stop-color="#a987c8"
            ></stop>

            <stop
              offset="0.68"
              stop-color="#e6a7bc"
            ></stop>

            <stop
              offset="1"
              stop-color="#7dcac8"
            ></stop>
          </linearGradient>
        </defs>

        <ellipse
          class="coliseum-marker-shadow"
          cx="70"
          cy="99"
          rx="48"
          ry="8"
        ></ellipse>

        <g class="coliseum-marker-building">
          <path
            class="coliseum-roof-top"
            d="M12 29 L67 8 L128 29 L73 49 Z"
          ></path>

          <path
            class="coliseum-roof-left"
            d="M12 29 L73 49 L59 73 L25 57 Z"
          ></path>

          <path
            class="coliseum-roof-right"
            d="M73 49 L128 29 L114 57 L59 73 Z"
          ></path>

          <path
            class="coliseum-light-band"
            d="M28 59 L59 73 L111 58 L108 65 L60 80 L31 67 Z"
          ></path>

          <path
            class="coliseum-base"
            d="M43 69 L60 78 L98 67 L101 88 L64 98 L39 87 Z"
          ></path>

          <path
            class="coliseum-entrance"
            d="M57 79 L94 69 L95 79 L59 89 Z"
          ></path>

          <path
            class="coliseum-support"
            d="M35 62 L44 88"
          ></path>

          <path
            class="coliseum-support"
            d="M49 69 L55 92"
          ></path>

          <path
            class="coliseum-support"
            d="M106 61 L96 87"
          ></path>

          <path
            class="coliseum-support"
            d="M94 67 L88 90"
          ></path>

          <path
            class="coliseum-step"
            d="M34 89 L63 102 L108 89"
          ></path>

          <path
            class="coliseum-step"
            d="M40 84 L63 95 L102 84"
          ></path>
        </g>
      </svg>
    `;
  }

  return visual;
}

// ========================================
// 取得食物種類顯示名稱
// ========================================

function getFoodTypeDisplayName(
  information = {}
) {
  if (
    information.mediaType !==
    "food"
  ) {
    return "";
  }

  const foodType =
    typeof getFoodMarkerType ===
      "function"
      ? getFoodMarkerType(
        information
      )
      : (
        information.foodType ||
        "local-food"
      );

  return (
    window.HK_FOOD_ICONS
      ?.definitions
      ?.[foodType]
      ?.label ||
    "香港味道"
  );
}

// ========================================
// 判斷地點的視覺類別
// ========================================

function getPlaceMediaCategory(
  information
) {
  const mediaType =
    information.mediaType ||
    (
      information.source ===
        "community"
        ? "personal"
        : "song"
    );

  if (
    mediaType === "film" ||
    mediaType === "television"
  ) {
    return "screen";
  }

  if (mediaType === "food") {
    return "food";
  }

  if (mediaType === "personal") {
    return "personal";
  }

  return "song";
}

// ========================================
// 建立單一地點標記
// ========================================

function createPlaceMarker(place) {
  const information =
    place.properties;

  const coordinates =
    place.geometry.coordinates;

  const placeType =
    getPlaceDisplayType(place);

  const markerAnchor =
    document.createElement("div");

  markerAnchor.className =
    "place-marker-anchor";

  const markerMediaType =
    information.mediaType ||
    (
      information.source ===
        "community"
        ? "personal"
        : "song"
    );

  const markerMediaCategory =
    getPlaceMediaCategory(
      information
    );

  markerAnchor.dataset.markerMedia =
    markerMediaType;

  markerAnchor.dataset.markerCategory =
    markerMediaCategory;

  if (markerMediaType === "food") {
    markerAnchor.style.zIndex = "80";
  } else if (
    markerMediaType === "song"
  ) {
    markerAnchor.style.zIndex = "60";
  } else if (
    markerMediaType === "film" ||
    markerMediaType === "television"
  ) {
    markerAnchor.style.zIndex = "50";
  } else {
    markerAnchor.style.zIndex = "40";
  }

  const button =
    document.createElement("button");

  button.type = "button";

  button.className = [
    "place-marker",
    `place-marker-${placeType}`,
    `place-marker-media-${markerMediaCategory}`
  ].join(" ");

  if (
    information.source ===
    "community"
  ) {
    button.classList.add(
      "is-community-place"
    );
  }

  if (
    information.pastImage ||
    information.pastPanorama
  ) {
    button.classList.add(
      "has-past-scene"
    );
  }

  button.dataset.placeId =
    information.id;

  button.setAttribute(
    "aria-label",
    `查看${information.shortLocation || information.location}`
  );

  let markerVisual;

  if (
    information.landmarkType ===
    "hong-kong-coliseum"
  ) {
    markerVisual =
      createLandmarkMarkerVisual(
        information
      );

    button.classList.add(
      "is-landmark-marker",
      "is-coliseum-marker"
    );
  } else if (
    information.mediaType === "food"
  ) {
    markerVisual =
      createFoodMarkerVisual(
        information
      );

    button.classList.add(
      "is-food-marker"
    );
  } else {
    markerVisual =
      document.createElement("span");

    markerVisual.className =
      "place-marker-dot";
  }
  const label =
    document.createElement("span");

  label.className =
    "place-marker-label";

  const locationName =
    document.createElement("strong");

  locationName.textContent =
    information.shortLocation ||
    information.location ||
    "城市記憶";

  const mediaTitle =
    document.createElement("small");

  const multipleSongs =
    Array.isArray(information.songs)
      ? information.songs
      : [];

  if (
    information.mediaType ===
    "food"
  ) {
    mediaTitle.textContent =
      `招牌 · ${getFoodTypeDisplayName(
        information
      )}`;
  } else if (
    multipleSongs.length
  ) {
    mediaTitle.textContent =
      multipleSongs
        .map(
          (song) =>
            `《${song.title}》`
        )
        .join("／");
  } else {
    mediaTitle.textContent =
      information.song
        ? `《${information.song}》`
        : information.title
          ? `《${information.title}》`
          : "";
  }

  label.append(
    locationName,
    mediaTitle
  );

  button.append(
    markerVisual,
    label
  );

  markerAnchor.appendChild(button);

  if (
    illuminatedPlaces.includes(
      information.id
    )
  ) {
    button.classList.add(
      "is-illuminated"
    );
  }

  button.addEventListener(
    "click",
    (event) => {
      event.stopPropagation();

      selectPlace(
        place,
        button
      );
    }
  );

  const longitude =
    Number(coordinates?.[0]);

  const latitude =
    Number(coordinates?.[1]);

  if (
    !Number.isFinite(longitude) ||
    !Number.isFinite(latitude)
  ) {
    console.warn(
      "地點座標無效：",
      information.id,
      coordinates
    );

    return;
  }

  const marker =
    new maplibregl.Marker({
      element: markerAnchor,
      anchor: "center"
    })
      .setLngLat([
        longitude,
        latitude
      ])
      .addTo(map);

  // 叮叮車與天星小輪永遠顯示在地點標記上方
  marker
    .getElement()
    .style
    .setProperty(
      "z-index",
      "2147483647",
      "important"
    );

  marker
    .getElement()
    .style
    .setProperty(
      "isolation",
      "isolate"
    );

  placeMarkers.push({
    id: information.id,
    type: placeType,
    place,
    marker,
    element: button
  });
}

// ========================================
// 判斷地點顯示類型
// ========================================

function getPlaceDisplayType(place) {
  const information =
    place.properties;

  if (
    information.source ===
    "community"
  ) {
    const mediaType =
      information.mediaType ||
      "personal";

    if (
      mediaType === "film" ||
      mediaType === "television"
    ) {
      return "community-screen";
    }

    return `community-${mediaType}`;
  }

  if (
    information.archiveType ===
    "archive"
  ) {
    return "archive";
  }

  return "featured";
}

// ========================================
// 開始地點沉浸體驗
// ========================================

function beginPlaceExperience(place) {
  const information =
    place.properties;

  const theme =
    information.experienceTheme ||
    "memory";

  pageElements.mapShell.classList.add(
    "is-place-focus"
  );

  pageElements.mapShell.dataset
    .experienceTheme = theme;

  placeMarkers.forEach((record) => {
    record.element.classList.toggle(
      "is-focus-target",
      record.id === information.id
    );
  });

  removePlaceStreetPath();
  renderPlaceAtmosphere(theme);
  renderPlaceDecorations(place);
}

// ========================================
// 根據地點類型顯示道路或區域
// ========================================

async function renderPlaceStreetPath(
  place,
  requestId
) {
  const roadData =
    await resolvePlaceGeometryData(
      place
    );

  if (
    requestId !== undefined &&
    (
      requestId !==
      streetHighlightRequestId ||
      selectedPlace !== place
    )
  ) {
    return false;
  }

  if (!roadData) {
    console.warn(
      "未能取得道路資料：",
      place.properties.shortLocation
    );
    return false;
  }

  removePlaceStreetPath();

  positionDecorationAtStreetEndpoint(
    place,
    roadData
  );

  map.addSource(
    "active-place-street",
    {
      type: "geojson",
      data: roadData
    }
  );

  const highlightType =
    getPlaceHighlightType(place);

  if (highlightType === "area") {
    addPlaceAreaLayers(place);
  } else {
    addPlaceStreetLayers(place);

    if (
      place.properties
        .experienceTheme ===
      "nathan-road"
    ) {
      renderNathanRoadScene(
        place,
        roadData
      );
    }

    fitCompleteStreetIntoView(
      place,
      roadData
    );
  }

  cacheCommunityRoadData(
    place,
    roadData
  );

  return true;
}

// ========================================
// 在相機到達地點後讀取地理資料
// ========================================

function schedulePlaceStreetPath(place) {
  streetHighlightRequestId += 1;

  const requestId =
    streetHighlightRequestId;

  let hasStarted = false;

  const tryToRender = () => {
    if (hasStarted) {
      return;
    }

    if (
      requestId !==
      streetHighlightRequestId ||
      selectedPlace !== place
    ) {
      return;
    }

    hasStarted = true;

    renderPlaceStreetPath(
      place,
      requestId
    ).catch((error) => {
      console.error(
        "地點道路與場景載入失敗：",
        error
      );
    });
  };

  map.once("moveend", () => {
    window.setTimeout(
      tryToRender,
      180
    );
  });

  map.once(
    "idle",
    tryToRender
  );
}

// ========================================
// 判斷應顯示道路、區域或單點
// ========================================

function getPlaceHighlightType(place) {
  const configuredType =
    place.properties.highlightType;

  if (configuredType) {
    return configuredType;
  }

  return [
    "park",
    "mountain",
    "area",
    "coast"
  ].includes(
    place.properties.sceneType
  )
    ? "area"
    : "street";
}

// ========================================
// 加入紫色街道線
// ========================================

function addPlaceStreetLayers(place) {
  map.addLayer({
    id: "active-place-street-glow",
    type: "line",
    source: "active-place-street",
    layout: {
      "line-cap": "round",
      "line-join": "round"
    },
    paint: {
      "line-color": "#77629c",
      "line-width": 16,
      "line-opacity": 0.18,
      "line-blur": 5
    }
  });

  map.addLayer({
    id: "active-place-street-line",
    type: "line",
    source: "active-place-street",
    layout: {
      "line-cap": "round",
      "line-join": "round"
    },
    paint: {
      "line-color":
        place.properties.themeColor ||
        "#77629c",
      "line-width": 7,
      "line-opacity": 0.94
    }
  });
}

// ========================================
// 加入紫色區域範圍
// ========================================

function addPlaceAreaLayers(place) {
  const colour =
    place.properties.themeColor ||
    "#77629c";

  map.addLayer({
    id: "active-place-area-fill",
    type: "fill",
    source: "active-place-street",
    paint: {
      "fill-color": colour,
      "fill-opacity": 0.16
    }
  });

  map.addLayer({
    id: "active-place-area-outline",
    type: "line",
    source: "active-place-street",
    layout: {
      "line-cap": "round",
      "line-join": "round"
    },
    paint: {
      "line-color": colour,
      "line-width": 5,
      "line-opacity": 0.9
    }
  });
}

// ========================================
// 取得地點的完整道路或區域資料
// ========================================

async function resolvePlaceGeometryData(
  place
) {
  const cachedGeometry =
    place.properties.roadGeometry;

  if (
    cachedGeometry?.type ===
    "FeatureCollection" &&
    cachedGeometry.features?.length
  ) {
    return cachedGeometry;
  }

  const placeId =
    place.properties.id;

  if (
    placeGeometryCache.has(placeId)
  ) {
    return placeGeometryCache.get(
      placeId
    );
  }

  const highlightType =
    getPlaceHighlightType(place);

  if (highlightType === "point") {
    return null;
  }

  const officialGeometry =
    await fetchOfficialPlaceGeometry(
      place,
      highlightType
    );

  if (officialGeometry) {
    placeGeometryCache.set(
      placeId,
      officialGeometry
    );

    return officialGeometry;
  }

  if (highlightType === "area") {
    return null;
  }

  const roadFeatures =
    queryVisibleRoadFeatures();

  if (!roadFeatures.length) {
    return null;
  }

  const targetNames = [
    place.properties.roadName,
    ...(
      place.properties
        .roadAliases || []
    )
  ]
    .filter(Boolean)
    .map(normalizeRoadName);

  const placePoint =
    map.project(
      place.geometry.coordinates
    );

  const candidates =
    roadFeatures
      .map((feature) => ({
        feature,
        name:
          getRoadFeatureName(
            feature
          ),
        distance:
          getFeatureScreenDistance(
            feature,
            placePoint
          )
      }))
      .filter((candidate) =>
        Number.isFinite(
          candidate.distance
        )
      );

  const namedMatches =
    targetNames.length
      ? candidates.filter(
        (candidate) => {
          const normalizedName =
            normalizeRoadName(
              candidate.name
            );

          return (
            normalizedName &&
            targetNames.some(
              (targetName) =>
                normalizedName ===
                targetName ||
                normalizedName.includes(
                  targetName
                ) ||
                targetName.includes(
                  normalizedName
                )
            )
          );
        }
      )
      : [];

  const selectedCandidate =
    [...(
      namedMatches.length
        ? namedMatches
        : candidates
    )].sort(
      (first, second) =>
        first.distance -
        second.distance
    )[0];

  if (
    !selectedCandidate ||
    selectedCandidate.distance > 150
  ) {
    return null;
  }

  const selectedName =
    normalizeRoadName(
      selectedCandidate.name
    );

  const matchingFeatures =
    selectedName
      ? candidates
        .filter((candidate) =>
          normalizeRoadName(
            candidate.name
          ) === selectedName
        )
        .map((candidate) =>
          candidate.feature
        )
      : [
        selectedCandidate.feature
      ];

  return {
    type: "FeatureCollection",
    features:
      removeDuplicateRoadFeatures(
        matchingFeatures
      )
  };
}

// ========================================
// 從 OpenStreetMap 取得完整形狀
// ========================================

async function fetchOfficialPlaceGeometry(
  place,
  highlightType
) {
  if (highlightType === "street") {
    const completeStreet =
      await fetchCompleteStreetGeometry(
        place
      );

    if (completeStreet) {
      return completeStreet;
    }
  }

  const information =
    place.properties;

  const query =
    information.highlightQuery ||
    information.roadName ||
    information.shortLocation ||
    information.location;

  if (!query) {
    return null;
  }

  const endpoint =
    new URL(
      "https://nominatim.openstreetmap.org/search"
    );

  endpoint.searchParams.set(
    "q",
    `${query}, Hong Kong`
  );

  endpoint.searchParams.set(
    "format",
    "geojson"
  );

  endpoint.searchParams.set(
    "polygon_geojson",
    "1"
  );

  endpoint.searchParams.set(
    "limit",
    "8"
  );

  endpoint.searchParams.set(
    "accept-language",
    "zh-Hant,en"
  );

  try {
    const response =
      await fetch(
        endpoint.toString(),
        {
          headers: {
            Accept:
              "application/geo+json"
          }
        }
      );

    if (!response.ok) {
      return null;
    }

    const data =
      await response.json();

    const acceptedTypes =
      highlightType === "area"
        ? [
          "Polygon",
          "MultiPolygon"
        ]
        : [
          "LineString",
          "MultiLineString"
        ];

    const matchingFeature =
      data.features?.find(
        (feature) =>
          acceptedTypes.includes(
            feature.geometry?.type
          )
      );

    if (!matchingFeature) {
      return null;
    }

    return {
      type: "FeatureCollection",
      features: [
        matchingFeature
      ]
    };
  } catch (error) {
    console.warn(
      "未能取得地點的完整地理範圍：",
      query,
      error
    );

    return null;
  }
}

// ========================================
// 取得所有同名街道路段
// ========================================

async function fetchCompleteStreetGeometry(
  place
) {
  const information =
    place.properties;

  const names = [
    information.roadName,
    ...(
      information.roadAliases ||
      []
    ),
    information.highlightQuery
  ].filter(Boolean);

  if (!names.length) {
    return null;
  }

  const escapedNames =
    names
      .map((name) =>
        String(name).replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        )
      )
      .join("|");

  const [
    longitude,
    latitude
  ] = place.geometry.coordinates;

  const radius =
    information.roadSearchRadius ||
    4000;

  const query = `
    [out:json][timeout: 25];
    (
      way(
        around: ${radius},
        ${latitude},
        ${longitude}
      )
      ["highway"]
      ["name"~"${escapedNames}", i];

      way(
        around: ${radius},
        ${latitude},
        ${longitude}
      )
      ["highway"]
      ["name:zh"~"${escapedNames}", i];

      way(
        around: ${radius},
        ${latitude},
        ${longitude}
      )
      ["highway"]
      ["name:en"~"${escapedNames}", i];
    );
    out geom;
  `;

  const endpoint =
    new URL(
      "https://overpass-api.de/api/interpreter"
    );

  endpoint.searchParams.set(
    "data",
    query
  );

  try {
    const response =
      await fetch(
        endpoint.toString()
      );

    if (!response.ok) {
      return null;
    }

    const data =
      await response.json();

    const features =
      (
        data.elements ||
        []
      )
        .filter((element) =>
          Array.isArray(
            element.geometry
          ) &&
          element.geometry.length > 1
        )
        .map((element) => ({
          type: "Feature",
          properties: {
            ...element.tags,
            osmId: element.id
          },
          geometry: {
            type: "LineString",
            coordinates:
              element.geometry.map(
                (point) => [
                  point.lon,
                  point.lat
                ]
              )
          }
        }));

    if (!features.length) {
      return null;
    }

    return {
      type: "FeatureCollection",
      features:
        removeDuplicateRoadFeatures(
          features
        )
    };
  } catch (error) {
    console.warn(
      "未能取得完整街道路段：",
      names[0],
      error
    );

    return null;
  }
}

// ========================================
// 把地點裝飾放到街道入口
// ========================================

function positionDecorationAtStreetEndpoint(
  place,
  geometryData
) {
  const endpointDirection =
    place.properties
      .decorationEndpoint;

  if (
    !endpointDirection ||
    !place.properties
      .decorations?.length
  ) {
    return;
  }

  const endpoints = [];

  geometryData.features.forEach(
    (feature) => {
      const lines =
        feature.geometry?.type ===
          "LineString"
          ? [
            feature.geometry.coordinates
          ]
          : feature.geometry?.type ===
            "MultiLineString"
            ? feature.geometry.coordinates
            : [];

      lines.forEach((line) => {
        if (line.length) {
          endpoints.push(
            line[0],
            line[line.length - 1]
          );
        }
      });
    }
  );

  if (!endpoints.length) {
    return;
  }

  const endpoint =
    [...endpoints].sort(
      (first, second) => {
        if (
          endpointDirection ===
          "south"
        ) {
          return (
            first[1] -
            second[1]
          );
        }

        if (
          endpointDirection ===
          "east"
        ) {
          return (
            second[0] -
            first[0]
          );
        }

        if (
          endpointDirection ===
          "west"
        ) {
          return (
            first[0] -
            second[0]
          );
        }

        return (
          second[1] -
          first[1]
        );
      }
    )[0];

  place.properties
    .decorations[0]
    .coordinates =
    endpoint;

  renderPlaceDecorations(place);
}

// ========================================
// 把完整街道調整到可見範圍
// ========================================

function fitCompleteStreetIntoView(
  place,
  geometryData
) {
  if (
    !place.properties
      .fitFullGeometry
  ) {
    return;
  }

  const bounds =
    new maplibregl.LngLatBounds();

  geometryData.features.forEach(
    (feature) => {
      const lines =
        feature.geometry?.type ===
          "LineString"
          ? [
            feature.geometry.coordinates
          ]
          : feature.geometry?.type ===
            "MultiLineString"
            ? feature.geometry.coordinates
            : [];

      lines.forEach((line) => {
        line.forEach(
          (coordinate) => {
            bounds.extend(
              coordinate
            );
          }
        );
      });
    }
  );

  if (bounds.isEmpty()) {
    return;
  }

  const desktop =
    window.innerWidth > 760;

  map.fitBounds(
    bounds,
    {
      padding: desktop
        ? {
          top:
            place.properties
              .geometryPaddingTop ??
            70,
          right:
            map.getContainer()
              .clientWidth *
            (
              place.properties
                .geometryRightPaddingRatio ??
              0.68
            ),
          bottom:
            place.properties
              .geometryPaddingBottom ??
            70,
          left: 55
        }
        : {
          top: 80,
          right: 35,
          bottom: 260,
          left: 35
        },
      maxZoom:
        place.properties
          .fullGeometryMaxZoom ||
        17.2,
      duration: 900,
      essential: true
    }
  );
}

// ========================================
// 查詢目前畫面內的道路圖徵
// ========================================

function queryVisibleRoadFeatures() {
  const features = [];

  roadSourceDescriptors.forEach(
    ({ source, sourceLayer }) => {
      try {
        const sourceFeatures =
          map.querySourceFeatures(
            source,
            {
              sourceLayer
            }
          );

        sourceFeatures.forEach(
          (feature) => {
            if (
              feature.geometry?.type ===
              "LineString" ||
              feature.geometry?.type ===
              "MultiLineString"
            ) {
              features.push({
                type: "Feature",
                properties: {
                  ...feature.properties
                },
                geometry:
                  feature.geometry
              });
            }
          }
        );
      } catch (error) {
        console.warn(
          "道路資料層暫時未能讀取：",
          sourceLayer,
          error
        );
      }
    }
  );

  return features;
}

// ========================================
// 讀取道路的中英文名稱
// ========================================

function getRoadFeatureName(feature) {
  const information =
    feature.properties || {};

  return (
    information["name:zh-Hant"] ||
    information.name_zh_Hant ||
    information.name_zh ||
    information["name:zh"] ||
    information["name:latin"] ||
    information.name_latin ||
    information.name_en ||
    information["name:en"] ||
    information.name ||
    ""
  );
}

// ========================================
// 統一道路名稱格式
// ========================================

function normalizeRoadName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(
      /[\s·．.\-_']/g,
      ""
    )
    .replace(
      /street|road|avenue|lane|drive/g,
      ""
    )
    .replace(
      /街|道|巷|里|徑/g,
      ""
    );
}

// ========================================
// 計算地點與道路的畫面距離
// ========================================

function getFeatureScreenDistance(
  feature,
  targetPoint
) {
  const lines =
    feature.geometry.type ===
      "LineString"
      ? [
        feature.geometry.coordinates
      ]
      : feature.geometry.coordinates;

  let minimumDistance = Infinity;

  lines.forEach((line) => {
    for (
      let index = 0;
      index < line.length - 1;
      index += 1
    ) {
      const start =
        map.project(
          line[index]
        );

      const end =
        map.project(
          line[index + 1]
        );

      minimumDistance =
        Math.min(
          minimumDistance,
          getPointToSegmentDistance(
            targetPoint,
            start,
            end
          )
        );
    }
  });

  return minimumDistance;
}

function getPointToSegmentDistance(
  point,
  start,
  end
) {
  const deltaX =
    end.x - start.x;

  const deltaY =
    end.y - start.y;

  if (!deltaX && !deltaY) {
    return Math.hypot(
      point.x - start.x,
      point.y - start.y
    );
  }

  const progress =
    Math.max(
      0,
      Math.min(
        1,
        (
          (
            point.x - start.x
          ) * deltaX +
          (
            point.y - start.y
          ) * deltaY
        ) /
        (
          deltaX * deltaX +
          deltaY * deltaY
        )
      )
    );

  return Math.hypot(
    point.x -
    (
      start.x +
      progress * deltaX
    ),
    point.y -
    (
      start.y +
      progress * deltaY
    )
  );
}

// ========================================
// 移除重複道路片段
// ========================================

function removeDuplicateRoadFeatures(
  features
) {
  const seen = new Set();

  return features.filter(
    (feature) => {
      const key =
        JSON.stringify(
          feature.geometry
        );

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    }
  );
}

// ========================================
// 保存用戶地點的道路資料
// ========================================

function cacheCommunityRoadData(
  place,
  roadData
) {
  if (
    place.properties.source !==
    "community" ||
    place.properties.roadGeometry
  ) {
    return;
  }

  place.properties.roadGeometry =
    roadData;

  saveStoredArray(
    STORAGE_KEYS.contributions,
    communityPlaces
  );
}

// ========================================
// 移除地點道路
// ========================================

function removePlaceStreetPath() {
  if (
    map.getLayer(
      "active-place-area-outline"
    )
  ) {
    map.removeLayer(
      "active-place-area-outline"
    );
  }

  if (
    map.getLayer(
      "active-place-area-fill"
    )
  ) {
    map.removeLayer(
      "active-place-area-fill"
    );
  }

  if (
    map.getLayer(
      "active-place-street-line"
    )
  ) {
    map.removeLayer(
      "active-place-street-line"
    );
  }

  if (
    map.getLayer(
      "active-place-street-glow"
    )
  ) {
    map.removeLayer(
      "active-place-street-glow"
    );
  }

  if (
    map.getSource(
      "active-place-street"
    )
  ) {
    map.removeSource(
      "active-place-street"
    );
  }
}

// ========================================
// 顯示地點氛圍
// ========================================

function renderPlaceAtmosphere(theme) {
  removePlaceAtmosphere();

  const supportedThemes = [
    "lee-tung",
    "nathan-road",
    "lau-fau-shan"
  ];

  if (
    !supportedThemes.includes(theme)
  ) {
    return;
  }

  const atmosphere =
    document.createElement("div");

  atmosphere.id =
    "place-atmosphere";

  atmosphere.className =
    `place-atmosphere ${theme}-atmosphere`;

  atmosphere.setAttribute(
    "aria-hidden",
    "true"
  );

  if (theme === "lee-tung") {
    const snowflakes =
      Array.from(
        {
          length: 24
        },
        () => "<i></i>"
      ).join("");

    atmosphere.innerHTML = `
      <div class="memory-snow">
        ${snowflakes}
      </div>
    `;
  } else if (
    theme === "nathan-road"
  ) {
    const rainDrops =
      Array.from(
        {
          length: 44
        },
        (_, index) => {
          const x =
            (index * 37 + 11) % 100;

          const delay =
            -(
              (index * 0.47) %
              8
            ).toFixed(2);

          const duration =
            (
              5.8 +
              (index % 7) * 0.7
            ).toFixed(2);

          const size =
            5 + (index % 5) * 2;

          const travel =
            65 + (index % 6) * 18;

          return `
            <i
              class="nathan-rain-drop"
              style="
                --rain-x: ${x}%;
                --rain-delay: ${delay}s;
                --rain-duration: ${duration}s;
                --rain-size: ${size}px;
                --rain-travel: ${travel}px;
              "
            ></i>
          `;
        }
      ).join("");

    atmosphere.innerHTML = `
      <div class="nathan-city-glow"></div>

      <div
        class="
          nathan-reflection
          reflection-red
        "
      ></div>

      <div
        class="
          nathan-reflection
          reflection-green
        "
      ></div>

      <div
        class="
          nathan-reflection
          reflection-amber
        "
      ></div>

      <div
        class="
          nathan-sign-light
          light-one
        "
      ></div>

      <div
        class="
          nathan-sign-light
          light-two
        "
      ></div>

      <div
        class="
          nathan-sign-light
          light-three
        "
      ></div>

      <div class="nathan-rain-window">
        ${rainDrops}
      </div>
    `;
  } else if (
    theme === "lau-fau-shan"
  ) {
    atmosphere.innerHTML = `
      <div
        class="lau-fau-sunset-wash"
      ></div>

      <div
        class="lau-fau-evening-glow"
      ></div>
    `;
  }

  pageElements.mapShell.appendChild(
    atmosphere
  );
}

// ========================================
// 移除地點氛圍
// ========================================

function removePlaceAtmosphere() {
  const atmosphere =
    document.querySelector(
      "#place-atmosphere"
    );

  if (atmosphere) {
    atmosphere.remove();
  }
}

// ========================================
// 建立綁定真實座標的地點裝飾
// ========================================

function renderPlaceDecorations(place) {
  removePlaceDecorations();

  if (
    place.properties.experienceTheme ===
    "nathan-road"
  ) {
    return;
  }

  const decorations =
    place.properties.decorations || [];

  decorations.forEach(
    (decoration) => {
      if (
        !Array.isArray(
          decoration.coordinates
        ) ||
        decoration.coordinates.length !==
        2
      ) {
        return;
      }

      const markerAnchor =
        document.createElement("div");

      markerAnchor.className =
        "place-decoration-anchor";

      const decorationElement =
        document.createElement("div");

      decorationElement.className =
        `place-decoration decoration-${decoration.type}`;

      decorationElement.setAttribute(
        "aria-hidden",
        "true"
      );

      if (
        decoration.type ===
        "double-happiness"
      ) {
        decorationElement.innerHTML = `
          <span class="decoration-xi">
            ${decoration.label || "囍"}
          </span>
        `;
      } else if (
        decoration.type ===
        "purple-fountain"
      ) {
        decorationElement.innerHTML = `
          <span class="kowloon-purple-fountain">
            <svg
              class="purple-fountain-svg"
              viewBox="0 0 200 150"
              role="img"
              aria-label="九龍公園紫色噴泉"
            >
              <ellipse
                class="fountain-ground-shadow"
                cx="100"
                cy="132"
                rx="82"
                ry="13"
              ></ellipse>

              <path
                class="fountain-outer-basin"
                d="
                  M16 105
                  C22 87 55 77 100 77
                  C145 77 178 87 184 105
                  L177 125
                  C162 140 40 140 23 125
                  Z
                "
              ></path>

              <ellipse
                class="fountain-water-surface"
                cx="100"
                cy="104"
                rx="75"
                ry="23"
              ></ellipse>

              <ellipse
                class="fountain-centre-platform"
                cx="100"
                cy="103"
                rx="23"
                ry="8"
              ></ellipse>

              <path
                class="fountain-water-jet jet-left"
                d="
                  M89 101
                  C63 77 62 50 76 29
                "
              ></path>

              <path
                class="fountain-water-jet jet-centre"
                d="
                  M100 101
                  C99 66 99 34 101 10
                "
              ></path>

              <path
                class="fountain-water-jet jet-right"
                d="
                  M111 101
                  C137 77 138 50 124 29
                "
              ></path>

              <path
                class="fountain-water-jet jet-small-left"
                d="
                  M82 102
                  C67 92 59 79 60 65
                "
              ></path>

              <path
                class="fountain-water-jet jet-small-right"
                d="
                  M118 102
                  C133 92 141 79 140 65
                "
              ></path>

              <ellipse
                class="fountain-ripple ripple-one"
                cx="100"
                cy="104"
                rx="31"
                ry="8"
              ></ellipse>

              <ellipse
                class="fountain-ripple ripple-two"
                cx="100"
                cy="104"
                rx="48"
                ry="13"
              ></ellipse>

              <circle
                class="fountain-drop drop-one"
                cx="73"
                cy="39"
                r="3"
              ></circle>

              <circle
                class="fountain-drop drop-two"
                cx="128"
                cy="43"
                r="2.5"
              ></circle>

              <circle
                class="fountain-drop drop-three"
                cx="101"
                cy="24"
                r="2.5"
              ></circle>
            </svg>
          </span>
        `;
      } else if (
        decoration.type ===
        "red-apple-wall"
      ) {
        decorationElement.innerHTML = `
          <span class="to-kwa-wan-apple-wall">
            <svg
              class="to-kwa-wan-apple-mural"
              viewBox="0 0 180 150"
              role="img"
              aria-label="土瓜灣街市紅蘋果壁畫"
            >
              <rect
                class="apple-wall-background"
                x="3"
                y="3"
                width="174"
                height="144"
                rx="2"
              ></rect>

              <path
                class="apple-wall-seam"
                d="M90 3 V147"
              ></path>

              <path
                class="apple-mural-stem"
                d="M102 39 L108 13"
              ></path>

              <path
                class="apple-mural-leaf"
                d="
                  M99 31
                  C82 30 67 20 57 8
                  C76 7 94 16 104 29
                  Z
                "
              ></path>

              <path
                class="apple-mural-fruit"
                d="
                  M95 40
                  C79 31 59 32 44 42
                  C27 53 20 73 22 94
                  C24 116 39 132 61 136
                  C73 138 84 136 92 132
                  C101 137 113 138 124 134
                  C145 127 157 107 157 84
                  C157 61 145 45 128 39
                  C117 35 105 35 95 40
                  Z
                "
              ></path>
            </svg>
          </span>
        `;
      } else if (
        decoration.type ===
        "lau-fau-sunset"
      ) {
        decorationElement.innerHTML = `
          <div
            class="lau-fau-sunset-scene"
          >
            <span
              class="lau-fau-sun"
            ></span>

            <span
              class="
                lau-fau-cloud
                cloud-one
              "
            ></span>

            <span
              class="
                lau-fau-cloud
                cloud-two
              "
            ></span>

            <span
              class="lau-fau-distant-hills"
            ></span>

            <span
              class="lau-fau-sea"
            >
              <i
                class="sun-reflection"
              ></i>

              <i
                class="
                  water-line
                  water-one
                "
              ></i>

              <i
                class="
                  water-line
                  water-two
                "
              ></i>

              <i
                class="
                  water-line
                  water-three
                "
              ></i>
            </span>

            <span
              class="
                oyster-pole
                pole-one
              "
            ></span>

            <span
              class="
                oyster-pole
                pole-two
              "
            ></span>

            <span
              class="
                oyster-pole
                pole-three
              "
            ></span>

            <span
              class="
                oyster-pole
                pole-four
              "
            ></span>
          </div>
        `;
      } else if (
        decoration.type ===
        "traffic-light"
      ) {
        decorationElement.innerHTML = `
          <span class="traffic-light-box">
            <i class="traffic-red"></i>
            <i class="traffic-amber"></i>
            <i class="traffic-green"></i>
          </span>

          <span
            class="traffic-light-pole"
          ></span>
        `;
      } else if (
        decoration.type ===
        "crowd"
      ) {
        decorationElement.innerHTML = `
          <span
            class="crowd-person person-one"
          ></span>

          <span
            class="crowd-person person-two"
          ></span>

          <span
            class="crowd-person person-three"
          ></span>

          <span
            class="crowd-person person-four"
          ></span>

          <span
            class="crowd-person person-five"
          ></span>
        `;
      } else if (
        decoration.type ===
        "street-traffic"
      ) {
        decorationElement.innerHTML = `
          <span class="mini-road">
            <i
              class="mini-car car-red"
            ></i>

            <i
              class="mini-car car-blue"
            ></i>

            <i
              class="mini-car car-cream"
            ></i>
          </span>
        `;
      } else {
        decorationElement.textContent =
          decoration.label || "";
      }

      markerAnchor.appendChild(
        decorationElement
      );

      const marker =
        new maplibregl.Marker({
          element: markerAnchor,
          anchor: "bottom"
        })
          .setLngLat(
            decoration.coordinates
          )
          .addTo(map);

      placeDecorationMarkers.push(
        marker
      );
    }
  );
}

// ========================================
// 彌敦道：沿真實道路建立城市動畫
// ========================================

function renderNathanRoadScene(
  place,
  geometryData
) {
  removePlaceDecorations();

  const route =
    buildNathanRoadRoute(geometryData);

  if (route.length < 2) {
    return;
  }

  [0.2, 0.48, 0.76].forEach(
    (progress, index) => {
      const routePoint =
        sampleSceneRoute(
          route,
          progress,
          index % 2 === 0 ? 7 : -7
        );

      createNathanSceneMarker(
        "traffic-light",
        routePoint.coordinates,
        `
          <span class="traffic-light-box">
            <i class="traffic-red"></i>
            <i class="traffic-amber"></i>
            <i class="traffic-green"></i>
          </span>

          <span
            class="traffic-light-pole"
          ></span>
        `
      );
    }
  );

  [0.27, 0.52, 0.73].forEach(
    (progress, index) => {
      const routePoint =
        sampleSceneRoute(
          route,
          progress,
          index % 2 === 0
            ? 22
            : -22
        );

      const peopleMarkup =
        index === 1
          ? `
            <span
              class="crowd-person person-two"
            ></span>

            <span
              class="crowd-person person-five"
            ></span>
          `
          : `
            <span
              class="crowd-person person-one"
            ></span>

            <span
              class="crowd-person person-three"
            ></span>

            <span
              class="crowd-person person-four"
            ></span>
          `;

      createNathanSceneMarker(
        "crowd",
        routePoint.coordinates,
        peopleMarkup
      );
    }
  );

  const carSettings = [
    {
      colour: "red",
      phase: 0,
      direction: 1,
      lane: 3.2
    },
    {
      colour: "blue",
      phase: 0.22,
      direction: -1,
      lane: -3.2
    },
    {
      colour: "cream",
      phase: 0.4,
      direction: 1,
      lane: 3.2
    },
    {
      colour: "green",
      phase: 0.61,
      direction: -1,
      lane: -3.2
    },
    {
      colour: "taxi",
      phase: 0.78,
      direction: 1,
      lane: 3.2
    },
    {
      colour: "purple",
      phase: 0.9,
      direction: -1,
      lane: -3.2
    }
  ];

  const movingCars =
    carSettings.map((settings) => {
      const car =
        document.createElement("div");

      car.className =
        `nathan-moving-car car-${settings.colour}`;

      car.innerHTML = `
        <span class="car-window"></span>
        <i class="car-wheel wheel-left"></i>
        <i class="car-wheel wheel-right"></i>
      `;

      const anchor =
        document.createElement("div");

      anchor.className =
        "nathan-moving-car-anchor";

      anchor.appendChild(car);

      const marker =
        new maplibregl.Marker({
          element: anchor,
          anchor: "center"
        })
          .setLngLat(route[0])
          .addTo(map);

      placeDecorationMarkers.push(
        marker
      );

      return {
        ...settings,
        marker,
        element: car
      };
    });

  const animationStartedAt =
    performance.now();

  const journeyDuration = 60000;

  const animateCars = (time) => {
    const elapsed =
      (time - animationStartedAt) /
      journeyDuration;

    movingCars.forEach((car) => {
      let progress =
        (elapsed + car.phase) % 1;

      if (car.direction < 0) {
        progress = 1 - progress;
      }

      const routePoint =
        sampleSceneRoute(
          route,
          progress,
          car.lane
        );

      car.marker.setLngLat(
        routePoint.coordinates
      );

      const directionAngle =
        car.direction > 0
          ? routePoint.angle
          : routePoint.angle + 180;

      car.element.style.transform =
        `rotate(${directionAngle}deg)`;
    });

    placeSceneAnimationFrameId =
      requestAnimationFrame(
        animateCars
      );
  };

  placeSceneAnimationFrameId =
    requestAnimationFrame(
      animateCars
    );
}

// ========================================
// 建立彌敦道裝飾標記
// ========================================

function createNathanSceneMarker(
  type,
  coordinates,
  markup
) {
  const anchor =
    document.createElement("div");

  anchor.className =
    "place-decoration-anchor";

  const element =
    document.createElement("div");

  element.className =
    `place-decoration decoration-${type}`;

  element.setAttribute(
    "aria-hidden",
    "true"
  );

  element.innerHTML = markup;

  anchor.appendChild(element);

  const marker =
    new maplibregl.Marker({
      element: anchor,
      anchor: "bottom"
    })
      .setLngLat(coordinates)
      .addTo(map);

  placeDecorationMarkers.push(
    marker
  );

  return marker;
}

// ========================================
// 將彌敦道 geometry 整理成連續路徑
// ========================================

function buildNathanRoadRoute(
  geometryData
) {
  const coordinates = [];

  geometryData.features.forEach(
    (feature) => {
      const geometry =
        feature.geometry;

      if (
        geometry?.type ===
        "LineString"
      ) {
        coordinates.push(
          ...geometry.coordinates
        );
      } else if (
        geometry?.type ===
        "MultiLineString"
      ) {
        geometry.coordinates.forEach(
          (line) => {
            coordinates.push(...line);
          }
        );
      }
    }
  );

  const latitudeGroups =
    new Map();

  coordinates.forEach(
    (coordinate) => {
      const key =
        Math.round(
          coordinate[1] * 10000
        );

      if (
        !latitudeGroups.has(key)
      ) {
        latitudeGroups.set(
          key,
          []
        );
      }

      latitudeGroups
        .get(key)
        .push(coordinate);
    }
  );

  return [
    ...latitudeGroups.values()
  ]
    .map((group) => [
      group.reduce(
        (sum, point) =>
          sum + point[0],
        0
      ) / group.length,
      group.reduce(
        (sum, point) =>
          sum + point[1],
        0
      ) / group.length
    ])
    .sort(
      (first, second) =>
        first[1] - second[1]
    );
}

// ========================================
// 取得道路某個進度的座標與方向
// ========================================

function sampleSceneRoute(
  route,
  progress,
  laneOffsetMetres = 0
) {
  const segmentLengths = [];

  let totalLength = 0;

  for (
    let index = 1;
    index < route.length;
    index += 1
  ) {
    const first =
      route[index - 1];

    const second =
      route[index];

    const averageLatitude =
      (first[1] + second[1]) / 2;

    const longitudeScale =
      Math.cos(
        averageLatitude *
        Math.PI /
        180
      );

    const x =
      (second[0] - first[0]) *
      longitudeScale;

    const y =
      second[1] - first[1];

    const length =
      Math.hypot(x, y);

    segmentLengths.push(length);
    totalLength += length;
  }

  let remaining =
    Math.max(
      0,
      Math.min(1, progress)
    ) * totalLength;

  let segmentIndex = 0;

  while (
    segmentIndex <
    segmentLengths.length - 1 &&
    remaining >
    segmentLengths[segmentIndex]
  ) {
    remaining -=
      segmentLengths[segmentIndex];

    segmentIndex += 1;
  }

  const first =
    route[segmentIndex];

  const second =
    route[segmentIndex + 1];

  const segmentLength =
    segmentLengths[segmentIndex] ||
    1;

  const amount =
    remaining / segmentLength;

  let longitude =
    first[0] +
    (second[0] - first[0]) *
    amount;

  let latitude =
    first[1] +
    (second[1] - first[1]) *
    amount;

  const latitudeMetres =
    111320;

  const longitudeMetres =
    latitudeMetres *
    Math.cos(
      latitude *
      Math.PI /
      180
    );

  const dx =
    (second[0] - first[0]) *
    longitudeMetres;

  const dy =
    (second[1] - first[1]) *
    latitudeMetres;

  const metres =
    Math.hypot(dx, dy) || 1;

  longitude +=
    (-dy / metres) *
    laneOffsetMetres /
    longitudeMetres;

  latitude +=
    (dx / metres) *
    laneOffsetMetres /
    latitudeMetres;

  return {
    coordinates: [
      longitude,
      latitude
    ],
    angle:
      Math.atan2(dx, dy) *
      180 /
      Math.PI
  };
}

// ========================================
// 移除地點裝飾
// ========================================

function removePlaceDecorations() {
  if (placeSceneAnimationFrameId) {
    cancelAnimationFrame(
      placeSceneAnimationFrameId
    );

    placeSceneAnimationFrameId =
      null;
  }

  placeDecorationMarkers.forEach(
    (marker) => {
      marker.remove();
    }
  );

  placeDecorationMarkers.length = 0;
}

// ========================================
// 選擇地點
// ========================================

function selectPlace(
  place,
  markerElement = null
) {
  selectedPlace = place;

  if (selectedMarker) {
    selectedMarker.classList.remove(
      "is-selected"
    );
  }

  selectedMarker =
    markerElement ||
    findMarkerElement(
      place.properties.id
    );

  selectedMarker?.classList.add(
    "is-selected"
  );

  const coordinates =
    place.geometry.coordinates;

  const isHarbourPlace =
    place.properties.sceneType ===
    "harbour";

  const isAreaPlace =
    getPlaceHighlightType(place) ===
    "area";

  const requestedZoom =
    place.properties.focusZoom ??
    17.6;

  const finalFocusZoom =
    isHarbourPlace
      ? requestedZoom
      : isAreaPlace
        ? (
          place.properties
            .areaFocusZoom ??
          16.4
        )
        : Math.max(
          requestedZoom,
          17.8
        );

  beginPlaceExperience(place);

  map.flyTo({
    center: coordinates,
    zoom: finalFocusZoom,
    pitch: 0,
    bearing:
      place.properties
        .focusBearing ??
      0,
    duration:
      place.properties
        .focusDuration ??
      1850,
    curve: 1.35,
    offset:
      window.innerWidth > 760
        ? [
          map
            .getContainer()
            .clientWidth *
          (
            place.properties
              .focusOffsetRatio ??
            -0.27
          ),
          0
        ]
        : [0, 0],
    essential: true
  });

  schedulePlaceStreetPath(place);

  pageElements.mapShell.dataset
    .activePlace =
    place.properties.id || "";

  openStoryPanel(place);
}

// ========================================
// 尋找地點標記元素
// ========================================

function findMarkerElement(placeId) {
  return placeMarkers.find(
    (record) =>
      record.id === placeId
  )?.element;
}

// ========================================
// 顯示地點故事
// ========================================

function openStoryPanel(place) {
  const information =
    place.properties;

  const mediaType =
    information.mediaType ||
    "song";

  pageElements.storyCategory.textContent =
    getMediaCategoryName(
      mediaType,
      information.source
    );

  const multipleSongs =
    Array.isArray(information.songs)
      ? information.songs
      : [];

  if (multipleSongs.length) {
    pageElements.storyTitle.textContent =
      multipleSongs
        .map(
          (song) =>
            `《${song.title}》`
        )
        .join("／");
  } else {
    pageElements.storyTitle.textContent =
      information.song
        ? `《${information.song}》`
        : information.title
          ? mediaType === "food"
            ? information.title
            : `《${information.title}》`
          : information.shortLocation ||
          information.location ||
          "城市記憶";
  }

  const songSingers =
    multipleSongs
      .map((song) => song.singer)
      .filter(Boolean);

  const uniqueSingers = [
    ...new Set(songSingers)
  ];

  const foodTypeName =
    mediaType === "food"
      ? getFoodTypeDisplayName(
        information
      )
      : "";

  const locationIsRepeated =
    mediaType === "food" &&
    information.location &&
    information.title &&
    information.location.trim() ===
    information.title.trim();

  const metaParts = [
    mediaType === "food"
      ? `招牌 · ${foodTypeName}`
      : (
        multipleSongs.length
          ? uniqueSingers.join(" · ")
          : information.singer ||
          information.creator
      ),

    locationIsRepeated
      ? ""
      : information.location,

    information.year
  ].filter(Boolean);

  pageElements.storyMeta.textContent =
    metaParts.join(" · ");

  pageElements.storyExcerptHeading
    .textContent =
    mediaType === "film" ||
      mediaType === "television"
      ? "台詞摘錄"
      : mediaType === "food"
        ? "味道記憶"
        : mediaType === "personal"
          ? "個人記憶"
          : "歌詞摘錄";

  if (multipleSongs.length) {
    pageElements.storyExcerpt.textContent =
      multipleSongs
        .map((song) => {
          const songText =
            song.lyric ||
            song.excerpt ||
            "歌詞內容仍在整理中。";

          return (
            `《${song.title}》\n` +
            songText
          );
        })
        .join("\n\n");
  } else {
    pageElements.storyExcerpt.textContent =
      information.lyric ||
      information.excerpt ||
      " ";
  }

  pageElements.storyDescription
    .textContent =
    information.description ||
    "這是一個由觀眾共同點亮的香港城市記憶。";

  configureStoryImages(
    information,
    "current"
  );

  configureSpotifyPlayer(
    information
  );

  configureAudioButton(
    information
  );

  updateStoryLightButton(
    information.id
  );

  const isEditableContribution =
    information.source ===
    "community";

  pageElements.editContributionButton
    .hidden =
    !isEditableContribution;

  pageElements.deleteContributionButton
    .hidden =
    !isEditableContribution;

  pageElements.storyPanel.classList.add(
    "is-open"
  );

  pageElements.storyPanel.setAttribute(
    "aria-hidden",
    "false"
  );
}

// ========================================
// 顯示媒體類型名稱
// ========================================

function getMediaCategoryName(
  mediaType,
  source
) {
  if (source === "community") {
    return "共同點亮的城市記憶";
  }

  const names = {
    song: "粵語歌曲地點",
    film: "香港電影場景",
    television: "香港電視場景",
    food: "香港城市味道",
    personal: "個人城市記憶"
  };

  return (
    names[mediaType] ||
    "香港城市記憶"
  );
}

// ========================================
// 開啟地點照片資料庫
// ========================================

function openPlacePhotoDatabase() {
  if (placePhotoDatabasePromise) {
    return placePhotoDatabasePromise;
  }

  placePhotoDatabasePromise =
    new Promise(
      (resolve, reject) => {
        if (!window.indexedDB) {
          reject(
            new Error(
              "這個瀏覽器不支援地點照片儲存。"
            )
          );

          return;
        }

        const request =
          window.indexedDB.open(
            PLACE_PHOTO_DATABASE.name,
            PLACE_PHOTO_DATABASE.version
          );

        request.onupgradeneeded = () => {
          const database =
            request.result;

          let store;

          if (
            !database.objectStoreNames
              .contains(
                PLACE_PHOTO_DATABASE
                  .storeName
              )
          ) {
            store =
              database.createObjectStore(
                PLACE_PHOTO_DATABASE
                  .storeName,
                {
                  keyPath: "photoId"
                }
              );
          } else {
            store =
              request.transaction
                .objectStore(
                  PLACE_PHOTO_DATABASE
                    .storeName
                );
          }

          if (
            !store.indexNames.contains(
              PLACE_PHOTO_DATABASE
                .placeIndexName
            )
          ) {
            store.createIndex(
              PLACE_PHOTO_DATABASE
                .placeIndexName,
              "placeId",
              {
                unique: false
              }
            );
          }
        };

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          placePhotoDatabasePromise =
            null;

          reject(
            request.error ||
            new Error(
              "無法開啟地點照片資料庫。"
            )
          );
        };
      }
    );

  return placePhotoDatabasePromise;
}

// ========================================
// 讀取一個地點後續添加的照片
// ========================================

async function loadAddedPlacePhotos(
  placeId
) {
  if (!placeId) {
    return [];
  }

  const database =
    await openPlacePhotoDatabase();

  return new Promise(
    (resolve, reject) => {
      const transaction =
        database.transaction(
          PLACE_PHOTO_DATABASE.storeName,
          "readonly"
        );

      const store =
        transaction.objectStore(
          PLACE_PHOTO_DATABASE.storeName
        );

      const placeIndex =
        store.index(
          PLACE_PHOTO_DATABASE
            .placeIndexName
        );

      const request =
        placeIndex.getAll(placeId);

      request.onsuccess = () => {
        const photos =
          Array.isArray(request.result)
            ? request.result
            : [];

        photos.sort(
          (firstPhoto, secondPhoto) =>
            String(firstPhoto.createdAt)
              .localeCompare(
                String(
                  secondPhoto.createdAt
                )
              )
        );

        resolve(photos);
      };

      request.onerror = () => {
        reject(
          request.error ||
          new Error(
            "無法讀取地點照片。"
          )
        );
      };
    }
  );
}

// ========================================
// 儲存一張後續添加的照片
// ========================================

async function saveAddedPlacePhoto(
  photoRecord
) {
  const database =
    await openPlacePhotoDatabase();

  return new Promise(
    (resolve, reject) => {
      const transaction =
        database.transaction(
          PLACE_PHOTO_DATABASE.storeName,
          "readwrite"
        );

      const store =
        transaction.objectStore(
          PLACE_PHOTO_DATABASE.storeName
        );

      store.put(photoRecord);

      transaction.oncomplete = () => {
        resolve(photoRecord);
      };

      transaction.onerror = () => {
        reject(
          transaction.error ||
          new Error(
            "照片儲存失敗。"
          )
        );
      };

      transaction.onabort = () => {
        reject(
          transaction.error ||
          new Error(
            "照片儲存被中止。"
          )
        );
      };
    }
  );
}

// ========================================
// 刪除一張後續添加的照片
// ========================================

async function deleteAddedPlacePhoto(
  photoId
) {
  if (!photoId) {
    return;
  }

  const database =
    await openPlacePhotoDatabase();

  return new Promise(
    (resolve, reject) => {
      const transaction =
        database.transaction(
          PLACE_PHOTO_DATABASE.storeName,
          "readwrite"
        );

      const store =
        transaction.objectStore(
          PLACE_PHOTO_DATABASE.storeName
        );

      store.delete(photoId);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(
          transaction.error ||
          new Error(
            "照片刪除失敗。"
          )
        );
      };

      transaction.onabort = () => {
        reject(
          transaction.error ||
          new Error(
            "照片刪除被中止。"
          )
        );
      };
    }
  );
}

// ========================================
// 讀取地點原有的現在照片
// ========================================

function getOriginalPlacePhotos(
  information
) {
  const photos = [];

  const usedSources = new Set();

  function addPhoto(
    source,
    caption = "",
    photoSource = "system"
  ) {
    if (
      typeof source !== "string" ||
      !source.trim() ||
      usedSources.has(source)
    ) {
      return;
    }

    usedSources.add(source);

    photos.push({
      src: source,
      caption,
      source: photoSource,
      photoId: ""
    });
  }

  if (
    Array.isArray(
      information.currentImages
    )
  ) {
    information.currentImages
      .forEach((photo) => {
        if (
          typeof photo === "string"
        ) {
          addPhoto(photo);
          return;
        }

        if (photo?.src) {
          addPhoto(
            photo.src,
            photo.caption || "",
            photo.source || "system"
          );
        }
      });
  }

  addPhoto(
    information.currentImage,
    information.currentCaption || "",
    "system"
  );

  addPhoto(
    information.image,
    information.currentCaption || "",
    "system"
  );

  addPhoto(
    information.photo,
    information.currentCaption || "",
    information.source === "community"
      ? "original-community"
      : "system"
  );

  return photos;
}

// ========================================
// 清理地點影像畫面
// ========================================

function clearStoryImageDisplay() {
  pageElements.storyImage.onload = null;
  pageElements.storyImage.onerror = null;

  pageElements.storyImage
    .removeAttribute("src");

  pageElements.storyImage.alt = "";

  pageElements.storyImage
    .classList.remove(
      "is-visible"
    );

  pageElements.storyImagePlaceholder
    .classList.remove(
      "is-hidden"
    );

  pageElements.storyImageCaption
    .textContent = "";

  pageElements.storyPreviousPhotoButton
    .hidden = true;

  pageElements.storyNextPhotoButton
    .hidden = true;

  pageElements.storyPhotoCount
    .hidden = true;

  if (
    pageElements.storyDeletePhotoButton
  ) {
    pageElements.storyDeletePhotoButton
      .hidden = true;
  }
}

// ========================================
// 顯示目前選中的照片
// ========================================
function renderSelectedStoryPhoto(
  information
) {
  clearStoryImageDisplay();

  const placeName =
    information.shortLocation ||
    information.location ||
    information.title ||
    information.song ||
    "這個地點";

  const selectedPhoto =
    storyPhotoItems[
    storyPhotoIndex
    ];

  pageElements.storyPhotoToolbar
    ?.classList.toggle(
      "is-hidden",
      storyPhotoMode !== "current"
    );

  if (!selectedPhoto?.src) {
    return;
  }

  pageElements.storyImagePlaceholder
    .classList.add(
      "is-hidden"
    );

  pageElements.storyImage
    .classList.add(
      "is-visible"
    );

  const hasMultiplePhotos =
    storyPhotoItems.length > 1;

  pageElements.storyPreviousPhotoButton
    .hidden =
    !hasMultiplePhotos;

  pageElements.storyNextPhotoButton
    .hidden =
    !hasMultiplePhotos;

  pageElements.storyPhotoCount.hidden =
    storyPhotoMode !== "current";

  pageElements.storyPhotoCount
    .textContent =
    `${storyPhotoIndex + 1} / ${storyPhotoItems.length}`;

  const photoCanBeDeleted =
    selectedPhoto.source ===
    "community" ||
    selectedPhoto.source ===
    "original-community";

  if (
    pageElements.storyDeletePhotoButton
  ) {
    pageElements.storyDeletePhotoButton
      .hidden =
      !photoCanBeDeleted ||
      storyPhotoMode !== "current";
  }

  const showLoadedPhoto = () => {
    pageElements.storyImage
      .classList.add(
        "is-visible"
      );

    pageElements.storyImagePlaceholder
      .classList.add(
        "is-hidden"
      );
  };

  const showBrokenPhotoState = () => {
    console.warn(
      `無法載入${placeName}的影像：`,
      selectedPhoto.src
    );

    pageElements.storyImage
      .classList.remove(
        "is-visible"
      );

    pageElements.storyImage
      .removeAttribute(
        "src"
      );

    pageElements.storyImage.alt = "";

    pageElements.storyImagePlaceholder
      .classList.remove(
        "is-hidden"
      );

    pageElements.storyImageCaption
      .textContent = "";
  };

  pageElements.storyImage.onload =
    showLoadedPhoto;

  pageElements.storyImage.onerror =
    showBrokenPhotoState;

  pageElements.storyImage.alt =
    `${placeName}的${storyPhotoMode === "past"
      ? "過去"
      : "現在"
    }影像`;

  pageElements.storyImageCaption
    .textContent =
    selectedPhoto.caption || "";

  pageElements.storyImage.src =
    selectedPhoto.src;

  if (
    pageElements.storyImage.complete
  ) {
    if (
      pageElements.storyImage
        .naturalWidth > 0
    ) {
      showLoadedPhoto();
    } else {
      showBrokenPhotoState();
    }
  }
}

// ========================================
// 切換照片
// ========================================

function changeStoryPhoto(direction) {
  if (
    !selectedPlace ||
    storyPhotoItems.length < 2
  ) {
    return;
  }

  storyPhotoIndex =
    (
      storyPhotoIndex +
      direction +
      storyPhotoItems.length
    ) %
    storyPhotoItems.length;

  renderSelectedStoryPhoto(
    selectedPlace.properties
  );
}

// ========================================
// 設定現在與過去影像
// ========================================

async function configureStoryImages(
  information,
  mode
) {
  const requestId =
    ++storyPhotoRequestId;

  storyPhotoMode = mode;
  storyPhotoItems = [];
  storyPhotoIndex = 0;

  clearStoryImageDisplay();

  const pastImage =
    information.pastImage ||
    information.pastPanorama ||
    "";

  pageElements.showCurrentImageButton
    ?.classList.toggle(
      "is-active",
      mode === "current"
    );

  pageElements.showPastImageButton
    ?.classList.toggle(
      "is-active",
      mode === "past"
    );

  if (
    pageElements.showPastImageButton
  ) {
    pageElements.showPastImageButton
      .disabled =
      !pastImage;
  }

  pageElements.storyPhotoToolbar
    ?.classList.toggle(
      "is-hidden",
      mode !== "current"
    );

  if (mode === "past") {
    if (pastImage) {
      storyPhotoItems = [
        {
          src: pastImage,
          caption:
            information.pastCaption ||
            "",
          source: "system",
          photoId: ""
        }
      ];
    }

    renderSelectedStoryPhoto(
      information
    );

    return;
  }

  const originalPhotos =
    getOriginalPlacePhotos(
      information
    );

  let addedPhotos = [];

  try {
    addedPhotos =
      await loadAddedPlacePhotos(
        information.id
      );
  } catch (error) {
    console.error(
      "無法讀取後續添加的地點照片：",
      error
    );
  }

  if (
    requestId !== storyPhotoRequestId ||
    selectedPlace?.properties?.id !==
    information.id
  ) {
    return;
  }

  storyPhotoItems = [
    ...originalPhotos,
    ...addedPhotos.map(
      (photo) => ({
        src: photo.imageData,
        caption:
          photo.caption || "",
        source: "community",
        photoId: photo.photoId
      })
    )
  ];

  storyPhotoIndex = 0;

  renderSelectedStoryPhoto(
    information
  );
}

// ========================================
// 打開歷史360°全景
// ========================================

function openHistoricalPanorama(
  place
) {
  if (!place) {
    return;
  }

  const information =
    place.properties || {};

  const panoramaSource =
    information.pastPanorama ||
    "";

  if (!panoramaSource) {
    showToast(
      "這個地點的歷史全景仍在整理中。"
    );

    return;
  }

  if (
    typeof window.pannellum ===
    "undefined"
  ) {
    showToast(
      "360°全景元件載入失敗，請重新整理頁面。"
    );

    return;
  }

  historicalPanoramaIsOpen =
    true;

  pageElements.historicalPanorama
    .classList.add("is-open");

  pageElements.historicalPanorama
    .setAttribute(
      "aria-hidden",
      "false"
    );

  document.body.classList.add(
    "is-panorama-open"
  );

  pageElements
    .historicalPanoramaTitle
    .textContent =
    information.shortLocation ||
    information.location ||
    "過去的香港";

  pageElements
    .historicalPanoramaYear
    .textContent =
    information.pastSceneYear
      ? `${information.pastSceneYear} · AI協作歷史重構`
      : "AI協作歷史重構";

  pageElements
    .historicalPanoramaLoading
    .classList.remove(
      "is-hidden"
    );

  if (historicalPanoramaViewer) {
    historicalPanoramaViewer
      .destroy();

    historicalPanoramaViewer =
      null;
  }

  pageElements
    .historicalPanoramaContainer
    .innerHTML = "";

  historicalPanoramaViewer =
    window.pannellum.viewer(
      "historical-panorama-viewer",
      {
        type: "equirectangular",
        panorama:
          panoramaSource,
        autoLoad: true,
        pitch:
          information
            .panoramaPitch ??
          -2,
        yaw:
          information
            .panoramaYaw ??
          0,
        hfov:
          information
            .panoramaHfov ??
          105,
        minHfov: 55,
        maxHfov: 120,
        minPitch: -65,
        maxPitch: 70,
        showControls: true,
        showFullscreenCtrl: true,
        showZoomCtrl: true,
        mouseZoom: true,
        draggable: true,
        keyboardZoom: true,
        onLoad: () => {
          pageElements
            .historicalPanoramaLoading
            .classList.add(
              "is-hidden"
            );
        }
      }
    );

  historicalPanoramaViewer.on(
    "load",
    () => {
      pageElements
        .historicalPanoramaLoading
        .classList.add(
          "is-hidden"
        );
    }
  );
}

// ========================================
// 關閉歷史360°全景
// ========================================

function closeHistoricalPanorama() {
  historicalPanoramaIsOpen =
    false;

  pageElements.historicalPanorama
    .classList.remove("is-open");

  pageElements.historicalPanorama
    .setAttribute(
      "aria-hidden",
      "true"
    );

  document.body.classList.remove(
    "is-panorama-open"
  );

  if (historicalPanoramaViewer) {
    historicalPanoramaViewer
      .destroy();

    historicalPanoramaViewer =
      null;
  }

  pageElements
    .historicalPanoramaContainer
    .innerHTML = "";

  pageElements
    .historicalPanoramaLoading
    .classList.remove(
      "is-hidden"
    );
}

// ========================================
// 設定 Spotify 官方播放器
// ========================================

function configureSpotifyPlayer(
  information
) {
  const multipleSongs =
    Array.isArray(information.songs)
      ? information.songs
      : [];

  const spotifyTracks =
    multipleSongs.length
      ? multipleSongs
        .filter(
          (song) =>
            song.spotifyEmbed
        )
        .map((song) => ({
          title: song.title,
          singer: song.singer,
          spotifyEmbed:
            song.spotifyEmbed
        }))
      : information.spotifyEmbed
        ? [
          {
            title:
              information.song ||
              information.title ||
              "城市歌曲",
            singer:
              information.singer ||
              information.creator ||
              "",
            spotifyEmbed:
              information.spotifyEmbed
          }
        ]
        : [];

  pageElements.storySpotifyPlayer
    .innerHTML = "";

  pageElements.storySpotifyPlayer
    .classList.toggle(
      "has-multiple-tracks",
      spotifyTracks.length > 1
    );

  if (!spotifyTracks.length) {
    pageElements.storyMusicSection
      .hidden = true;

    pageElements.storyAudioButton
      .hidden = false;

    return;
  }

  spotifyTracks.forEach(
    (track) => {
      const trackItem =
        document.createElement("div");

      trackItem.className =
        "story-spotify-track";

      if (
        spotifyTracks.length > 1
      ) {
        const trackHeading =
          document.createElement("div");

        trackHeading.className =
          "story-spotify-track-heading";

        const trackTitle =
          document.createElement("strong");

        trackTitle.textContent =
          `《${track.title}》`;

        const trackSinger =
          document.createElement("span");

        trackSinger.textContent =
          track.singer || "";

        trackHeading.append(
          trackTitle,
          trackSinger
        );

        trackItem.appendChild(
          trackHeading
        );
      }

      const iframe =
        document.createElement(
          "iframe"
        );

      iframe.src =
        track.spotifyEmbed;

      iframe.title =
        `${track.title} Spotify 播放器`;

      iframe.width = "100%";

      iframe.height =
        spotifyTracks.length > 1
          ? "80"
          : "152";

      iframe.frameBorder = "0";
      iframe.loading = "lazy";

      iframe.allow =
        "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";

      iframe.setAttribute(
        "allowfullscreen",
        ""
      );

      trackItem.appendChild(iframe);

      pageElements.storySpotifyPlayer
        .appendChild(trackItem);
    }
  );

  pageElements.storyMusicSection
    .hidden = false;

  pageElements.storyAudioButton
    .hidden = true;
}

// ========================================
// 設定歌曲聲音按鈕
// ========================================

function configureAudioButton(
  information
) {
  const audioSource =
    information.audioPreview ||
    information.songLink ||
    "";

  pageElements.storyAudioButton
    .disabled =
    !audioSource;

  pageElements.storyAudioButton
    .dataset.source =
    audioSource;

  pageElements.storyAudioButton
    .innerHTML =
    audioSource
      ? "<span aria-hidden=\"true\">▶</span> 聆聽城市聲音"
      : "<span aria-hidden=\"true\">♪</span> 聲音整理中";
}

// ========================================
// 關閉地點故事
// ========================================

function closeStoryPanel({
  returnToOverview = false
} = {}) {
  streetHighlightRequestId += 1;

  pageElements.storySpotifyPlayer
    .innerHTML = "";

  pageElements.storyMusicSection.hidden =
    true;

  pageElements.storyAudioButton.hidden =
    false;

  pageElements.storyPanel.classList.remove(
    "is-open"
  );

  pageElements.storyPanel.setAttribute(
    "aria-hidden",
    "true"
  );

  selectedMarker?.classList.remove(
    "is-selected"
  );

  selectedMarker = null;
  selectedPlace = null;

  pageElements.mapShell.classList.remove(
    "is-place-focus"
  );

  delete pageElements.mapShell.dataset
    .experienceTheme;

  placeMarkers.forEach((record) => {
    record.element.classList.remove(
      "is-focus-target"
    );
  });

  removePlaceAtmosphere();
  removePlaceStreetPath();
  removePlaceDecorations();

  delete pageElements.mapShell.dataset
    .activePlace;

  if (returnToOverview) {
    map.easeTo({
      ...DEFAULT_CAMERA,
      duration: 1100,
      essential: true
    });
  }
}

// ========================================
// 建立地點檔案列表
// ========================================

function createArchiveList() {
  pageElements.archiveList.innerHTML =
    "";

  const visiblePlaces =
    allPlaces.filter(
      filterArchivePlace
    );

  visiblePlaces.forEach((place) => {
    const information =
      place.properties;

    const button =
      document.createElement("button");

    button.type = "button";

    button.className =
      "archive-place-button";

    button.dataset.mediaCategory =
      getPlaceMediaCategory(
        information
      );

    button.innerHTML = `
      <span class="archive-place-type">
        ${escapeHTML(
      getArchiveTypeLabel(place)
    )}
      </span>

      <strong>
        ${escapeHTML(
      information.shortLocation ||
      information.location ||
      "城市記憶"
    )}
      </strong>

<small>
  ${escapeHTML(
      information.mediaType ===
        "food"
        ? `招牌 · ${getFoodTypeDisplayName(
          information
        )}`
        : (
          information.song ||
          information.title ||
          "共同點亮"
        )
    )}
</small>
    `;

    button.addEventListener(
      "click",
      () => {
        selectPlace(place);

        if (
          window.innerWidth < 800
        ) {
          collapseArchivePanel();
        }
      }
    );

    pageElements.archiveList.appendChild(
      button
    );
  });

  if (!visiblePlaces.length) {
    const emptyMessage =
      document.createElement("p");

    emptyMessage.className =
      "archive-empty";

    emptyMessage.textContent =
      "暫時沒有這一類城市記憶。";

    pageElements.archiveList.appendChild(
      emptyMessage
    );
  }
}

// ========================================
// 判斷地點是否符合目前篩選
// ========================================

function placeMatchesContentFilter(
  place,
  filter = currentArchiveFilter
) {
  if (filter === "all") {
    return true;
  }

  const information =
    place?.properties || {};

  const mediaType =
    information.mediaType ||
    (
      information.source ===
        "community"
        ? "personal"
        : "song"
    );

  if (filter === "community") {
    return (
      information.source ===
      "community"
    );
  }

  if (filter === "screen") {
    return (
      mediaType === "film" ||
      mediaType === "television"
    );
  }

  if (filter === "history") {
    return Boolean(
      information.pastImage ||
      information.pastPanorama
    );
  }

  if (filter === "food") {
    return mediaType === "food";
  }

  if (filter === "song") {
    return (
      mediaType === "song"
    );
  }

  if (filter === "personal") {
    return (
      mediaType === "personal"
    );
  }

  return true;
}

// ========================================
// 篩選左側地點檔案
// ========================================

function filterArchivePlace(place) {
  return placeMatchesContentFilter(
    place
  );
}

// ========================================
// 更新地圖標記顯示狀態
// ========================================

function updateMapMarkerVisibility() {
  placeMarkers.forEach(
    (record) => {
      const markerElement =
        record.marker?.getElement?.();

      if (!markerElement) {
        return;
      }

      const shouldShow =
        placeMatchesContentFilter(
          record.place
        );

      markerElement.classList.toggle(
        "is-filtered-out",
        !shouldShow
      );

      markerElement.setAttribute(
        "aria-hidden",
        shouldShow
          ? "false"
          : "true"
      );
    }
  );
}

// ========================================
// 更新所有篩選按鈕狀態
// ========================================

function updateContentFilterButtons() {
  const allFilterButtons = [
    ...pageElements.mapFilterButtons,
    ...pageElements.archiveFilterButtons
  ];

  allFilterButtons.forEach(
    (button) => {
      const isActive =
        button.dataset.filter ===
        currentArchiveFilter;

      button.classList.toggle(
        "is-active",
        isActive
      );

      button.setAttribute(
        "aria-pressed",
        String(isActive)
      );
    }
  );
}

// ========================================
// 切換地圖內容篩選
// ========================================

function setContentFilter(filter) {
  const allowedFilters = [
    "all",
    "song",
    "screen",
    "food",
    "history",
    "community"
  ];

  if (
    !allowedFilters.includes(filter)
  ) {
    return;
  }

  currentArchiveFilter = filter;

  if (
    selectedPlace &&
    !placeMatchesContentFilter(
      selectedPlace,
      filter
    )
  ) {
    closeStoryPanel({
      returnToOverview: false
    });
  }

  updateContentFilterButtons();
  updateMapMarkerVisibility();
  updateFoodMarkerClusters();
  createArchiveList();

  window.requestAnimationFrame(() => {
    schedulePlaceLabelLayout();
  });
}

// ========================================
// 綁定內容篩選按鈕
// ========================================

function bindContentFilterButtons(
  buttons
) {
  buttons.forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        setContentFilter(
          button.dataset.filter
        );
      }
    );
  });
}

// ========================================
// 取得檔案類型文字
// ========================================

function getArchiveTypeLabel(place) {
  const information =
    place.properties;

  if (
    information.mediaType ===
    "film" ||
    information.mediaType ===
    "television"
  ) {
    return "銀幕記憶";
  }

  if (
    information.mediaType ===
    "food"
  ) {
    return "城市味道";
  }

  if (
    information.mediaType ===
    "personal"
  ) {
    return "個人記憶";
  }

  if (
    information.mediaType ===
    "song" ||
    !information.mediaType
  ) {
    return "城市聲音";
  }

  if (
    information.source ===
    "community"
  ) {
    return "共同點亮";
  }

  if (
    information.archiveType ===
    "archive"
  ) {
    return "城市檔案";
  }

  return "城市記憶";
}

// ========================================
// 展開與收起檔案列表
// ========================================

function toggleArchivePanel() {
  const isCollapsed =
    pageElements.archivePanel
      .classList.toggle(
        "is-collapsed"
      );

  pageElements.archivePanelToggle
    .setAttribute(
      "aria-expanded",
      String(!isCollapsed)
    );

  pageElements.archivePanelToggle
    .textContent =
    isCollapsed
      ? "展開"
      : "收起";
}

function collapseArchivePanel() {
  pageElements.archivePanel.classList.add(
    "is-collapsed"
  );

  pageElements.archivePanelToggle
    .setAttribute(
      "aria-expanded",
      "false"
    );

  pageElements.archivePanelToggle
    .textContent =
    "展開";
}

// ========================================
// 加入電車與天星小輪路線
// ========================================

function addTransportLayers() {
  map.addSource("tram-tracks", {
    type: "geojson",
    data: tramTrackData
  });

  map.addLayer({
    id: "tram-track-shadow",
    type: "line",
    source: "tram-tracks",
    filter: [
      "==",
      ["geometry-type"],
      "LineString"
    ],
    paint: {
      "line-color": "#fffaf0",
      "line-width": 11,
      "line-opacity": 0.86
    }
  });

  map.addLayer({
    id: "tram-track-eastbound",
    type: "line",
    source: "tram-tracks",
    filter: [
      "==",
      ["geometry-type"],
      "LineString"
    ],
    paint: {
      "line-color": "#376d54",
      "line-width": 2.1,
      "line-opacity": 0.88,
      "line-offset": 3.5,
      "line-dasharray": [2, 1.6]
    }
  });

  map.addLayer({
    id: "tram-track-westbound",
    type: "line",
    source: "tram-tracks",
    filter: [
      "==",
      ["geometry-type"],
      "LineString"
    ],
    paint: {
      "line-color": "#71977d",
      "line-width": 2.1,
      "line-opacity": 0.88,
      "line-offset": -3.5,
      "line-dasharray": [2, 1.6]
    }
  });

  map.addSource("ferry-routes", {
    type: "geojson",
    data: ferryRouteData
  });

  map.addLayer({
    id: "ferry-route-line",
    type: "line",
    source: "ferry-routes",
    filter: [
      "==",
      ["geometry-type"],
      "LineString"
    ],
    paint: {
      "line-color": "#ffffff",
      "line-width": 1.8,
      "line-opacity": 0.82,
      "line-dasharray": [2, 3]
    }
  });

  [
    "tram-track-shadow",
    "tram-track-eastbound",
    "tram-track-westbound"
  ].forEach((layerId) => {
    if (map.getLayer(layerId)) {
      map.moveLayer(layerId);
    }
  });
}

// ========================================
// 建立叮叮車與天星小輪
// ========================================

function createTransportVehicles() {
  const tramRoutes =
    tramTrackData.features.filter(
      (feature) =>
        feature.geometry.type ===
        "LineString"
    );

  const mainTramRoute =
    tramRoutes.find(
      (feature) =>
        feature.properties.section ===
        "main"
    );

  const happyValleyRoute =
    tramRoutes.find(
      (feature) =>
        feature.properties.section ===
        "happy-valley"
    );

  if (mainTramRoute) {
    const mainCoordinates =
      mainTramRoute.geometry.coordinates;

    const songRoute =
      createOurTramRoute(
        mainCoordinates,
        happyValleyRoute?.geometry
          .coordinates || []
      );

    createAnimatedVehicle({
      type: "tram",
      route: songRoute,
      progress: 0,
      direction: 1,
      speed: 0.0028,
      primary: true
    });

    const ordinaryTrams = [
      {
        progress: 0.18,
        direction: 1
      },
      {
        progress: 0.42,
        direction: -1
      },
      {
        progress: 0.68,
        direction: 1
      },
      {
        progress: 0.88,
        direction: -1
      }
    ];

    ordinaryTrams.forEach(
      (tram) => {
        createAnimatedVehicle({
          type: "tram",
          route: mainCoordinates,
          progress: tram.progress,
          direction: tram.direction,
          speed: 0.0035,
          primary: false
        });
      }
    );
  }

  if (happyValleyRoute) {
    createAnimatedVehicle({
      type: "tram",
      route:
        happyValleyRoute.geometry
          .coordinates,
      progress: 0.3,
      direction: 1,
      speed: 0.0038,
      primary: false
    });
  }

  const ferryRoutes =
    ferryRouteData.features.filter(
      (feature) =>
        feature.geometry.type ===
        "LineString"
    );

  ferryRoutes.forEach(
    (route, index) => {
      createAnimatedVehicle({
        type: "ferry",
        route:
          route.geometry.coordinates,
        progress:
          index === 0
            ? 0.15
            : 0.62,
        direction:
          index === 0
            ? 1
            : -1,
        speed: 0.0055,
        primary: false
      });
    }
  );

  createTramLyricMarkers();
}

// ========================================
// 建立《我們的電車上》主題路線
// ========================================

function createOurTramRoute(
  mainCoordinates,
  happyValleyCoordinates
) {
  const happyValleyJunctionIndex =
    mainCoordinates.findIndex(
      (coordinates) =>
        Math.abs(
          coordinates[0] -
          114.1845
        ) < 0.0005
    );

  if (
    happyValleyJunctionIndex < 0 ||
    !happyValleyCoordinates.length
  ) {
    return [
      ...mainCoordinates
    ].reverse();
  }

  const easternSection =
    mainCoordinates
      .slice(
        happyValleyJunctionIndex
      )
      .reverse();

  const happyValleySection =
    happyValleyCoordinates.slice(1);

  const westernSection =
    mainCoordinates
      .slice(
        0,
        happyValleyJunctionIndex + 1
      )
      .reverse()
      .slice(1);

  return [
    ...easternSection,
    ...happyValleySection,
    ...westernSection
  ];
}

// ========================================
// 建立單一交通工具
// ========================================

function createAnimatedVehicle({
  type,
  route,
  progress,
  direction,
  speed,
  primary
}) {
  const markerAnchor =
    document.createElement("div");

  markerAnchor.className =
    `transport-marker-anchor transport-marker-${type}`;

  const element =
    document.createElement("button");

  element.type = "button";

  element.className =
    `transport-vehicle ${type}-vehicle`;

  if (type === "tram") {
    const tramColours = [
      "#2f7d5b",
      "#f0b323",
      "#286f9e",
      "#f3eee2",
      "#76558f"
    ];

    if (primary) {
      element.classList.add(
        "is-primary-transport"
      );

      element.style.setProperty(
        "--tram-colour",
        "#b93636"
      );
    } else {
      const ordinaryTramCount =
        transportVehicles.filter(
          (vehicle) =>
            vehicle.type === "tram" &&
            !vehicle.primary
        ).length;

      const tramColour =
        tramColours[
        ordinaryTramCount %
        tramColours.length
        ];

      element.style.setProperty(
        "--tram-colour",
        tramColour
      );
    }
  }

  element.setAttribute(
    "aria-label",
    type === "tram"
      ? primary
        ? "《我們的電車上》主題電車"
        : "香港叮叮車"
      : "天星小輪"
  );

  if (type === "tram") {
    element.innerHTML = `
      <span class="tram-window"></span>
      <span class="tram-window"></span>

      <span class="tram-number">
        叮
      </span>
    `;
  } else {
    element.innerHTML = `
      <span class="ferry-chimney"></span>

      <span class="ferry-upper-deck">
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </span>

      <span class="ferry-lower-deck">
        <i></i>
        <i></i>
        <i></i>
      </span>

      <span class="ferry-hull"></span>
      <span class="ferry-wake"></span>
    `;
  }

  markerAnchor.appendChild(
    element
  );

  const marker =
    new maplibregl.Marker({
      element: markerAnchor,
      anchor: "center"
    })
      .setLngLat(route[0])
      .addTo(map);

  const vehicle = {
    type,
    route,
    progress,
    direction,
    speed,
    primary,
    marker,
    markerAnchor,
    element,
    currentCoordinates: route[0]
  };

  element.addEventListener(
    "click",
    (event) => {
      event.stopPropagation();

      if (
        type === "tram" &&
        primary
      ) {
        showTramLyric(vehicle);
        setTramFollowing(true);
        return;
      }

      if (type === "tram") {
        showToast(
          "這是一輛正在服務中的普通電車。"
        );

        return;
      }

      showToast(
        "天星小輪正在維港兩岸之間航行。"
      );
    }
  );

  transportVehicles.push(
    vehicle
  );
}

// ========================================
// 持續更新交通動畫
// ========================================

function startTransportAnimation() {
  if (animationFrameId) {
    cancelAnimationFrame(
      animationFrameId
    );
  }

  previousAnimationTime =
    performance.now();

  animationFrameId =
    requestAnimationFrame(
      updateTransportAnimation
    );
}

function updateTransportAnimation(time) {
  const deltaSeconds =
    Math.min(
      (
        time -
        previousAnimationTime
      ) / 1000,
      0.05
    );

  previousAnimationTime = time;

  transportVehicles.forEach(
    (vehicle) => {
      vehicle.progress +=
        vehicle.direction *
        vehicle.speed *
        deltaSeconds;

      if (vehicle.progress >= 1) {
        vehicle.progress = 1;
        vehicle.direction = -1;
      }

      if (vehicle.progress <= 0) {
        vehicle.progress = 0;
        vehicle.direction = 1;
      }

      const routeCoordinates =
        interpolateRoute(
          vehicle.route,
          vehicle.progress
        );

      const longitudeMovement =
        routeCoordinates[0] -
        vehicle.currentCoordinates[0];

      const travelDirection =
        longitudeMovement >= 0
          ? 1
          : -1;

      if (
        vehicle.type === "tram"
      ) {
        vehicle.element.classList.toggle(
          "is-eastbound",
          travelDirection > 0
        );

        vehicle.element.classList.toggle(
          "is-westbound",
          travelDirection < 0
        );
      }

      vehicle.currentCoordinates =
        routeCoordinates;

      vehicle.marker.setLngLat(
        routeCoordinates
      );

      if (
        vehicle.type === "tram" &&
        vehicle.primary
      ) {
        updatePrimaryTramExperience(
          vehicle,
          time
        );
      }
    }
  );

  animationFrameId =
    requestAnimationFrame(
      updateTransportAnimation
    );
}

// ========================================
// 沿路線計算動畫位置
// ========================================

function interpolateRoute(
  coordinates,
  progress
) {
  if (coordinates.length === 1) {
    return coordinates[0];
  }

  const scaledProgress =
    progress *
    (
      coordinates.length - 1
    );

  const segmentIndex =
    Math.min(
      Math.floor(
        scaledProgress
      ),
      coordinates.length - 2
    );

  const localProgress =
    scaledProgress -
    segmentIndex;

  const start =
    coordinates[segmentIndex];

  const end =
    coordinates[
    segmentIndex + 1
    ];

  return [
    start[0] +
    (
      end[0] - start[0]
    ) *
    localProgress,
    start[1] +
    (
      end[1] - start[1]
    ) *
    localProgress
  ];
}

// ========================================
// 《我們的電車上》沿途歌詞
// ========================================

const TRAM_LYRIC_STOPS = [
  {
    location: "筲箕灣",
    coordinates: [
      114.2283,
      22.2773
    ],
    lyric:
      "從筲箕灣到尾，陪住我，陪住你。"
  },
  {
    location: "港島電車沿線",
    coordinates: [
      114.2102,
      22.2877
    ],
    lyric:
      "想照著沿路地理，過渡每世紀。"
  },
  {
    location: "跑馬地",
    coordinates: [
      114.1843,
      22.2696
    ],
    lyric:
      "途經的跑馬地。"
  },
  {
    location: "紅棉道",
    coordinates: [
      114.1611,
      22.2817
    ],
    lyric:
      "左邊看，看紅棉道風格。"
  },
  {
    location: "干諾道",
    coordinates: [
      114.1548,
      22.2856
    ],
    lyric:
      "轉彎，干諾道亦優雅。"
  },
  {
    location: "皇后街",
    coordinates: [
      114.1478,
      22.2867
    ],
    lyric:
      "看到達皇后街嗎？也許忽然全部清拆。"
  },
  {
    location: "西環",
    coordinates: [
      114.1373,
      22.2863
    ],
    lyric:
      "看，我們無暇眨眼；也許西環餘味不散。"
  }
];

// ========================================
// 更新叮叮車歌詞體驗
// ========================================

function updatePrimaryTramExperience(
  vehicle,
  time
) {
  showTramLyric(vehicle);

  if (
    tramFollowingIsActive &&
    time - lastFollowUpdate > 650
  ) {
    lastFollowUpdate = time;

    map.easeTo({
      center:
        vehicle.currentCoordinates,
      zoom: 13.65,
      duration: 620,
      essential: true
    });
  }
}

function showTramLyric(vehicle) {
  const closestStop =
    findClosestTramLyricStop(
      vehicle.currentCoordinates
    );

  pageElements.tramLyricLocation
    .textContent = closestStop.location;

  pageElements.tramLyricText
    .textContent =
    closestStop.lyric;

  illuminateTramLocation(
    closestStop.location
  );

  pageElements.tramLyricCard
    .classList.add(
      "is-visible"
    );

  pageElements.tramLyricCard
    .setAttribute(
      "aria-hidden",
      "false"
    );
}

// ========================================
// 建立主題電車沿途地點
// ========================================

function createTramLyricMarkers() {
  tramLyricMarkers.forEach(
    (markerRecord) => {
      markerRecord.marker.remove();
    }
  );

  tramLyricMarkers.length = 0;

  TRAM_LYRIC_STOPS.forEach(
    (stop) => {
      const element =
        document.createElement("div");

      element.className =
        "tram-lyric-location-marker";

      element.dataset.location =
        stop.location;

      const dot =
        document.createElement("span");

      dot.className =
        "tram-lyric-location-dot";

      const label =
        document.createElement("strong");

      label.textContent =
        stop.location;

      element.append(
        dot,
        label
      );

      const marker =
        new maplibregl.Marker({
          element,
          anchor: "top",
          offset: [0, 7]
        })
          .setLngLat(
            stop.coordinates
          )
          .addTo(map);

      tramLyricMarkers.push({
        location: stop.location,
        marker,
        element
      });
    }
  );
}

// ========================================
// 點亮電車當前所在位置
// ========================================

function illuminateTramLocation(
  location
) {
  if (
    activeTramLyricLocation ===
    location
  ) {
    return;
  }

  activeTramLyricLocation =
    location;

  tramLyricMarkers.forEach(
    (markerRecord) => {
      markerRecord.element
        .classList.toggle(
          "is-active",
          markerRecord.location ===
          location
        );
    }
  );
}

// ========================================
// 尋找最接近的歌詞地點
// ========================================

function findClosestTramLyricStop(
  coordinates
) {
  return TRAM_LYRIC_STOPS.reduce(
    (closest, stop) => {
      const currentDistance =
        calculateSimpleDistance(
          coordinates,
          stop.coordinates
        );

      const closestDistance =
        calculateSimpleDistance(
          coordinates,
          closest.coordinates
        );

      return (
        currentDistance <
          closestDistance
          ? stop
          : closest
      );
    },
    TRAM_LYRIC_STOPS[0]
  );
}

function calculateSimpleDistance(
  first,
  second
) {
  return Math.hypot(
    first[0] - second[0],
    first[1] - second[1]
  );
}

// ========================================
// 開啟與關閉叮叮車跟隨
// ========================================

function setTramFollowing(isActive) {
  tramFollowingIsActive =
    isActive;

  pageElements.tramFollowButton
    .classList.toggle(
      "is-active",
      isActive
    );

  pageElements.tramFollowButton
    .setAttribute(
      "aria-pressed",
      String(isActive)
    );

  pageElements.tramFollowButton
    .textContent =
    isActive
      ? "返回全景"
      : "跟隨電車";

  if (!isActive) {
    map.easeTo({
      ...DEFAULT_CAMERA,
      duration: 1100,
      essential: true
    });
  }
}

// ========================================
// 點亮地點
// ========================================

function toggleSelectedPlaceLight() {
  if (!selectedPlace) {
    return;
  }

  const placeId =
    selectedPlace.properties.id;

  if (
    illuminatedPlaces.includes(
      placeId
    )
  ) {
    illuminatedPlaces =
      illuminatedPlaces.filter(
        (id) =>
          id !== placeId
      );

    showToast(
      "已取消點亮這個地方。"
    );
  } else {
    illuminatedPlaces.push(
      placeId
    );

    showToast(
      "這個城市記憶已被你點亮。"
    );
  }

  saveStoredArray(
    STORAGE_KEYS.illuminatedPlaces,
    illuminatedPlaces
  );

  updatePlaceMarkerLight(
    placeId
  );

  updateStoryLightButton(
    placeId
  );

  updateLightProgress();
}

// ========================================
// 更新地點光點
// ========================================

function updatePlaceMarkerLight(placeId) {
  const markerElement =
    findMarkerElement(placeId);

  markerElement?.classList.toggle(
    "is-illuminated",
    illuminatedPlaces.includes(
      placeId
    )
  );
}

function updateStoryLightButton(placeId) {
  const isIlluminated =
    illuminatedPlaces.includes(
      placeId
    );

  pageElements.storyLightButton
    .classList.toggle(
      "is-illuminated",
      isIlluminated
    );

  pageElements.storyLightButton
    .textContent =
    isIlluminated
      ? "已點亮"
      : "點亮這裡";
}

// ========================================
// 更新點亮進度
// ========================================

function updateLightProgress() {
  const totalPlaces =
    allPlaces.length;

  const validIlluminatedCount =
    illuminatedPlaces.filter(
      (id) =>
        allPlaces.some(
          (place) =>
            place.properties.id ===
            id
        )
    ).length;

  pageElements.lightProgressText
    .textContent =
    `已點亮 ${validIlluminatedCount} 個地點`;

  const percentage =
    totalPlaces
      ? (
        validIlluminatedCount /
        totalPlaces
      ) * 100
      : 0;

  pageElements.lightProgressBar
    .style.width =
    `${percentage}%`;
}

// ========================================
// 清除投稿照片預覽
// ========================================

function clearContributionPhotoPreview() {
  if (
    pageElements.contributionPreviewImage
  ) {
    pageElements.contributionPreviewImage
      .removeAttribute("src");
  }

  pageElements.contributionPhotoPreview
    ?.classList.remove(
      "is-visible"
    );

  pageElements.contributionPhotoPreview
    ?.setAttribute(
      "aria-hidden",
      "true"
    );
}

// ========================================
// 顯示投稿地點視窗
// ========================================

function showContributionDialog(
  message = ""
) {
  contributionModeIsOpen = true;

  pageElements.contributionDialog
    .classList.add(
      "is-open"
    );

  pageElements.contributionDialog
    .setAttribute(
      "aria-hidden",
      "false"
    );

  document.body.classList.add(
    "dialog-is-open"
  );

  if (message) {
    showToast(message);
  }
}

// ========================================
// 開啟新增地點視窗
// ========================================

function openContributionDialog() {
  editingContributionId = "";

  pageElements.contributionForm
    ?.reset();

  clearContributionPhotoPreview();

  contributionMarker?.remove();
  contributionMarker = null;

  if (
    pageElements.contributionTitle
  ) {
    pageElements.contributionTitle
      .textContent =
      "加入你的城市記憶";
  }

  if (
    pageElements.contributionSubtitle
  ) {
    pageElements.contributionSubtitle
      .textContent =
      "在地圖上選擇位置，留下一張照片、一段歌詞或一句台詞。";
  }

  if (
    pageElements.saveContributionButton
  ) {
    pageElements.saveContributionButton
      .textContent =
      "點亮這個地方";
  }

  const locationStatus =
    document.querySelector(
      "#contribution-location-status"
    );

  if (locationStatus) {
    locationStatus.textContent =
      "輸入店名後，系統會自動在香港地圖中尋找。";
  }

  showContributionDialog(
    "請在地圖上點擊你想點亮的位置。"
  );
}

// ========================================
// 開啟修改地點視窗
// ========================================

function openSelectedContributionEditor() {
  if (!selectedPlace) {
    showToast(
      "請先選擇一個地點。"
    );

    return;
  }

  const information =
    selectedPlace.properties;

  if (
    information.source !==
    "community"
  ) {
    showToast(
      "系統原有地點不能在這裡修改。"
    );

    return;
  }

  editingContributionId =
    information.id;

  pageElements.contributionForm
    ?.reset();

  clearContributionPhotoPreview();

  const form =
    pageElements.contributionForm;

  if (!form) {
    return;
  }

  const setFieldValue = (
    name,
    value
  ) => {
    const field =
      form.elements.namedItem(name);

    if (field) {
      field.value =
        value ?? "";
    }
  };

  setFieldValue(
    "location",
    information.location ||
    information.shortLocation ||
    ""
  );

  setFieldValue(
    "mediaType",
    information.mediaType ||
    "personal"
  );

  setFieldValue(
    "highlightType",
    information.highlightType ||
    "point"
  );

  setFieldValue(
    "foodType",
    information.foodType ||
    "local-food"
  );

  setFieldValue(
    "title",
    information.title ||
    information.song ||
    ""
  );

  setFieldValue(
    "excerpt",
    information.excerpt ||
    information.lyric ||
    ""
  );

  const [
    longitude,
    latitude
  ] =
    selectedPlace.geometry
      .coordinates;

  setFieldValue(
    "longitude",
    longitude
  );

  setFieldValue(
    "latitude",
    latitude
  );

  contributionMarker?.remove();

  const markerElement =
    document.createElement("div");

  markerElement.className =
    "contribution-location-marker";

  contributionMarker =
    new maplibregl.Marker({
      element: markerElement,
      anchor: "center"
    })
      .setLngLat([
        longitude,
        latitude
      ])
      .addTo(map);

  if (information.photo) {
    pageElements.contributionPreviewImage
      .src =
      information.photo;

    pageElements.contributionPhotoPreview
      .classList.add(
        "is-visible"
      );

    pageElements.contributionPhotoPreview
      .setAttribute(
        "aria-hidden",
        "false"
      );
  }

  if (
    pageElements.contributionTitle
  ) {
    pageElements.contributionTitle
      .textContent =
      "修改你的城市記憶";
  }

  if (
    pageElements.contributionSubtitle
  ) {
    pageElements.contributionSubtitle
      .textContent =
      "修改內容後儲存。若要更換位置，可以重新搜尋或直接點擊地圖。";
  }

  if (
    pageElements.saveContributionButton
  ) {
    pageElements.saveContributionButton
      .textContent =
      "儲存修改";
  }

  const locationStatus =
    document.querySelector(
      "#contribution-location-status"
    );

  if (locationStatus) {
    locationStatus.textContent =
      "目前顯示的是原有位置，你也可以重新搜尋或在地圖上選擇新位置。";
  }

  showContributionDialog(
    "你現在可以修改這個地點。"
  );
}

// ========================================
// 關閉新增地點視窗
// ========================================

function closeContributionDialog() {
  contributionModeIsOpen = false;

  pageElements.contributionDialog
    .classList.remove(
      "is-open"
    );

  pageElements.contributionDialog
    .setAttribute(
      "aria-hidden",
      "true"
    );

  document.body.classList.remove(
    "dialog-is-open"
  );

  contributionMarker?.remove();
  contributionMarker = null;

  editingContributionId = "";
}

// ========================================
// 將常見簡體地址字轉為繁體
// ========================================

function normaliseHongKongAddress(text) {
  const characterMap = {
    "宁": "寧",
    "楼": "樓",
    "门": "門",
    "广": "廣",
    "东": "東",
    "湾": "灣",
    "号": "號",
    "厦": "廈",
    "区": "區",
    "龙": "龍",
    "华": "華",
    "丰": "豐",
    "兴": "興",
    "业": "業",
    "发": "發",
    "围": "圍",
    "国": "國",
    "丽": "麗",
    "长": "長",
    "万": "萬",
    "荣": "榮",
    "顺": "順",
    "义": "義",
    "贸": "貿",
    "宝": "寶",
    "乐": "樂",
    "园": "園",
    "场": "場",
    "环": "環",
    "庆": "慶",
    "联": "聯",
    "众": "眾"
  };

  return String(text || "")
    .trim()
    .split("")
    .map(
      (character) =>
        characterMap[character] ||
        character
    )
    .join("");
}

// ========================================
// 從政府地址結果中取得座標
// ========================================

function extractGovernmentCoordinates(
  suggestion
) {
  const premisesAddress =
    suggestion
      ?.Address
      ?.PremisesAddress;

  let geospatialInformation =
    premisesAddress
      ?.GeospatialInformation;

  if (
    Array.isArray(
      geospatialInformation
    )
  ) {
    geospatialInformation =
      geospatialInformation[0];
  }

  const longitude =
    Number(
      geospatialInformation
        ?.Longitude
    );

  const latitude =
    Number(
      geospatialInformation
        ?.Latitude
    );

  if (
    !Number.isFinite(longitude) ||
    !Number.isFinite(latitude)
  ) {
    return null;
  }

  return {
    longitude,
    latitude
  };
}

// ========================================
// 從政府結果取得地址名稱
// ========================================

function getGovernmentAddressLabel(
  suggestion,
  fallback
) {
  const premises =
    suggestion
      ?.Address
      ?.PremisesAddress;

  const chinese =
    premises?.ChiPremisesAddress;

  const english =
    premises?.EngPremisesAddress;

  const buildingName =
    chinese?.BuildingName ||
    english?.BuildingName ||
    "";

  const streetName =
    chinese
      ?.ChiStreet
      ?.StreetName ||
    english
      ?.EngStreet
      ?.StreetName ||
    "";

  const buildingNumber =
    chinese
      ?.ChiStreet
      ?.BuildingNoFrom ||
    english
      ?.EngStreet
      ?.BuildingNoFrom ||
    "";

  const parts = [
    buildingName,
    streetName,
    buildingNumber
  ].filter(Boolean);

  return (
    parts.join(" · ") ||
    fallback
  );
}

// ========================================
// 使用香港政府地址服務搜尋
// ========================================

async function searchGovernmentAddress(
  query
) {
  const url =
    "https://www.als.gov.hk/lookup" +
    `?q=${encodeURIComponent(query)}` +
    "&n=5&t=50";

  const response =
    await fetch(
      url,
      {
        headers: {
          "Accept":
            "application/json",
          "Accept-Language":
            "zh-Hant,en;q=0.7"
        }
      }
    );

  if (!response.ok) {
    throw new Error(
      "香港政府地址服務回應失敗。"
    );
  }

  const data =
    await response.json();

  const suggestions =
    data?.SuggestedAddress ||
    data
      ?.AddressLookupResult
      ?.SuggestedAddress ||
    [];

  const suggestionList =
    Array.isArray(suggestions)
      ? suggestions
      : [suggestions];

  for (
    const suggestion
    of suggestionList
  ) {
    const coordinates =
      extractGovernmentCoordinates(
        suggestion
      );

    if (!coordinates) {
      continue;
    }

    return {
      ...coordinates,
      label:
        getGovernmentAddressLabel(
          suggestion,
          query
        ),
      provider:
        "香港政府地址資料"
    };
  }

  return null;
}

// ========================================
// 使用 OpenStreetMap 作後備搜尋
// ========================================

async function searchOpenStreetMapAddress(
  query
) {
  const url =
    "https://nominatim.openstreetmap.org/" +
    "search?format=jsonv2" +
    "&limit=3" +
    "&countrycodes=hk" +
    `&q=${encodeURIComponent(query)}`;

  const response =
    await fetch(
      url,
      {
        headers: {
          "Accept-Language":
            "zh-HK,zh-TW;q=0.9,en;q=0.7"
        }
      }
    );

  if (!response.ok) {
    return null;
  }

  const results =
    await response.json();

  if (!results.length) {
    return null;
  }

  const longitude =
    Number(results[0].lon);

  const latitude =
    Number(results[0].lat);

  if (
    !Number.isFinite(longitude) ||
    !Number.isFinite(latitude)
  ) {
    return null;
  }

  return {
    longitude,
    latitude,
    label:
      results[0].display_name ||
      query,
    provider:
      "OpenStreetMap"
  };
}

// ========================================
// 建立多組地址搜尋方式
// ========================================

function buildAddressSearchQueries(
  location,
  title
) {
  const traditionalLocation =
    normaliseHongKongAddress(
      location
    );

  const traditionalTitle =
    normaliseHongKongAddress(
      title
    );

  const queries = [
    traditionalLocation,
    `${traditionalLocation} 香港`,
    traditionalTitle,
    (
      traditionalTitle &&
      traditionalLocation
    )
      ? `${traditionalTitle} ${traditionalLocation}`
      : ""
  ];

  const simplifiedAddress =
    traditionalLocation
      .replace(
        /地下.*$/u,
        ""
      )
      .replace(
        /\d+\s*樓.*$/u,
        ""
      )
      .replace(
        /\d+\s*號舖.*$/u,
        ""
      )
      .replace(
        /[A-Za-z]座.*$/u,
        ""
      )
      .trim();

  if (simplifiedAddress) {
    queries.push(
      simplifiedAddress
    );
  }

  return [
    ...new Set(
      queries.filter(Boolean)
    )
  ];
}

// ========================================
// 智能尋找用戶輸入的香港地點
// ========================================

async function findContributionLocation() {
  const locationInput =
    document.querySelector(
      "#contribution-location"
    );

  const titleInput =
    document.querySelector(
      "#contribution-title-input"
    );

  const searchButton =
    document.querySelector(
      "#find-contribution-location"
    );

  const statusElement =
    document.querySelector(
      "#contribution-location-status"
    );

  const locationName =
    locationInput?.value.trim() || "";

  const title =
    titleInput?.value.trim() || "";

  if (!locationName && !title) {
    showToast(
      "請先輸入店舖或地址。"
    );

    locationInput?.focus();
    return;
  }

  const queries =
    buildAddressSearchQueries(
      locationName,
      title
    );

  searchButton.disabled = true;

  searchButton.textContent =
    "正在智能尋找……";

  if (statusElement) {
    statusElement.textContent =
      "正在搜尋香港地址資料……";
  }

  let matchedResult = null;

  try {
    for (const query of queries) {
      try {
        matchedResult =
          await searchGovernmentAddress(
            query
          );
      } catch (error) {
        console.warn(
          "政府地址搜尋未成功：",
          query,
          error
        );
      }

      if (matchedResult) {
        break;
      }
    }

    if (!matchedResult) {
      for (const query of queries) {
        matchedResult =
          await searchOpenStreetMapAddress(
            `${query}, 香港`
          );

        if (matchedResult) {
          break;
        }
      }
    }

    if (!matchedResult) {
      if (statusElement) {
        statusElement.textContent =
          "仍未找到。可以只輸入「大廈名＋道路」，例如「冠煌樓 安寧路 元朗」，或者直接點擊地圖選擇。";
      }

      showToast(
        "未找到地點，請嘗試輸入樓宇名和道路。"
      );

      return;
    }

    const {
      longitude,
      latitude,
      label,
      provider
    } = matchedResult;

    selectContributionCoordinates({
      lng: longitude,
      lat: latitude
    });

    map.flyTo({
      center: [
        longitude,
        latitude
      ],
      zoom: 17.4,
      pitch: 25,
      bearing: 0,
      duration: 1500,
      essential: true
    });

    if (statusElement) {
      statusElement.textContent =
        `已找到：${label}（${provider}）`;
    }

    showToast(
      "已找到地點，請查看地圖位置是否正確。"
    );
  } catch (error) {
    console.error(
      "智能地址搜尋失敗：",
      error
    );

    if (statusElement) {
      statusElement.textContent =
        "地址服務暫時無法連接，你仍可直接點擊地圖選擇位置。";
    }

    showToast(
      "地址服務暫時無法連接。"
    );
  } finally {
    searchButton.disabled = false;

    searchButton.textContent =
      "自動尋找地點";
  }
}

// ========================================
// 選擇投稿地圖位置
// ========================================

function selectContributionCoordinates(
  coordinates
) {
  const longitude =
    Number(
      coordinates.lng.toFixed(6)
    );

  const latitude =
    Number(
      coordinates.lat.toFixed(6)
    );

  pageElements.contributionLongitude
    .value =
    longitude;

  pageElements.contributionLatitude
    .value =
    latitude;

  contributionMarker?.remove();

  const markerElement =
    document.createElement("div");

  markerElement.className =
    "contribution-location-marker";

  contributionMarker =
    new maplibregl.Marker({
      element: markerElement,
      anchor: "center"
    })
      .setLngLat([
        longitude,
        latitude
      ])
      .addTo(map);

  showToast(
    "已選擇地圖位置，可以繼續填寫記憶。"
  );
}

// ========================================
// 儲存用戶城市記憶
// ========================================
async function saveContribution(event) {
  event.preventDefault();

  const form =
    pageElements.contributionForm;

  if (!form) {
    return;
  }

  const formData =
    new FormData(form);

  const longitude =
    Number(
      formData.get(
        "longitude"
      )
    );

  const latitude =
    Number(
      formData.get(
        "latitude"
      )
    );

  if (
    !Number.isFinite(longitude) ||
    !Number.isFinite(latitude)
  ) {
    showToast(
      "請先在地圖上選擇位置。"
    );

    return;
  }

  const editingPlace =
    editingContributionId
      ? communityPlaces.find(
        (place) =>
          place.properties.id ===
          editingContributionId
      )
      : null;

  if (
    editingContributionId &&
    !editingPlace
  ) {
    showToast(
      "找不到需要修改的地點，請重新開啟。"
    );

    return;
  }

  const photoFile =
    pageElements.contributionPhoto
      ?.files?.[0] ||
    null;

  let photoData =
    editingPlace?.properties
      ?.photo ||
    "";

  if (photoFile) {
    if (
      !photoFile.type.startsWith(
        "image/"
      )
    ) {
      showToast(
        "請選擇有效的圖片檔案。"
      );

      return;
    }

    try {
      photoData =
        await compressImageFile(
          photoFile
        );
    } catch (error) {
      console.error(
        "使用者圖片處理失敗：",
        error
      );

      showToast(
        "圖片讀取失敗，請重新選擇。"
      );

      return;
    }
  }

  const isEditing =
    Boolean(editingPlace);

  const id =
    isEditing
      ? editingPlace.properties.id
      : `community-${Date.now()}`;

  const mediaType =
    String(
      formData.get("mediaType") ||
      "personal"
    );

  const foodType =
    mediaType === "food"
      ? String(
        formData.get("foodType") ||
        "local-food"
      )
      : "";

  const highlightType =
    String(
      formData.get(
        "highlightType"
      ) ||
      "point"
    );

  const title =
    String(
      formData.get("title") ||
      ""
    ).trim();

  const location =
    String(
      formData.get("location") ||
      ""
    ).trim();

  const excerpt =
    String(
      formData.get("excerpt") ||
      ""
    ).trim();

  const oldProperties =
    editingPlace?.properties ||
    {};

  const savedPlace = {
    ...(editingPlace || {}),
    type: "Feature",

    geometry: {
      type: "Point",
      coordinates: [
        longitude,
        latitude
      ]
    },

    properties: {
      ...oldProperties,

      id,
      source: "community",
      archiveType: "community",
      mediaType,
      foodType,
      title,
      highlightType,

      song:
        mediaType === "song"
          ? title
          : "",

      location,
      shortLocation:
        location,

      excerpt,

      lyric:
        mediaType === "song"
          ? excerpt
          : "",

      description:
        oldProperties.description ||
        "這是一段由觀眾加入的香港城市記憶。",

      photo: photoData,
      status: "published",

      createdAt:
        oldProperties.createdAt ||
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString()
    }
  };

  const oldCommunityPlaces = [
    ...communityPlaces
  ];

  const oldAllPlaces = [
    ...allPlaces
  ];

  if (isEditing) {
    communityPlaces =
      communityPlaces.map(
        (place) =>
          place.properties.id === id
            ? savedPlace
            : place
      );

    allPlaces =
      allPlaces.map(
        (place) =>
          place.properties.id === id
            ? savedPlace
            : place
      );
  } else {
    communityPlaces.push(
      savedPlace
    );

    allPlaces.push(
      savedPlace
    );
  }

  const contributionWasSaved =
    saveStoredArray(
      STORAGE_KEYS.contributions,
      communityPlaces
    );

  if (!contributionWasSaved) {
    communityPlaces =
      oldCommunityPlaces;

    allPlaces =
      oldAllPlaces;

    showToast(
      isEditing
        ? "修改未能儲存，請稍後再試。"
        : "地點未能儲存，請稍後再試。"
    );

    return;
  }

  if (
    !illuminatedPlaces.includes(id)
  ) {
    illuminatedPlaces.push(id);
  }

  saveStoredArray(
    STORAGE_KEYS.illuminatedPlaces,
    illuminatedPlaces
  );

  createAllPlaceMarkers();
  createArchiveList();
  updateLightProgress();

  const successMessage =
    isEditing
      ? "地點資料已經更新。"
      : "你的城市記憶已經被點亮。";

  closeContributionDialog();

  form.reset();

  clearContributionPhotoPreview();

  selectPlace(savedPlace);

  showToast(
    successMessage
  );
}

// ========================================
// 刪除用戶城市記憶
// ========================================

function deleteSelectedContribution() {
  if (!selectedPlace) {
    return;
  }

  const information =
    selectedPlace.properties;

  if (
    information.source !==
    "community"
  ) {
    showToast(
      "精選城市記憶不能在這裡刪除。"
    );

    return;
  }

  const locationName =
    information.shortLocation ||
    information.location ||
    "這個地點";

  const shouldDelete =
    window.confirm(
      `確定要刪除「${locationName}」的城市記憶嗎？`
    );

  if (!shouldDelete) {
    return;
  }

  const deletedId =
    information.id;

  communityPlaces =
    communityPlaces.filter(
      (place) =>
        place.properties.id !==
        deletedId
    );

  allPlaces =
    allPlaces.filter(
      (place) =>
        place.properties.id !==
        deletedId
    );

  illuminatedPlaces =
    illuminatedPlaces.filter(
      (id) => id !== deletedId
    );

  saveStoredArray(
    STORAGE_KEYS.contributions,
    communityPlaces
  );

  saveStoredArray(
    STORAGE_KEYS.illuminatedPlaces,
    illuminatedPlaces
  );

  closeStoryPanel({
    returnToOverview: true
  });

  createAllPlaceMarkers();
  createArchiveList();
  updateLightProgress();

  showToast(
    `已刪除「${locationName}」的城市記憶。`
  );
}

// ========================================
// 壓縮用戶上傳照片
// ========================================

function compressImageFile(file) {
  return new Promise(
    (resolve, reject) => {
      const reader =
        new FileReader();

      reader.onload = () => {
        const image =
          new Image();

        image.onload = () => {
          const maximumWidth = 1100;
          const maximumHeight = 850;

          const scale =
            Math.min(
              1,
              maximumWidth /
              image.width,
              maximumHeight /
              image.height
            );

          const canvas =
            document.createElement(
              "canvas"
            );

          canvas.width =
            Math.max(
              1,
              Math.round(
                image.width * scale
              )
            );

          canvas.height =
            Math.max(
              1,
              Math.round(
                image.height * scale
              )
            );

          const context =
            canvas.getContext(
              "2d"
            );

          if (!context) {
            reject(
              new Error(
                "無法建立圖片畫布。"
              )
            );

            return;
          }

          context.fillStyle =
            "#f7f3ec";

          context.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
          );

          context.drawImage(
            image,
            0,
            0,
            canvas.width,
            canvas.height
          );

          const compressedImage =
            canvas.toDataURL(
              "image/jpeg",
              0.72
            );

          resolve(
            compressedImage
          );
        };

        image.onerror = () => {
          reject(
            new Error(
              "瀏覽器無法讀取圖片。"
            )
          );
        };

        image.src =
          String(reader.result);
      };

      reader.onerror = () => {
        reject(
          new Error(
            "圖片檔案讀取失敗。"
          )
        );
      };

      reader.readAsDataURL(file);
    }
  );
}

// ========================================
// 刪除目前顯示的使用者照片
// ========================================

async function deleteCurrentStoryPhoto() {
  if (
    !selectedPlace ||
    storyPhotoMode !== "current"
  ) {
    return;
  }

  const selectedPhoto =
    storyPhotoItems[
    storyPhotoIndex
    ];

  if (!selectedPhoto) {
    return;
  }

  const isLaterAddedPhoto =
    selectedPhoto.source ===
    "community";

  const isOriginalCommunityPhoto =
    selectedPhoto.source ===
    "original-community";

  if (
    !isLaterAddedPhoto &&
    !isOriginalCommunityPhoto
  ) {
    showToast(
      "系統原有圖片不能刪除。"
    );

    return;
  }

  const shouldDelete =
    window.confirm(
      "確定要刪除這張照片嗎？地點本身不會被刪除。"
    );

  if (!shouldDelete) {
    return;
  }

  const selectedPlaceId =
    selectedPlace.properties.id;

  const deletedPhotoIndex =
    storyPhotoIndex;

  pageElements.storyDeletePhotoButton
    .disabled = true;

  pageElements.storyDeletePhotoButton
    .textContent =
    "刪除中…";

  try {
    if (isLaterAddedPhoto) {
      await deleteAddedPlacePhoto(
        selectedPhoto.photoId
      );
    }

    if (isOriginalCommunityPhoto) {
      selectedPlace.properties.photo =
        "";

      selectedPlace.properties
        .currentImage = "";

      const contributionWasSaved =
        saveStoredArray(
          STORAGE_KEYS.contributions,
          communityPlaces
        );

      if (!contributionWasSaved) {
        throw new Error(
          "使用者地點資料未能更新。"
        );
      }
    }

    if (
      selectedPlace?.properties?.id !==
      selectedPlaceId
    ) {
      return;
    }

    await configureStoryImages(
      selectedPlace.properties,
      "current"
    );

    storyPhotoIndex =
      Math.max(
        0,
        Math.min(
          deletedPhotoIndex,
          storyPhotoItems.length - 1
        )
      );

    renderSelectedStoryPhoto(
      selectedPlace.properties
    );

    showToast(
      "照片已刪除，地點仍然保留。"
    );
  } catch (error) {
    console.error(
      "刪除地點照片失敗：",
      error
    );

    showToast(
      "照片未能刪除，請重新嘗試。"
    );
  } finally {
    if (
      pageElements.storyDeletePhotoButton
    ) {
      pageElements.storyDeletePhotoButton
        .disabled = false;

      pageElements.storyDeletePhotoButton
        .textContent =
        "刪除照片";
    }
  }
}

// ========================================
// 為目前地點後續添加照片
// ========================================

async function addPhotosToSelectedPlace(
  event
) {
  const input = event.currentTarget;

  const files = [
    ...(input.files || [])
  ];

  if (
    !selectedPlace ||
    !files.length
  ) {
    input.value = "";
    return;
  }

  const selectedPlaceId =
    selectedPlace.properties.id;

  const selectedInformation =
    selectedPlace.properties;

  pageElements.storyAddPhotoButton
    .disabled = true;

  pageElements.storyAddPhotoButton
    .textContent =
    "照片處理中…";

  let savedPhotoCount = 0;

  try {
    for (const file of files) {
      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        continue;
      }

      const imageData =
        await compressImageFile(
          file
        );

      const createdAt =
        new Date().toISOString();

      await saveAddedPlacePhoto({
        photoId:
          `place-photo-${Date.now()}-${savedPhotoCount}`,
        placeId:
          selectedPlaceId,
        imageData,
        caption: "",
        fileName:
          file.name || "",
        createdAt,
        source: "community"
      });

      savedPhotoCount += 1;
    }

    if (!savedPhotoCount) {
      showToast(
        "沒有找到可以添加的圖片。"
      );

      return;
    }

    if (
      selectedPlace?.properties?.id ===
      selectedPlaceId
    ) {
      await configureStoryImages(
        selectedInformation,
        "current"
      );

      storyPhotoIndex =
        Math.max(
          0,
          storyPhotoItems.length - 1
        );

      renderSelectedStoryPhoto(
        selectedInformation
      );
    }

    showToast(
      savedPhotoCount === 1
        ? "照片已加入這個地點。"
        : `已加入${savedPhotoCount}張照片。`
    );
  } catch (error) {
    console.error(
      "添加地點照片失敗：",
      error
    );

    showToast(
      "照片未能保存，請重新嘗試。"
    );
  } finally {
    input.value = "";

    pageElements.storyAddPhotoButton
      .disabled = false;

    pageElements.storyAddPhotoButton
      .innerHTML = `
        <span aria-hidden="true">
          ＋
        </span>
        添加照片
      `;
  }
}

// ========================================
// 預覽用戶照片
// ========================================

function previewContributionPhoto() {
  const file =
    pageElements.contributionPhoto
      .files[0];

  if (!file) {
    pageElements
      .contributionPhotoPreview
      .classList.remove(
        "is-visible"
      );

    return;
  }

  const reader =
    new FileReader();

  reader.onload = () => {
    pageElements
      .contributionPreviewImage
      .src =
      reader.result;

    pageElements
      .contributionPhotoPreview
      .classList.add(
        "is-visible"
      );
  };

  reader.readAsDataURL(file);
}

// ========================================
// 本地資料儲存
// ========================================

function loadStoredArray(key) {
  try {
    const storedValue =
      localStorage.getItem(key);

    if (!storedValue) {
      return [];
    }

    const parsedValue =
      JSON.parse(storedValue);

    return Array.isArray(
      parsedValue
    )
      ? parsedValue
      : [];
  } catch (error) {
    console.warn(
      `無法讀取本地資料：${key}`,
      error
    );

    return [];
  }
}

function saveStoredArray(
  key,
  value
) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );

    return true;
  } catch (error) {
    console.error(
      `無法儲存本地資料：${key}`,
      error
    );

    showToast(
      "圖片資料較大，這個地點未能儲存。"
    );

    return false;
  }
}

// ========================================
// 頁面通知
// ========================================

let toastTimeout = null;

function showToast(message) {
  window.clearTimeout(
    toastTimeout
  );

  pageElements.toast.textContent =
    message;

  pageElements.toast.classList.add(
    "is-visible"
  );

  toastTimeout =
    window.setTimeout(
      () => {
        pageElements.toast
          .classList.remove(
            "is-visible"
          );
      },
      2800
    );
}

// ========================================
// 安全文字處理
// ========================================

function escapeHTML(value) {
  return String(value)
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      "\"",
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );
}

// ========================================
// 地圖與頁面事件
// ========================================

map.on("click", (event) => {
  if (contributionModeIsOpen) {
    selectContributionCoordinates(
      event.lngLat
    );

    return;
  }

  if (
    event.originalEvent.target ===
    map.getCanvas()
  ) {
    closeStoryPanel();
  }
});

pageElements.archivePanelToggle
  ?.addEventListener(
    "click",
    toggleArchivePanel
  );

bindContentFilterButtons(
  pageElements.mapFilterButtons
);

bindContentFilterButtons(
  pageElements.archiveFilterButtons
);

pageElements.storyPanelClose
  ?.addEventListener(
    "click",
    () => {
      closeStoryPanel({
        returnToOverview: true
      });
    }
  );

pageElements.storyDeletePhotoButton
  ?.addEventListener(
    "click",
    deleteCurrentStoryPhoto
  );

// ========================================
// 地點照片畫廊操作
// ========================================

pageElements.storyPreviousPhotoButton
  ?.addEventListener(
    "click",
    () => {
      changeStoryPhoto(-1);
    }
  );

pageElements.storyNextPhotoButton
  ?.addEventListener(
    "click",
    () => {
      changeStoryPhoto(1);
    }
  );

pageElements.storyAddPhotoButton
  ?.addEventListener(
    "click",
    () => {
      if (!selectedPlace) {
        showToast(
          "請先選擇一個地點。"
        );

        return;
      }

      pageElements.storyAddPhotoInput
        ?.click();
    }
  );

pageElements.storyAddPhotoInput
  ?.addEventListener(
    "change",
    addPhotosToSelectedPlace
  );

pageElements.showCurrentImageButton
  ?.addEventListener(
    "click",
    () => {
      if (!selectedPlace) {
        return;
      }

      configureStoryImages(
        selectedPlace.properties,
        "current"
      );
    }
  );

pageElements.showPastImageButton
  ?.addEventListener(
    "click",
    () => {
      if (!selectedPlace) {
        return;
      }

      const information =
        selectedPlace.properties;

      if (
        information.pastPanorama
      ) {
        openHistoricalPanorama(
          selectedPlace
        );

        return;
      }

      configureStoryImages(
        information,
        "past"
      );
    }
  );

pageElements
  .closeHistoricalPanoramaButton
  ?.addEventListener(
    "click",
    closeHistoricalPanorama
  );

pageElements.storyAudioButton
  ?.addEventListener(
    "click",
    () => {
      const source =
        pageElements
          .storyAudioButton
          .dataset.source;

      if (!source) {
        showToast(
          "這個地點的聲音仍在整理中。"
        );

        return;
      }

      window.open(
        source,
        "_blank",
        "noopener,noreferrer"
      );
    }
  );

pageElements.storyLightButton
  ?.addEventListener(
    "click",
    toggleSelectedPlaceLight
  );

pageElements.editContributionButton
  ?.addEventListener(
    "click",
    openSelectedContributionEditor
  );

pageElements.deleteContributionButton
  ?.addEventListener(
    "click",
    deleteSelectedContribution
  );

pageElements.tramFollowButton
  ?.addEventListener(
    "click",
    () => {
      setTramFollowing(
        !tramFollowingIsActive
      );
    }
  );

pageElements.openContributionButton
  ?.addEventListener(
    "click",
    openContributionDialog
  );

pageElements.closeContributionButton
  ?.addEventListener(
    "click",
    closeContributionDialog
  );

document
  .querySelectorAll(
    "[data-close-contribution]"
  )
  .forEach((element) => {
    element.addEventListener(
      "click",
      closeContributionDialog
    );
  });

pageElements.contributionForm
  ?.addEventListener(
    "submit",
    saveContribution
  );

// ========================================
// 自動尋找地點按鈕
// ========================================

document
  .querySelector(
    "#find-contribution-location"
  )
  ?.addEventListener(
    "click",
    findContributionLocation
  );

// ========================================
// 在地點名稱輸入框按回車搜尋
// ========================================

document
  .querySelector(
    "#contribution-location"
  )
  ?.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Enter") {
        return;
      }

      event.preventDefault();

      findContributionLocation();
    }
  );

pageElements.contributionPhoto
  ?.addEventListener(
    "change",
    previewContributionPhoto
  );

document.addEventListener(
  "keydown",
  (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (
      historicalPanoramaIsOpen
    ) {
      closeHistoricalPanorama();
      return;
    }

    if (contributionModeIsOpen) {
      closeContributionDialog();
      return;
    }

    if (
      pageElements.storyPanel
        .classList.contains(
          "is-open"
        )
    ) {
      closeStoryPanel({
        returnToOverview: true
      });
    }
  }
);

map.on(
  "zoom",
  () => {
    updatePlaceLabelDensity();
    schedulePlaceLabelLayout();
  }
);

map.on(
  "move",
  schedulePlaceLabelLayout
);

map.on(
  "moveend",
  () => {
    schedulePlaceLabelLayout();

    window.requestAnimationFrame(
      () => {
        updateFoodMarkerClusters();
      }
    );
  }
);

map.on(
  "zoomend",
  () => {
    schedulePlaceLabelLayout();

    window.requestAnimationFrame(
      () => {
        updateFoodMarkerClusters();
      }
    );
  }
);

map.on(
  "resize",
  schedulePlaceLabelLayout
);

map.on(
  "load",
  () => {
    updatePlaceLabelDensity();
    updateFoodMarkerClusters();
    schedulePlaceLabelLayout();
  }
);

// ========================================
// 幫助中心、首次引導與關於計劃
// ========================================

const WELCOME_GUIDE_STORAGE_KEY =
  "urban-senses-welcome-guide-seen";

const welcomeGuide =
  document.querySelector(
    "#welcome-guide"
  );

const closeWelcomeGuideButton =
  document.querySelector(
    "#close-welcome-guide"
  );

const startExploringButton =
  document.querySelector(
    "#start-exploring"
  );

const openHelpMenuButton =
  document.querySelector(
    "#open-help-menu"
  );

const helpMenu =
  document.querySelector(
    "#help-menu"
  );

const helpOpenGuideButton =
  document.querySelector(
    "#help-open-guide"
  );

const helpOpenAboutButton =
  document.querySelector(
    "#help-open-about"
  );

const aboutProjectDialog =
  document.querySelector(
    "#about-project-dialog"
  );

const closeAboutProjectButton =
  document.querySelector(
    "#close-about-project"
  );

const aboutOpenGuideButton =
  document.querySelector(
    "#about-open-guide"
  );

let welcomeGuidePreviousFocus = null;
let aboutProjectPreviousFocus = null;

// ========================================
// 幫助選單
// ========================================

function closeHelpMenu() {
  if (!helpMenu) {
    return;
  }

  helpMenu.hidden = true;

  openHelpMenuButton
    ?.setAttribute(
      "aria-expanded",
      "false"
    );
}

function toggleHelpMenu() {
  if (!helpMenu) {
    return;
  }

  const shouldOpen =
    helpMenu.hidden;

  helpMenu.hidden =
    !shouldOpen;

  openHelpMenuButton
    ?.setAttribute(
      "aria-expanded",
      String(shouldOpen)
    );
}

// ========================================
// 首次使用引導
// ========================================

function hasSeenWelcomeGuide() {
  try {
    return (
      localStorage.getItem(
        WELCOME_GUIDE_STORAGE_KEY
      ) === "true"
    );
  } catch (error) {
    return false;
  }
}

function rememberWelcomeGuide() {
  try {
    localStorage.setItem(
      WELCOME_GUIDE_STORAGE_KEY,
      "true"
    );
  } catch (error) {
    console.warn(
      "無法儲存使用引導狀態：",
      error
    );
  }
}

function openWelcomeGuide() {
  if (!welcomeGuide) {
    return;
  }

  closeHelpMenu();
  closeAboutProject();

  welcomeGuidePreviousFocus =
    document.activeElement;

  welcomeGuide.classList.remove(
    "is-closing"
  );

  welcomeGuide.hidden = false;

  document.body.classList.add(
    "welcome-guide-open"
  );

  window.requestAnimationFrame(
    () => {
      startExploringButton
        ?.focus();
    }
  );
}

function closeWelcomeGuide({
  remember = true
} = {}) {
  if (
    !welcomeGuide ||
    welcomeGuide.hidden
  ) {
    return;
  }

  if (remember) {
    rememberWelcomeGuide();
  }

  welcomeGuide.classList.add(
    "is-closing"
  );

  window.setTimeout(() => {
    welcomeGuide.hidden = true;

    welcomeGuide.classList.remove(
      "is-closing"
    );

    document.body.classList.remove(
      "welcome-guide-open"
    );

    if (
      welcomeGuidePreviousFocus
      instanceof HTMLElement
    ) {
      welcomeGuidePreviousFocus
        .focus();
    }
  }, 260);
}

// ========================================
// 關於此計劃
// ========================================

function openAboutProject() {
  if (!aboutProjectDialog) {
    return;
  }

  closeHelpMenu();

  aboutProjectPreviousFocus =
    document.activeElement;

  aboutProjectDialog.hidden = false;

  document.body.classList.add(
    "about-project-open"
  );

  window.requestAnimationFrame(
    () => {
      closeAboutProjectButton
        ?.focus();
    }
  );
}

function closeAboutProject() {
  if (
    !aboutProjectDialog ||
    aboutProjectDialog.hidden
  ) {
    return;
  }

  aboutProjectDialog.hidden = true;

  document.body.classList.remove(
    "about-project-open"
  );

  if (
    aboutProjectPreviousFocus
    instanceof HTMLElement
  ) {
    aboutProjectPreviousFocus
      .focus();
  }
}

// ========================================
// 按鈕事件
// ========================================

openHelpMenuButton
  ?.addEventListener(
    "click",
    (event) => {
      event.stopPropagation();
      toggleHelpMenu();
    }
  );

helpMenu
  ?.addEventListener(
    "click",
    (event) => {
      event.stopPropagation();
    }
  );

helpOpenGuideButton
  ?.addEventListener(
    "click",
    openWelcomeGuide
  );

helpOpenAboutButton
  ?.addEventListener(
    "click",
    openAboutProject
  );

closeWelcomeGuideButton
  ?.addEventListener(
    "click",
    () => {
      closeWelcomeGuide();
    }
  );

startExploringButton
  ?.addEventListener(
    "click",
    () => {
      closeWelcomeGuide();
    }
  );

welcomeGuide
  ?.querySelector(
    ".welcome-guide-backdrop"
  )
  ?.addEventListener(
    "click",
    () => {
      closeWelcomeGuide();
    }
  );

closeAboutProjectButton
  ?.addEventListener(
    "click",
    closeAboutProject
  );

aboutProjectDialog
  ?.querySelectorAll(
    "[data-close-about-project]"
  )
  .forEach((element) => {
    element.addEventListener(
      "click",
      closeAboutProject
    );
  });

aboutOpenGuideButton
  ?.addEventListener(
    "click",
    () => {
      closeAboutProject();
      openWelcomeGuide();
    }
  );

document.addEventListener(
  "click",
  (event) => {
    if (
      !event.target.closest(
        ".help-centre"
      )
    ) {
      closeHelpMenu();
    }
  }
);

// ========================================
// 鍵盤操作
// ========================================

document.addEventListener(
  "keydown",
  (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (
      aboutProjectDialog &&
      !aboutProjectDialog.hidden
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();

      closeAboutProject();
      return;
    }

    if (
      welcomeGuide &&
      !welcomeGuide.hidden
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();

      closeWelcomeGuide();
      return;
    }

    if (
      helpMenu &&
      !helpMenu.hidden
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();

      closeHelpMenu();
    }
  },
  true
);

// ========================================
// 第一次進入網站時顯示引導
// ========================================

window.addEventListener(
  "DOMContentLoaded",
  () => {
    if (!hasSeenWelcomeGuide()) {
      window.setTimeout(
        openWelcomeGuide,
        550
      );
    }
  }
);
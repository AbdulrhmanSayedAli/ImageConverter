const filePicker = document.getElementById("file-picker");
const editorCanvas = document.getElementById("canvas-editor");
const resultCanvas = document.getElementById("canvas-result");
const canvasContainer = document.getElementsByClassName("canvas-container")[0];
const convertButton = document.getElementById("convert-button");
const editorContext = editorCanvas.getContext("2d");
const resultContext = resultCanvas.getContext("2d");
const colorThief = new ColorThief();

const ImagesCount = 420;
const ImagesFolderCount = "./app_images_minecraft_16";
const pixle_size = 16;
const IconPixles = [];

const loadIcons = (index = 1) => {
  if (index > ImagesCount) {
    return;
  }

  let imageName = "" + index + ".png";
  let imagePath = ImagesFolderCount + "/" + imageName;
  let img = document.createElement("img");
  img.src = imagePath;

  img.onload = (ev) => {
    editorCanvas.width = img.width;
    editorCanvas.height = img.height;
    editorContext.drawImage(img, 0, 0);
    let imageData = editorContext.getImageData(
      0,
      0,
      editorCanvas.width,
      editorCanvas.height
    );

    IconPixles.push({
      image: imageData,
      rgb: colorThief.getColor(img),
    });

    loadIcons(index + 1);
  };
};

loadIcons();

const downloadImage = () => {
  let dataURL = resultCanvas.toDataURL("image/png");
  let link = document.createElement("a");
  link.href = dataURL;
  link.download = "image.png";
  link.click();
};

const process = (img) => {
  resultCanvas.classList.add("blurred");
  canvasContainer.style.visibility = "visible";
  canvasContainer.style.position = "static";
  editorCanvas.width = img.width;
  editorCanvas.height = img.height;
  editorContext.drawImage(img, 0, 0);
  resultCanvas.width = img.width;
  resultCanvas.height = img.height;
  resultContext.drawImage(img, 0, 0);

  convertButton.addEventListener("click", (e) => {
    let imageData = editorContext.getImageData(
      0,
      0,
      editorCanvas.width,
      editorCanvas.height
    );
    resultCanvas.classList.remove("blurred");
    resultCanvas.width = img.width * pixle_size;
    resultCanvas.height = img.height * pixle_size;

    navigator.serviceWorker.controller.postMessage({
      type: "process-image",
      imageData: imageData,
      IconPixles: IconPixles,
      pixle_size: pixle_size,
    });
  });
};

const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "serviceWorker.js",
        {
          scope: "/",
        }
      );
      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

registerServiceWorker();

filePicker.addEventListener("change", (e) => {
  let file = e.target.files[0];
  let reader = new FileReader();

  reader.onload = function (event) {
    let img = new Image();
    img.onload = function () {
      process(img);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

navigator.serviceWorker.addEventListener("message", (event) => {
  if (event.data && event.data.type === "process-image") {

    let width = event.data.width;
    let height = event.data.height;
    let row = event.data.row;

    let resultImageData = new ImageData(
      new Uint8ClampedArray(event.data.resultImageDataArray),
      width * pixle_size,
      pixle_size
    );
    console.log(resultImageData);

    resultContext.putImageData(resultImageData, 0, row * pixle_size);

    if (row === height - 1)
      setTimeout(() => {
        downloadImage();
      }, 200);
  }
});

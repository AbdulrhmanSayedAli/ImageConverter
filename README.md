# Image Converter

## Overview

<b>Image Converter</b> is a web application that transforms images into larger composite images made up of smaller icons. You can choose from a variety of icon sets such as app icons, Minecraft blocks, and more. The conversion process happens in the background using a Service Worker, ensuring a smooth and efficient user experience without affecting the main thread.

## Features

- <b>Icon Sets</b>: Choose from a variety of icon sets including:

  - App icons
  - Minecraft blocks
  - Custom icons (make your own)

- <b>Background Processing</b>: Utilizes a Service Worker to handle image conversion in the background, preventing the UI from freezing and ensuring a responsive experience.

- <b>Downloadable Results</b>: Easily download the generated composite image.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/en) (for running the development environment)
- A modern web browser (for testing the web application)

### Steps

1. <b>Clone the Repository:</b>

```bash
git clone https://github.com/AbdulrhmanSayedAli/ImageConverter.git
cd ImageConverter
```

2. <b>Install Dependencies:</b>

```bash
npm install
```

3. <b>Run the Application:</b>

```bash
npm start
```

## Usage

1. <b>Choose an Icon Set:</b>

   - In `main.js` file `line 10` there is 3 vars which defines the images set.

   ```javascript
   const ImagesCount = 420;
   const ImagesFolderCount = "./app_images_minecraft_16";
   const pixle_size = 16; //the width and height of each small icon (written in the folder name of each icon set)
   ```

   - To make you own Icon set create a folder and put inside it you icons that are `pixle_size`\*`pixle_size` width and height and change the vars above.

2. <b>Upload an Image:</b>

   - Click on the "Choose Image" button to select an image from your device.

3. <b>Convert:</b>
   - Click the "Convert" button to start the conversion process. The Service Worker will handle the heavy lifting in the background.
   - Once the conversion is complete, the image will be downloaded automatically.

## Technologies Used

- <b>HTML5 & CSS3:</b> For structuring and styling the application.
- <b>JavaScript (ES6+):</b> Core logic and interactivity.
- <b>Service Worker:</b> For background processing of image conversion tasks.
- <b>Canvas API:</b> To handle image manipulation and drawing.
- <b>Live Server:</b> Provides a live development server with live reloading for better development experience.
- <b>Node.js:</b> For setting up the development environment.

## Contributing

Contributions are welcome! Please follow the steps below:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/AbdulrhmanSayedAli/ImageConverter/blob/main/LICENSE) file for details.

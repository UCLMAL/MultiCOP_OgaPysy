# OgaPysy Portal

A Three.js-based interactive 3D environment mapping portal that allows users to upload custom images and videos as environment textures for reflective 3D models.

## Features

- **Interactive 3D Environment**: Fully interactive 3D scene with orbit controls
- **Custom Textures**: Upload your own images or videos to use as environment maps
- **Dynamic Zoom**: Adjust the zoom level of the environment map in real-time
- **Reflective Materials**: Physically-based rendering with metallic reflective surfaces
- **Responsive Design**: Works on various screen sizes

## Tech Stack

- **Three.js**: 3D graphics library
- **Tailwind CSS**: Utility-first CSS framework
- **Vanilla JavaScript**: ES6 modules for clean, modular code
- **Vercel**: Deployment platform

## Project Structure

```
.
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── js/
│   ├── main.js        # Application entry point
│   ├── scene.js       # Three.js scene management
│   ├── ui.js          # UI controls and interactions
│   └── config.js      # Configuration constants
├── package.json       # Project metadata and scripts
├── vercel.json        # Vercel deployment configuration
└── README.md          # This file
```

## Getting Started

### Prerequisites

- A modern web browser with WebGL support
- Python 3 (for local development server) or any static file server

### Local Development

1. Clone the repository:
```bash
git clone <your-repo-url>
cd OgaPysyPortal
```

2. Start a local development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

### Deployment to Vercel

1. Install Vercel CLI (optional):
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

Or simply push to GitHub and connect the repository to Vercel through their dashboard.

## Usage

1. Click "Start Experience" to begin
2. Use your mouse to rotate the camera around the 3D model
3. Upload a custom image using the "Upload Image" button
4. Upload a custom video using the "Upload Video" button
5. Reset to the default video with the "Use Default Video" button
6. Adjust the environment zoom using the slider in the top-right corner

## Controls

- **Left Mouse Button**: Rotate camera
- **Right Mouse Button**: Pan camera
- **Mouse Wheel**: Zoom in/out
- **Zoom Slider**: Adjust environment map zoom

## Configuration

You can modify settings in `js/config.js`:

- Camera settings (FOV, position, etc.)
- Material properties (metalness, roughness)
- Zoom range
- Model and video URLs

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ⚠️ Limited (depends on device capabilities)

## License

MIT

## Credits

Built with [Three.js](https://threejs.org/)

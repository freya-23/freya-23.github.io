# freya-23.github.io

Portfolio of Freya Shah, data analyst. Live at **https://freya-23.github.io**.

The hero is an interactive topographic map drawn with a WebGL shader: moving the pointer raises the terrain, and clicking or tapping drops a ripple. Projects open as shareable pages (for example `#work/phoenix-food-access`), and the site works on phones with a bottom dock for navigation.

## Where things live

| File | What it holds |
|---|---|
| `src/data.js` | All text: projects, experience, skills, education, contact links, resume link |
| `src/App.js` | Page layout, navigation, project pages, theme panel |
| `src/ContourField.js` | The interactive contour map in the hero |
| `src/Glyphs.js` | Line drawings used as project thumbnails |
| `src/styles.css` | Layout and responsive styles |
| `public/img`, `public/icons` | Photo, project images, link preview image, skill icons |

To add a resume download, put the PDF in `public/` and set `RESUME_URL` at the top of `src/data.js`.

## Run and deploy

```bash
npm install
npm start          # local preview at http://localhost:3000
npm run deploy     # builds and publishes to the gh-pages branch
```

Built with React 18 and plain WebGL, no other runtime dependencies.

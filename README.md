# Fossil Archive 🦖

A personal, high-performance web application designed for fossil collectors, sedimentologists, and paleontology enthusiasts to log, manage, and showcase their fossil specimens.

The Fossil Archive is a fully offline-capable, local-first database built on standard web technologies (HTML, CSS, JS). All your sensitive data and images are securely stored entirely on your device using `IndexedDB`.

## Features ✨

- **Local-First Privacy**: No servers, no accounts, and no data tracking. Everything lives directly in your browser.
- **Scientific Etymology Tooltips**: Integrated paleontological dictionary that automatically annotates specimen names. Hover over roots like *saurus*, *pteryx*, or *idae* to see their scientific meanings and origins.
- **Interactive Geological Timeline**: Each specimen features a high-fidelity timeline bar, visualizing its position in Earth's 541-million-year history (Phanerozoic Eon) relative to the Present.
- **Detailed Taxonomic & Geological Data**: Built-in support for intricate geological periods, epochs, stages (custom stratigraphic ages), and estimated age in millions of years (Ma).
- **Collection Insights (Dashboard)**: Dynamic charts and statistics summarizing your collection's taxonomic diversity, geographical distribution, and estimated valuation.
- **Collection vs. Wishlist**: Seamlessly manage both the fossils you currently own and the ones you are actively hunting for.
- **Advanced Filtering & Sorting**: Quickly search through notes and localities, or filter by taxonomy and geological age. Sort by purchase price, age, or recently added.
- **Intelligent Image Handling**:
  - Upload multiple photos per specimen (including seamless, client-side HEIC conversion for iPhone photos).
  - Background image compression shrinks 10MB raw photos into highly optimized thumbnails, guaranteeing a smooth and fast scrolling experience even with hundreds of cataloged items.
- **Import / Export**: Full JSON backups to easily transfer your collection between devices, plus a CSV import tool to migrate existing spreadsheets into your vault.
- **Mass Management**: Select multiple fossils to quickly delete or process batches.

## Usage 📖

Because the application runs entirely locally, there is no complicated backend setup required.

### Getting Started

1. Download or clone this repository to your computer.
2. Open the index file: Simply double-click on `index.html` (or drag it into your browser) to launch the app.
3. Add a Fossil: Click the **+ Add Fossil** button in the top right to log your first specimen.
4. Upload Images: You can upload JPEGs, PNGs, WebP files, or even raw HEIC photos straight from an iPhone. The app automatically resizes and optimizes them behind the scenes.

*(Note: While the app is perfectly functional running purely from the `file://` protocol, you may want to serve it using a simple local HTTP server like `python -m http.server` for the most accurate behavior depending on your browser's local security policies).*

### Backing Up Data
Since data is saved locally in your browser's IndexedDB, clearing your browser history or caches **may delete your collection**. 
* Always use the **Export Backup** icon (the downward-pointing arrow in the header) regularly to download a `.json` snapshot of your collections and images.
* To restore, click the **Restore Database** icon (the circular arrow) and select your `.json` file.

### CSV Import
If you currently track your collection in Excel or Google Sheets, you can export it as a CSV file and use the **Import CSV** command. The application will automatically attempt to map standard columns (like `specimen`, `category`, `period`, `price`, etc.) directly into the database.

## Technologies Used 💻
- **HTML5 & Vanilla Javascript (ES5+)** - Ensuring longevity and lack of framework bloat.
- **Vanilla CSS** - Clean, responsive UI with modern custom CSS properties.
- **IndexedDB** - High capacity local browser storage.
- **PapaParse** - Robust CSV parsing.
- **heic2any** - Client-side HEIC-to-JPEG image conversions. 

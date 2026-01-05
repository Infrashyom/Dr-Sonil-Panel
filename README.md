# Dr. Sonil Women's Care Centre - MERN Stack Project

This project is a premium healthcare website with a fully functional Admin Portal, built using the **MERN** stack (MongoDB, Express, React, Node.js) and **Cloudinary** for image storage.

## 📋 Prerequisites

Before starting, ensure you have the following installed:
1.  **Node.js** (v14 or higher)
2.  **MongoDB** (Ensure MongoDB Community Server is installed and running locally on port `27017`)
3.  **Cloudinary Account**: You need a free account from [cloudinary.com](https://cloudinary.com/).

---

## ⚡ Quick Start (Single Command)

Once you have downloaded the project, follow these steps to run everything at once:

1.  **Install Frontend Dependencies**:
    ```bash
    npm install
    ```

2.  **Install Backend Dependencies**:
    ```bash
    cd backend
    npm install
    cd ..
    ```
    *(You only need to do steps 1 & 2 once)*

3.  **Setup Environment Variables**:
    Create a `.env` file in the `backend/` folder (see Backend Setup below for details).

4.  **Run the App**:
    From the root directory, run:
    ```bash
    npm run dev
    ```
    This will start **both** the Frontend (http://localhost:3000) and Backend (http://localhost:5000) simultaneously.

---

## 🚀 Detailed Setup Instructions

### 1. Backend Setup

1.  Navigate to the `backend` folder:
    ```bash
    cd backend
    ```

2.  **Create `.env` file** in the `backend` folder with the following content:
    ```env
    MONGO_URI=mongodb://127.0.0.1:27017/dr_sonil_db
    PORT=5000
    CLOUDINARY_CLOUD_NAME=your_cloud_name_here
    CLOUDINARY_API_KEY=your_api_key_here
    CLOUDINARY_API_SECRET=your_api_secret_here
    ```

3.  Install dependencies:
    ```bash
    npm install
    ```

### 2. Frontend Setup

1.  Navigate to the project root:
    ```bash
    cd ..
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

---

## 🔐 Admin Portal Guide

To access the Admin Dashboard:
1.  Go to the website footer or navigate to `/admin/login`.
2.  **Default Password**: `admin123` (or `demo` for offline mode).

### 🌟 Managing Home Page Videos
You can control exactly which videos appear on the Home Page "Video Gallery" section:

1.  Navigate to **Admin Portal > Gallery**.
2.  Click the **Star Icon (⭐)** on any video card.
    *   **Yellow Star**: The video IS featured on the Home Page.
    *   **Grey Star**: The video is only visible in the full Gallery page.
3.  *Note*: If NO videos are starred, the system will automatically display the 3 most recently uploaded videos.

### 📏 Image Dimensions Guide

For the best visual experience, please use the following dimensions when uploading images via the Admin Portal:

1.  **Hero Banners (Carousel)**:
    *   **Dimension**: `1920 x 1080` pixels
    *   **Aspect Ratio**: 16:9
    *   *Tip*: Use high-resolution images as these cover the full screen.

2.  **Gallery Images**:
    *   **Dimension**: `1200 x 900` pixels
    *   **Aspect Ratio**: 4:3
    *   *Tip*: Consistent sizing ensures the grid looks neat.

---

## 🔗 Architecture

*   **Frontend**: React (Vite), TypeScript, Tailwind CSS.
    *   `utils/storage.ts`: Handles API calls to the backend.
*   **Backend**: Node.js, Express, Mongoose, Cloudinary SDK.
    *   `backend/src/controllers/mediaController.js`: Handles image uploads to Cloudinary.

## ⚠️ Troubleshooting

*   **"Image upload failed"**: Check your `.env` file in the backend folder. Ensure your Cloudinary credentials are correct.
*   **"MongoDB Connection Error"**: Make sure your local MongoDB service is running.
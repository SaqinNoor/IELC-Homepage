# Ideal English Language Club (IELC) Homepage

A website for the **Ideal English Language Club (IELC)**. 

## 🚀 Live Demo

The site is hosted at: [https://ielc-homepage.vercel.app/](https://ielc-homepage.vercel.app/)

## ✨ Features

- **Smooth Scrolling**: Integrated with [Lenis](https://github.com/darkroomengineering/lenis) for a smooth scrolling experience.
- **Advanced Animations**: Powered by [GSAP](https://gsap.com/) (GreenSock Animation Platform), including:
  - **ScrollTrigger**: Elements reveal gracefully as you scroll.
  - **Horizontal Scroll**: A dedicated "What We Do" section using pin-scroll techniques.
- **Custom Interactive Cursor**: A dynamic cursor with a magnetic follower that reacts to clickable elements.
- **Seamless Page Transitions**: Custom-built loading and transition sequences between page loads.
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.
- **Modern Typography**

## 🛠️ Technology Stack

- **Framework**: [Vite](https://vitejs.dev/)
- **Animations**: GSAP, ScrollTrigger
- **Smooth Scroll**: Lenis
- **Styling**: CSS (Vanilla)
- **Deployment**: Vercel

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/)
- [Python](https://www.python.org/) & [uv](https://docs.astral.sh/uv/) (for running auxiliary scripts)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/SaqinNoor/IELC-Homepage.git
    cd IELC-Homepage
    ```

2.  **Install dependencies**:
    ```bash
    pnpm install
    ```

3.  **Run locally**:
    ```bash
    pnpm run dev
    ```

4.  **Build for production**:
    ```bash
    pnpm run build
    ```

### Running Utility Scripts

The repository includes Python scripts for optimizing assets. You can run them using `uv`:

```bash
uv run convert_to_webp.py
uv run optimize_html_images.py
uv run update_references.py
```

## 🚢 Deployment

This project is configured for automated deployment via **Vercel**. Every push to the `main` branch will automatically:
1.  Run the build process.
2.  Deploy the static files to the production environment.

## 📝 License

&copy; 2026 A.K.M. Saqin Noor. All rights reserved.

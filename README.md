# Pattern Matcher Visualization

A beautiful, interactive pattern matching visualization tool built with Next.js and TypeScript. This application provides a crystal-clear visual representation of pattern matching algorithms with elegant animations and a modern glass-morphic UI.

## 📸 Screenshots

### Main Interface
![Main Interface](public/Input.png)
*Clean and intuitive interface with text input, pattern input, and algorithm selection*

### Algorithm Visualization
![Algorithm Visualization](public/AlgoVisualization.png)
*Real-time visualization showing pattern matching with crystal-clear boxes and step-by-step explanations*

### Algorithm Tables Examples
![Horspool Bad Character Table](public/Shifttable.png)
*Example of Horspool algorithm's bad character table showing skip distances for each character*

![KMP LPS Array](public/lpstable.png)
*Example of KMP algorithm's failure function (LPS array) showing longest prefix suffix values*

## ✨ Features

- 🎯 **Real-time pattern matching visualization** - Watch algorithms work step by step
- 🔍 **Multiple Algorithms** - Choose between Horspool, KMP, and Brute Force algorithms
- 🎨 **Modern glass-morphic UI design** - Crystal-clear boxes with beautiful transparency effects
- 🌗 **Dark/Light mode support** - Switch between themes for comfortable viewing
- 🎭 **Beautiful gradient backgrounds** - Stunning visual design with smooth color transitions
- 📱 **Fully responsive design** - Works perfectly on desktop, tablet, and mobile
- ⚡ **Built with performance in mind** - Smooth animations and efficient rendering
- 🎮 **Interactive Controls** - Play, pause, step forward/backward through the algorithm
- 📊 **Algorithm Tables** - View bad character tables (Horspool) and failure functions (KMP)
- 🎨 **Color-coded Visualization** - Different colors for matches, current comparisons, and search windows

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pattern-matcher.git
cd pattern-matcher
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm dev
```

The application will be available at `http://localhost:3000`

## 🔬 Supported Algorithms

### 1. Horspool Algorithm
- **Efficiency**: O(nm) worst case, O(n/m) average case
- **Features**: Uses bad character heuristic for efficient skipping
- **Visualization**: Shows bad character table with skip distances (see example above)
- **How it works**: Pre-computes skip distances for each character to avoid redundant comparisons
- **Best for**: General text searching with good average performance

### 2. KMP (Knuth-Morris-Pratt) Algorithm
- **Efficiency**: O(n+m) linear time complexity
- **Features**: Uses failure function (LPS array) to avoid re-examining text characters
- **Visualization**: Shows failure function table with longest prefix suffix values (see example above)
- **How it works**: Pre-processes pattern to create failure function for efficient backtracking
- **Best for**: Guaranteed linear time performance

### 3. Brute Force Algorithm
- **Efficiency**: O(nm) time complexity
- **Features**: Simple character-by-character comparison
- **Visualization**: Shows direct comparison approach without preprocessing
- **How it works**: Compares pattern with text at each position sequentially
- **Best for**: Educational purposes and small datasets

## 🛠️ Tech Stack

- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **State Management**: React Hooks
- **Animations**: CSS Transitions

## 🎨 UI Components

The project includes a comprehensive set of UI components:
- Custom Pattern Matcher visualization
- Theme Provider for dark/light mode
- Responsive layout components
- Interactive UI elements

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Shadcn UI
- Next.js
- TailwindCSS

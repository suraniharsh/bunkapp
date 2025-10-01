# 🎓 BunkApp - Smart Attendance Calculator

> Your intelligent companion for managing attendance and making informed decisions about your academic journey.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Features

- **📊 Real-time Calculations** - Instantly calculate your current attendance percentage
- **🎯 Smart Recommendations** - Know exactly how many lectures you can safely skip
- **⚠️ Risk Assessment** - Get warnings when you're approaching the danger zone
- **🌙 Dark/Light Theme** - Seamless theme switching for day and night use
- **📱 Mobile Responsive** - Works perfectly on all devices
- **💾 Data Persistence** - Your data is saved locally and restored automatically
- **🎨 Beautiful UI** - Clean, modern interface with smooth animations

## 🚀 Demo

Visit the live app: [BunkApp](https://your-deployment-url.vercel.app)

## 📸 Screenshots

### Light Mode
![Light Mode Screenshot](./public/screenshot-light.png)

### Dark Mode
![Dark Mode Screenshot](./public/screenshot-dark.png)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + shadcn/ui
- **Animations**: Framer Motion
- **Theme**: next-themes
- **Icons**: Lucide React
- **Build Tool**: Turbopack (Next.js)

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/suraniharsh/bunkapp.git
   cd bunkapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run start
```

## 🎮 How to Use

1. **Enter Your Details**
   - Total number of lectures conducted
   - Number of lectures you've attended
   - Set your required attendance percentage (default: 75%)

2. **Get Instant Results**
   - See your current attendance percentage
   - Find out how many lectures you can safely bunk
   - Get warnings if you need to attend more classes

3. **Make Informed Decisions**
   - Green zone: You're safe to skip some lectures
   - Yellow zone: Be careful, you're at the threshold
   - Red zone: Attend more lectures to stay above the requirement

## 🏗️ Project Structure

```
bunkapp/
├── app/                    # Next.js App Router
│   ├── about/             # About page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── input-card.tsx    # Input form component
│   ├── navbar.tsx        # Navigation component
│   ├── result-card.tsx   # Results display component
│   └── theme-provider.tsx # Theme context
├── hooks/                # Custom React hooks
│   ├── use-local-storage.ts
│   └── use-mobile.ts
├── lib/                  # Utility functions
│   └── utils.ts
└── public/              # Static assets
```

## 🧮 Attendance Calculation Logic

The app uses the following formula to calculate how many lectures you can skip:

```typescript
// For bunking lectures while maintaining criteria
canBunk = Math.floor((attendedLectures - requiredPercentage * totalLectures) / requiredPercentage)

// For lectures needed to reach criteria  
mustAttend = Math.ceil((requiredPercentage * totalLectures - attendedLectures) / (1 - requiredPercentage))
```

## 🎨 Customization

### Adding New Themes
1. Update `tailwind.config.js` with new color variables
2. Add theme variants in `app/globals.css`
3. The theme provider will automatically handle the switching

### Modifying Calculations
Edit the calculation functions in `lib/attendance-calculations.ts` to adjust the calculation logic.

## 🧪 Testing

This project includes comprehensive unit tests for all calculation utilities to ensure accuracy and reliability.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with coverage report
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Test Coverage

Our test suite maintains ≥90% coverage for calculation utilities, covering:

- **Normal cases**: Standard attendance scenarios
- **Edge cases**: Zero lectures, perfect attendance, impossible requirements
- **Boundary conditions**: Exact thresholds, minimum/maximum values
- **Invalid inputs**: Negative numbers, impossible scenarios

### Test Structure

```
src/__tests__/
├── attendance-calculations.test.ts  # Core calculation logic tests
└── setup.ts                        # Test environment setup
```

### Coverage Requirements

- **Branches**: ≥90%
- **Functions**: ≥90% 
- **Lines**: ≥90%
- **Statements**: ≥90%

All calculation utilities in `lib/attendance-calculations.ts` maintain 100% test coverage.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Harsh Surani**
- Website: [suraniharsh.codes](https://suraniharsh.codes)
- GitHub: [@suraniharsh](https://github.com/suraniharsh)
- Email: harshsurani00@gmail.com

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Animations by [Framer Motion](https://www.framer.com/motion/)

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/suraniharsh/bunkapp?style=social)
![GitHub forks](https://img.shields.io/github/forks/suraniharsh/bunkapp?style=social)
![GitHub issues](https://img.shields.io/github/issues/suraniharsh/bunkapp)
![GitHub pull requests](https://img.shields.io/github/issues-pr/suraniharsh/bunkapp)

---

<div align="center">
  <sub>Built with ❤️ for students, by a student</sub>
</div>

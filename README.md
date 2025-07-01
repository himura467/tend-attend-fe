# Tend Attend (Frontend)

Tend Attend is an intuitive event management tool with predictive analytics capabilities. It stands out by offering features that predict attendee status using machine learning, enabling event organizers to leverage this information for effective management.

## ✨ Features

- **Event Management**: Create, edit, and attend events with calendar integration
- **Authentication**: Sign in/up system with AWS Signature V4 API authentication
- **Calendar Integration**: FullCalendar with RRULE support for recurring events
- **Responsive UI**: Modern UI built with shadcn/ui components and Tailwind CSS
- **Smart Predictions**: AI-powered attendee status prediction for better event planning

## 🛠️ Technology Stack

- **Framework**: Next.js 15.3.1 with React 19
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios with AWS Signature V4 authentication
- **Calendar**: FullCalendar with RRULE support for recurring events
- **Date Handling**: date-fns with timezone support

## 📋 Prerequisites

- **Node.js** - Version 22.15.0 (specified in `.node-version`)
- **nodenv** - Node.js version management
- **pnpm** - Package dependency management

## 🚀 Local Setup

Follow these steps to set up the project locally:

### 1. Install Node.js

Install the required Node.js version using nodenv:

```sh
nodenv install `cat .node-version`
```

### 2. Install Dependencies

Install project dependencies using pnpm:

```sh
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```sh
cp .env.example .env.local  # if .env.example exists
# or create manually:
touch .env.local
```

Add the following environment variables:

```env
BACKEND_API_URL=http://localhost:8000
```

### 4. Start Development Server

Start the Next.js development server with Hot Module Reloading:

```sh
pnpm dev
```

The application will be available at `http://localhost:3000`

## 🧪 Development

### Code Quality Tools

```sh
# ESLint check
pnpm lint:eslint

# ESLint fix
pnpm lint-fix:eslint

# Prettier check
pnpm lint:prettier

# Prettier fix
pnpm lint-fix:prettier

# Run all linting checks
pnpm ci:lint
```

### Build Scripts

```sh
# Build for production
pnpm build

# Start production server
pnpm start
```

## 📁 Project Structure

```
src/
├── app/            # Next.js App Router pages
│   ├── events/     # Event management pages
│   ├── signin/     # Authentication pages
│   └── signup/
├── components/     # Component architecture
│   ├── ui/         # Base shadcn/ui components
│   ├── organisms/  # Complex reusable components
│   └── templates/  # Layout templates
├── lib/            # Utilities and API layer
│   ├── api/        # API clients with DTOs
│   ├── types/      # TypeScript type definitions
│   └── utils/      # Utility functions
└── styles/         # Global CSS styles
```

## 🤝 Contributing

1. Follow the established code style (ESLint, Prettier)
2. Run linting and tests before submitting PRs
3. Update documentation for new features
4. Use conventional commit messages

## 📝 License

This project is licensed under the terms specified in the LICENSE file.

## 👨‍💻 Author

**himura467** - mitarashidango0927@gmail.com

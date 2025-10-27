# QuickPoll - Real-Time Polling Platform

A modern, real-time polling application built with React, TypeScript, and Supabase. Create, vote, and see live results as they come in!

## 🚀 Features

- **Real-time Updates**: See votes and likes update instantly
- **Create Polls**: Easily create new polls with multiple options
- **Vote & Like**: Cast your vote and like your favorite polls
- **Responsive Design**: Works on desktop and mobile devices
- **No Login Required**: Simple session-based voting

## 🏗️ System Design & Architecture

### Frontend Architecture
- **React** with **TypeScript** for type-safe development
- **Vite** for fast development and building
- **Shadcn UI** components with **Tailwind CSS** for styling
- **React Query** for server state management
- **React Router** for client-side routing

### Backend Architecture
- **Supabase** as the Backend-as-a-Service (BaaS)
  - **PostgreSQL** for data storage
  - **Realtime API** for live updates
  - **Row Level Security (RLS)** for data protection

### Data Flow
1. Users interact with the React frontend
2. Frontend communicates with Supabase using the JavaScript client
3. Supabase handles authentication, database operations, and realtime subscriptions
4. Database changes trigger realtime updates to all connected clients

### Database Schema
- `polls`: Stores poll information (id, title, created_at, likes_count)
- `poll_options`: Stores options for each poll (id, poll_id, option_text, votes_count)
- `votes`: Tracks user votes (id, poll_id, option_id, session_id)
- `likes`: Tracks poll likes (id, poll_id, session_id)

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ (LTS recommended)
- npm or yarn
- Supabase account (free tier available at [supabase.com](https://supabase.com))

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/quickpoll.git
   cd quickpoll
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```
   > **Note**: Never commit your `.env` file to version control.

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at [http://localhost:8080](http://localhost:8080)

5. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## 📚 Resources & APIs Used

### Core Technologies
- [React](https://reactjs.org/) - Frontend library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vite](https://vitejs.dev/) - Build tool and dev server
- [Supabase](https://supabase.com/) - Backend services

### UI Components & Styling
- [Shadcn UI](https://ui.shadcn.com/) - Reusable UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) - Beautiful icons

### Development Tools
- [React Query](https://tanstack.com/query) - Data fetching and state management
- [React Router](https://reactrouter.com/) - Client-side routing
- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io/) - Code formatting

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: Shadcn UI, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Realtime, Auth)
- **State Management**: React Query
- **Deployment**: Vercel (Frontend), Supabase (Backend)

## 🔧 Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Folder Structure

```
src/
├── components/      # Reusable UI components
├── pages/          # Page components
├── integrations/   # Third-party integrations
│   └── supabase/   # Supabase client configuration
└── App.tsx         # Main application component
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- UI Components by [Shadcn UI](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Backend powered by [Supabase](https://supabase.com/)
- State management with [React Query](https://tanstack.com/query)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).


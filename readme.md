# PawMatch - Dog Adoption Platform

PawMatch is a modern web application built with React and TypeScript that helps users find their perfect canine companion. The platform allows users to search through a database of dogs, filter by various criteria, and save their favorites.
![PawMatch Screenshot](https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=2969)

## Features

- :mag: Advanced search functionality with filters for:
  - Breed
  - Age range
  - Name
- :dart: Real-time search results
- :heart: Favorite dogs management
- :game_die: Smart matching algorithm
- :iphone: Responsive design
- :lock: User authentication
- :floppy_disk: Persistent data storage

## Tech Stack

- **Frontend Framework**: React 18
- **Type System**: TypeScript
- **State Management**: Redux Toolkit + Redux Persist
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Data Fetching**: TanStack Query (React Query)
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Build Tool**: Vite
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pawmatch.git
   cd pawmatch
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── DogCard.tsx     # Individual dog display card
│   ├── Navbar.tsx      # Navigation bar
│   ├── Pagination.tsx  # Pagination controls
│   └── SearchFilters.tsx # Search and filter controls
├── lib/                # Utilities and helpers
│   ├── api.ts         # API client and endpoints
│   └── types.ts       # TypeScript type definitions
├── pages/             # Page components
│   ├── Favorites.tsx  # Favorites page
│   ├── Login.tsx     # Login page
│   └── Search.tsx    # Main search page
├── store/             # Redux store configuration
│   ├── slices/       # Redux slices
│   └── store.ts      # Store configuration
├── App.tsx           # Root component
└── main.tsx         # Application entry point
```

## API Documentation

### Authentication

```typescript
login(name: string, email: string): Promise<void>
logout(): Promise<void>
```

### Dog Search

```typescript
searchDogs(params: {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: number;
  sort?: string;
}): Promise<SearchResponse>
```

### Dog Data

```typescript
getDogs(ids: string[]): Promise<Dog[]>
getBreeds(): Promise<string[]>
generateMatch(dogIds: string[]): Promise<string>
```

## Features Documentation

### Search Functionality

- Real-time search with debouncing
- Multiple filter options
- Sort by various criteria
- Pagination support
- Search result caching

### Favorites System

- Add/remove dogs from favorites
- Persistent storage
- Generate matches from favorites
- Clear all favorites

### Authentication System

- Email-based authentication
- Persistent sessions
- Automatic logout handling
- Protected routes

## State Management

The application uses Redux Toolkit for state management with the following slices:

- `authSlice`: Manages user authentication state
- `favoritesSlice`: Handles favorite dogs
- `searchSlice`: Manages search results and caching

## Error Handling

The application implements comprehensive error handling:

- Network error recovery with exponential backoff
- User-friendly error messages
- Automatic retry for failed requests
- Session management
- Error boundary protection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Dog images provided by the Fetch API
- Icons by Lucide React
- UI components inspired by Tailwind CSS

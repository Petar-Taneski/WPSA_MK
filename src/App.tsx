import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { NewsProvider } from "./contexts/NewsContext";
import DashboardPost from "./components/Dashboard/Post";
import Navigation from "./components/Navigation";

// Lazy load page components
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const News = lazy(() => import("./pages/News"));
const Events = lazy(() => import("./pages/Events"));
const Post = lazy(() => import("./pages/Post"));

// Wrap components with providers as needed
const NewsWithProvider = () => (
  <NewsProvider>
    <News />
  </NewsProvider>
);

const PostWithProvider = () => (
  <NewsProvider>
    <Post />
  </NewsProvider>
);

function App() {
  // Flag for features that are currently disabled
  const unusedFeatures = false;

  return (
    <BrowserRouter>
      <div className="app">
        <Suspense fallback={<div>Loading...</div>}>
          <Navigation />
          <div className="relative">
            <Routes>
              {/* Default redirect to home */}
              <Route path="/" element={<Navigate to="/home" replace />} />

              {/* Main routes */}
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/news" element={<NewsWithProvider />} />
              <Route path="/news/:id" element={<PostWithProvider />} />
              <Route path="/events" element={<Events />} />

              {/* Conditionally show dashboard */}
              {unusedFeatures && (
                <Route path="/dashboard/post" element={<DashboardPost />} />
              )}

              {/* Fallback for invalid routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;

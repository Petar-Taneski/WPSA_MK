import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./App.css";
import Navigation from "./components/Navigation";

// Lazy load pages for performance
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const News = lazy(() => import("./pages/News"));
const Events = lazy(() => import("./pages/Events"));

function App() {
  const { t, i18n } = useTranslation();

  // Get page paths for both languages
  const paths = {
    en: {
      home: t("pages.home", { lng: "en" }),
      about: t("pages.about", { lng: "en" }),
      news: t("pages.news", { lng: "en" }),
      events: t("pages.events", { lng: "en" }),
    },
    mk: {
      home: t("pages.home", { lng: "mk" }),
      about: t("pages.about", { lng: "mk" }),
      news: t("pages.news", { lng: "mk" }),
      events: t("pages.events", { lng: "mk" }),
    },
  };

  return (
    <BrowserRouter>
      <div className="app">
        <Suspense fallback={<div>Loading...</div>}>
          <Navigation />
          <div className="container mx-auto p-4">
            <Routes>
              {/* Default redirect to user's language */}
              <Route
                path="/"
                element={
                  <Navigate
                    to={`/${i18n.language}/${
                      paths[i18n.language as keyof typeof paths].home
                    }`}
                    replace
                  />
                }
              />

              {/* English routes */}
              <Route
                path="/en"
                element={<Navigate to={`/en/${paths.en.home}`} replace />}
              />
              <Route path={`/en/${paths.en.home}`} element={<Home />} />
              <Route path={`/en/${paths.en.about}`} element={<About />} />
              <Route path={`/en/${paths.en.news}`} element={<News />} />
              <Route path={`/en/${paths.en.events}`} element={<Events />} />

              {/* Macedonian routes */}
              <Route
                path="/mk"
                element={<Navigate to={`/mk/${paths.mk.home}`} replace />}
              />
              <Route path={`/mk/${paths.mk.home}`} element={<Home />} />
              <Route path={`/mk/${paths.mk.about}`} element={<About />} />
              <Route path={`/mk/${paths.mk.news}`} element={<News />} />
              <Route path={`/mk/${paths.mk.events}`} element={<Events />} />

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

import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Navigation from "./components/headers/Navigation";
import MobileHeader from "./components/headers/mobileHeader/MobileHeader";
import { NewsProvider } from "./contexts/NewsContext";
import DashboardPost from "./components/dashboardd/Post";
import Footer from "./components/footer/Footer";
import ContactForm from "./components/ContactForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoinUs from "./components/joinUs/JoinUs";
import FloatingButton from "./components/joinUs/FloatingButton";
import LoadingState from "./components/news/LoadingState";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const News = lazy(() => import("./pages/News"));
const Events = lazy(() => import("./pages/Events"));
const Post = lazy(() => import("./pages/Post"));

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
  const { t, i18n } = useTranslation();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isJoinUsModalOpen, setIsJoinUsModalOpen] = useState(false);

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);
  const openJoinUsModal = () => setIsJoinUsModalOpen(true);
  const closeJoinUsModal = () => setIsJoinUsModalOpen(false);

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

  const unusedFeatures = false;
  return (
    <BrowserRouter>
      <div className="app overflow-x-clip">
        <ToastContainer position="top-right" autoClose={5000} />
        <Suspense fallback={<LoadingState />}>
          <div className="hidden lg:block h-[13vh]">
            <Navigation openContactModal={openContactModal} />
          </div>
          <div className={`block lg:hidden h-[15vh]`}>
            <MobileHeader openContactModal={openContactModal} />
          </div>
          <div className="relative">
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
              <Route
                path={`/en/${paths.en.news}`}
                element={<NewsWithProvider />}
              />
              <Route path={`/en/news/:id`} element={<PostWithProvider />} />
              <Route path={`/en/${paths.en.events}`} element={<Events />} />
              {unusedFeatures && (
                <Route path="/en/dashboard/post" element={<DashboardPost />} />
              )}
              {/* Macedonian routes */}
              <Route
                path="/mk"
                element={<Navigate to={`/mk/${paths.mk.home}`} replace />}
              />
              <Route path={`/mk/${paths.mk.home}`} element={<Home />} />
              <Route path={`/mk/${paths.mk.about}`} element={<About />} />
              <Route
                path={`/mk/${paths.mk.news}`}
                element={<NewsWithProvider />}
              />
              <Route path={`/mk/вести/:id`} element={<PostWithProvider />} />
              <Route path={`/mk/${paths.mk.events}`} element={<Events />} />
              {unusedFeatures && (
                <Route path="/mk/dashboard/post" element={<DashboardPost />} />
              )}

              {/* Fallback for invalid routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <div className=" h-[13vh] max-md:hidden">
            <Footer />
          </div>

          <ContactForm
            isOpen={isContactModalOpen}
            onClose={closeContactModal}
          />
          <JoinUs isOpen={isJoinUsModalOpen} onClose={closeJoinUsModal} />
          <FloatingButton onClick={openJoinUsModal} />
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;

import React, { lazy } from "react";
import { Route } from "react-router-dom";
import {
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import Layout from "@/components/Layout";
import SuspensedView from "@/components/SuspensedView";
import ErrorFallback from "@/components/ErrorFallback";

import ChatPage from "@/pages/ChatPage";
import NewChatPage from "@/pages/NewChatPage";

const HomePage = lazy(() => import("@/pages/HomePage"));
const NotFoundPage = lazy(() => import("@/pages/404Page"));
const ProfilePage = lazy(() => import("@/pages/user/ProfilePage"));
const CharactersPage = lazy(() => import("@/pages/CharactersPage"));
const CreateImagePage = lazy(() => import("@/pages/image/CreateImagePage"));
const CreateDesignPage = lazy(() => import("@/pages/image/CreateDesignPage"));
const ImageHistoryPage = lazy(() => import("@/pages/image/ImageHistoryPage"));
const CreateVideoPage = lazy(() => import("@/pages/video/CreateVideoPage"));
const VideoPage = lazy(() => import("@/pages/video/VideoPage"));
const VideoHistoryPage = lazy(() => import("@/pages/video/VideoHistoryPage"));
const ImagePage = lazy(() => import("@/pages/image/ImagePage"));

const getSuspensedElement = (Page) => (
  <SuspensedView>
    <Page />
  </SuspensedView>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<Layout />}
      errorElement={
        <ErrorFallback
          error={{ message: "خطایی در بارگذاری صفحه رخ داد" }}
          resetErrorBoundary={() => (window.location.href = "/")}
        />
      }
    >
      <Route index element={getSuspensedElement(HomePage)} />
      <Route path="characters" element={getSuspensedElement(CharactersPage)} />
      <Route path="image" element={getSuspensedElement(ImagePage)} />
      <Route path="image-generate" element={getSuspensedElement(CreateImagePage)} />
      <Route path="design-generate" element={getSuspensedElement(CreateDesignPage)} />
      <Route path="image/history" element={getSuspensedElement(ImageHistoryPage)} />
      <Route path="video" element={getSuspensedElement(VideoPage)} />
      <Route path="video-generate" element={getSuspensedElement(CreateVideoPage)} />
      <Route path="video/history" element={getSuspensedElement(VideoHistoryPage)} />
      <Route path="profile" element={getSuspensedElement(ProfilePage)} />
      <Route path="chat/new" element={getSuspensedElement(NewChatPage)} />
      <Route path="chat/:id" element={getSuspensedElement(ChatPage)} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

export default router;

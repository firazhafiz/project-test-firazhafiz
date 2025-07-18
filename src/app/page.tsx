export const dynamic = "force-dynamic";
import Header from "./components/Header";
import Banner from "./components/Banner";
import PostList from "./components/PostList";
import Upload from "./components/Upload";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <div className="relative min-h-screen bg-gray-100">
        <Header />
        <Banner />
        <Suspense fallback={<div>Loading posts...</div>}>
          <PostList />
        </Suspense>
      </div>
      <Upload />
    </>
  );
}

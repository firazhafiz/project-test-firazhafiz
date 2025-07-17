import Header from "./components/Header";
import Banner from "./components/Banner";
import PostList from "./components/PostList";
import Upload from "./components/Upload";

export default function Home() {
  return (
    <>
      <div className="relative min-h-screen bg-gray-100">
        <Header />
        <Banner />
        <PostList />
      </div>
      <Upload />
    </>
  );
}

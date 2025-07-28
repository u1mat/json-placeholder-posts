import { useEffect, useState } from "react";


function App() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        setIsError(false)
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/posts?_limit=12`
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setPosts(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsError(true);
        return;
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <>
      {isLoading && <p>Loading...</p>}

      {isError && <p>Error loading posts</p>}

      {!isLoading && !isError && <ul>
        {posts.map((item: any) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>}
    </>
  );
}

export default App;

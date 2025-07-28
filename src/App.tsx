import { useEffect, useRef, useState } from "react";


function App() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);

  const abortController = useRef<AbortController | null>(null);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        abortController.current?.abort();
        abortController.current = new AbortController();
        setIsError(false)
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/posts?_limit=12&_page=${page}`, {
            signal: abortController.current.signal,
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setPosts(data);
        setIsLoading(false);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        if (error.name === 'AbortError') {
          console.log("Fetch aborted");
          return;
        }
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [page]);

  return (
    <>
      <button onClick={() => setPage(page + 1)}>Next page</button>

      {isLoading && <p>Loading...</p>}

      {isError && <p>Error loading posts</p>}

      {!isLoading && !isError && posts.length > 0 && <ul>
        {posts.map((item: any) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>}
    </>
  );
}

export default App;

import './App.css';
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';

type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const Posts = () =>
{
  const queryClient = useQueryClient();

  // GET
  const getPosts = async () =>
  {
    const res = await axios.get('https://jsonplaceholder.typicode.com/posts');
    return res.data;
  }

  // POST
  const addPosts = async () =>
  {
    const res = await axios.post('https://jsonplaceholder.typicode.com/posts', {
      title: 'foo',
      body: 'bar',
      userId: 1,
    });
    alert(JSON.stringify(res.data, undefined, 4));
  };

  // Queries
  const query = useQuery<Post[], Error>('posts', getPosts);

  // Mutations
  const mutation = useMutation(addPosts, {
    onSuccess: () =>
    {
      // `posts`キーのクエリを無効化して再取得
      queryClient.invalidateQueries('posts');
    },
  });

  return (
    <div>
      <div className='container'>
        <button className='button' onClick={() => mutation.mutate()}>
          Add Post
        </button>
        {query.isLoading || mutation.isLoading ? (
          <div className='loader' />
        ) : (
          query.data?.map((post) => (
            <div className='card' key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

function App()
{
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Posts />
    </QueryClientProvider>
  )
}

export default App;

import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8081/api/posts")
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Tin tức mới nhất</h3>
      <div className="row">
        {posts.map(post => (
          <div className="col-md-4 mb-4" key={post.id}>
            <div className="card h-100">
              <img src={`/assets/Logo/${post.image}`} className="card-img-top" alt={post.title} />
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <Link to={`/tin-tuc/${post.id}`} className="btn btn-sm btn-outline-success">Xem chi tiết</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;

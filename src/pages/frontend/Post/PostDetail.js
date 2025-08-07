import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8081/api/posts/${id}`)
      .then(res => setPost(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!post) return <p className="text-center my-5">Đang tải bài viết...</p>;

  return (
    <div className="container my-4">
      <button
        onClick={() => navigate(-1)}
        className="btn btn-outline-secondary mb-4"
      >
        ← Quay lại
      </button>

      <div className="row">
        <div className="col-md-6">
          <img
            src={`/assets/Logo/${post.image}`}
            alt={post.title}
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-6">
          <h2 className="mb-3">{post.title}</h2>
          {post.description && <p className="text-muted">{post.description}</p>}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;

export default function PostCard({ post }) {
  const { title, description, author } = post;

  return (
    <div className='bg-amber-300 '>
      {/* Tile */}
      <p>{title}</p>

      {/* Description */}
      <p>{description}</p>

      {/* Control */}
      <p className='flex justify-between'>
        {/* Author */}
        <span>{author}</span>
        <button>Delete</button>
      </p>
    </div>
  );
}

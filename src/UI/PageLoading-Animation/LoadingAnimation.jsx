import "./LoadingAnimation.css";

function LoadingAnimation() {
  return (
    <div className='Loading-container'>
      <div className='main'>
        <div className='ring'></div>
        <div className='ring'></div>
        <div className='ring'></div>
        <span className='loading'>Loading...</span>
      </div>
    </div>
  );
}

export default LoadingAnimation;

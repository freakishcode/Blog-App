import "./skeleton.css";

function Skeleton() {
  return (
    <div className='skeleton'>
      {/* title */}
      <div className='skeleton_title' />
      {/* records of user */}
      <div className='skeleton_records' />

      {/* add btn */}
      <div className='skeleton_add' />

      {/* search bar */}
      <div className='skeleton_searchBar' />

      {/* sub title */}
      <div className='skeleton_sub_title' />

      {/* search data */}
      <div className='skeleton_text_header' />
      <div className='skeleton_text' />
      <div className='skeleton_text' />
      <div className='skeleton_text' />
      <div className='skeleton_text' />
      <div className='skeleton_text' />
    </div>
  );
}

export default Skeleton;

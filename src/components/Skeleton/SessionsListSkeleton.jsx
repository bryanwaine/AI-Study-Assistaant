import "./Skeleton.css";

const SessionsListSkeleton = () => {
  const renderSkeletonList = () => {
    let list = [];
    for (let i = 0; i < 10; i++) {
      list.push(
        <li className="skeleton__list-item">
          <div className="skeleton " />
          <div className="skeleton__div ">
            <div className="skeleton " />
            <div className="skeleton " />
          </div>
        </li>
      );
    }
    return list;
  };
  return (
    <ul className="skeleton__list sessions__list">{renderSkeletonList()}</ul>
  );
};

export default SessionsListSkeleton;

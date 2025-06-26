import "./Skeleton.css";

const SessionsListSkeleton = () => {
  const renderSkeletonList = () => {
    let list = [];
    for (let i = 0; i < 10; i++) {
      list.push(
        <li key={i} className="skeleton__list-item bg-gray-900/10 dark:bg-gray-100/10">
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

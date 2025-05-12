import "./Skeleton.css";

const SessionsListSkeleton = () => {
  return (
    <ul className="skeleton_list sessions__list">
      <li className="skeleton skeleton__list-item" />
      <li className="skeleton skeleton__list-item" />
      <li className="skeleton skeleton__list-item" />
      <li className="skeleton skeleton__list-item" />
      <li className="skeleton skeleton__list-item" />
    </ul>
  );
};

export default SessionsListSkeleton;

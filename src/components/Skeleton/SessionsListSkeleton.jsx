import useStaggeredAnimation from "../../hooks/useStaggeredAnimation";
import "./Skeleton.css";

const SessionsListSkeleton = () => {
   useStaggeredAnimation({
    selector: ".animate-slide",
    animationClass: "slide-up",
    threshold: 0.2,
    staggerDelay: 50,
   })
  
  const renderSkeletonList = () => {
    let list = [];
    for (let i = 0; i < 10; i++) {
      list.push(
        <li key={i} className="animate-slide skeleton__list-item bg-gray-900/10 dark:bg-gray-100/10">
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

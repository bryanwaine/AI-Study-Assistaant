import './Skeleton.css'

const DashboardOverviewSkeleton = () => {
  return (
    <div className="dashboard-card__overview">
      <div className="skeleton__card dashboard-card__item rounded-xl bg-neutral-100 dark:bg-gray-900/10 backdrop-blur shadow-md border border-neutral-200 dark:border-none">
        <span className="skeleton skeleton__card-label dashboard-card__item-label" />
        <span className="skeleton skeleton__card-value dashboard-card__item-value" />
      </div>
      <div className="skeleton__card dashboard-card__item rounded-xl bg-neutral-100 dark:bg-gray-900/10 backdrop-blur shadow-md border border-neutral-200 dark:border-none">
        <span className="skeleton skeleton__card-label dashboard-card__item-label" />
        <span className="skeleton skeleton__card-value dashboard-card__item-value" />
      </div>
      <div className="skeleton__card dashboard-card__item rounded-xl bg-neutral-100 dark:bg-gray-900/10 backdrop-blur shadow-md border border-neutral-200 dark:border-none">
        <span className="skeleton skeleton__card-label dashboard-card__item-label" />
        <span className="skeleton skeleton__card-value dashboard-card__item-value" />
      </div>
      <div className="skeleton__card dashboard-card__item rounded-xl bg-neutral-100 dark:bg-gray-900/10 backdrop-blur shadow-md border border-neutral-200 dark:border-none">
        <span className="skeleton skeleton__card-label dashboard-card__item-label" />
        <span className="skeleton skeleton__card-value dashboard-card__item-value" />
      </div>
    </div>
  );
};

export default DashboardOverviewSkeleton;

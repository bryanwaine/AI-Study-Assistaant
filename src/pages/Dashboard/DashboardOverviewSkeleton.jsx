import Button from "../../components/Button/Button";

const DashboardOverviewSkeleton = () => {
  return (
    <div className="dashboard-card__overview">
      <div className="skeleton__card dashboard-card__item card--white">
        <span className="skeleton skeleton__card-label dashboard-card__item-label" />
        <span className="skeleton skeleton__card-value dashboard-card__item-value" />
      </div>
      <div className="skeleton__card dashboard-card__item card--white">
        <span className="skeleton skeleton__card-label dashboard-card__item-label" />
        <span className="skeleton skeleton__card-value dashboard-card__item-value" />
      </div>
      <div className="skeleton__card dashboard-card__item card--white">
        <span className="skeleton skeleton__card-label dashboard-card__item-label" />
        <span className="skeleton skeleton__card-value dashboard-card__item-value" />
      </div>
      <div className="skeleton__card dashboard-card__item card--white">
        <span className="skeleton skeleton__card-label dashboard-card__item-label" />
        <span className="skeleton skeleton__card-value dashboard-card__item-value" />
      </div>
    </div>
  );
};

export default DashboardOverviewSkeleton;

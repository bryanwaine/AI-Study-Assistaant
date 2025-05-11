import Button from "../../components/Button/Button";

const DashboardOverviewSkeleton = () => {
  return (
    <section className="dashboard-card card--blue">
      <h2 className="skeleton skeleton__title dashboard-card__greeting" />
      <p className="skeleton skeleton__message dashboard-card__message" />
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
      <Button variant="orange">
        <span className="skeleton skeleton__button btn--link" />
      </Button>
    </section>
  );
};

export default DashboardOverviewSkeleton;



const DashboardQuicklinksSkeleton = () => {
  return (
    <section className="dashboard-card card--blue">
      <h2 className="skeleton skeleton__title"/>
      <div className="dashboard__quicklinks">
        <div className="skeleton skeleton__link link dashboard__quicklink"/>
        <div className="skeleton skeleton__link link dashboard__quicklink"/>
        <div className="skeleton skeleton__link link dashboard__quicklink"/>
        <div className="skeleton skeleton__link link dashboard__quicklink"/>
      </div>
    </section>
  );
};

export default DashboardQuicklinksSkeleton;

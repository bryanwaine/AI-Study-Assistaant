const sortSessionsByTime = (sessions) => {
  return sessions.sort((a, b) => {
    const aTimestamp = new Date(a.metadata.updatedAt.toDate());
    const bTimestamp = new Date(b.metadata.updatedAt.toDate());
    return bTimestamp - aTimestamp;
  });
};

export default sortSessionsByTime;

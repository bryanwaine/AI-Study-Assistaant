const sortDataByTime = (data) => {
  return data.sort((a, b) => {
    const aTimestamp = new Date(a.metadata.createdAt.toDate());
    const bTimestamp = new Date(b.metadata.createdAt.toDate());
    return bTimestamp - aTimestamp;
  });
};

export default sortDataByTime;

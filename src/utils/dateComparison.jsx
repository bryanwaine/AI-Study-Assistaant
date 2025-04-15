const dateComparison = (date) => {
    const newDate = new Date(date).toDateString();
    const now = new Date().toDateString();

    if (newDate === now) {
        return "Welcome"
    }  else {
        return "Welcome back"
    }
}

export default dateComparison
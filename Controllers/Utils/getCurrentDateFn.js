const getCurrentDate = () => {
  try {
    const today = new Date();
    return today;
  } catch (err) {
    console.log(err.message);
    throw new Error("Failed to retrieve current date.");
  }
};

module.exports = getCurrentDate;

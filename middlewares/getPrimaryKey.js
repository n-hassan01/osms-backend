const pool = require("../dbConnection");

const getPrimaryKey = async (req, res, next) => {
  const { getPrimaryKey, tableName } = req.body;

  try {
    const pk = await pool.query("SELECT public.fn_new_seq_id($1, $2);", [
      getPrimaryKey,
      tableName,
    ]);
    req.serializedId = pk;

    next();
  } catch (err) {
    console.log(err.message);

    next({ message: "Authorization failed!" });
  }
};

module.exports = getPrimaryKey;

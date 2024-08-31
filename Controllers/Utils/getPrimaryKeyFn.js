const pool = require("../../dbConnection");

const getPrimaryKey = async (getPrimaryKey, tableName) => {
  try {
    const pk = await pool.query("SELECT public.fn_new_seq_id($1, $2);", [
      getPrimaryKey,
      tableName,
    ]);

    // Assuming `pk` is an array of rows returned by the query,
    // you'll likely need to extract the actual value.
    return pk.rows[0].fn_new_seq_id;
  } catch (err) {
    console.log(err.message);
    throw new Error("Failed to retrieve primary key.");
  }
};

module.exports = getPrimaryKey;

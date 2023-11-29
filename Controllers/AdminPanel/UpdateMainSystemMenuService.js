const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.put("/:system_menu_id", async (req, res, next) => {
  const systemMenuId = req.params.system_menu_id;
  const {
    systemMenuDescription,
    menuActive,
    iconPath
  } = req.body;

  await pool.query(
    "UPDATE main_system_menu SET system_menu_description = $1,menu_active = $2,icon_path=$3 WHERE system_menu_id =$4 ",
    [
        systemMenuDescription,
        menuActive,
        iconPath,
        systemMenuId
    ],
    (error, result) => {
      try {
        if (error) throw error;

        res
          .status(200)
          .json(`Location modified with Location_Id: ${systemMenuId}`);
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;

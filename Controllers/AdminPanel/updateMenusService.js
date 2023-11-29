const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.put("/:menu_id", async (req, res, next) => {
  const menuId = req.params.menu_id;
  const {
    menuDescription,
    menuActive,
    
  } = req.body;

  await pool.query(
    "UPDATE menus SET menu_description = $1,menu_active = $2 WHERE menu_id =$3 ",
    [
        menuDescription,
        menuActive,
        
        menuId
    ],
    (error, result) => {
      try {
        if (error) throw error;

        res
          .status(200)
          .json(`Location modified with Menus_Id: ${menuId}`);
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;

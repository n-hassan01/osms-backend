const express = require("express");
const pool = require("../../dbConnection");
const router = express.Router();

router.put("/:sub_menu_id", async (req, res, next) => {
  const subMenuId = req.params.sub_menu_id;
  const {
    subMenuDescription,
    subMenuAction,
    subMenuActive,
    subMenuType,
    slno
   
    
  } = req.body;

  await pool.query(
    "UPDATE sub_menu SET sub_menu_description = $1,sub_menu_action = $2,sub_menu_active=$3,sub_menu_type=$4,slno=$5 WHERE sub_menu_id =$6 ",
    [
        subMenuDescription,
        subMenuAction,
        subMenuActive,
        subMenuType,
        slno,
        subMenuId

    ],
    (error, result) => {
      try {
        if (error) throw error;

        res
          .status(200)
          .json(`Location modified with Sub_Menu_Id: ${subMenuId}`);
      } catch (err) {
        next(err);
      }
    }
  );
});

module.exports = router;

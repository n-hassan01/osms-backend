const express = require("express");
const pool = require("../dbConnection");

const router = express.Router();

router.get("/:user_name", async (req, res, next) => {
  try {
    const userName = req.params.user_name;

    const result1 = await pool.query(
      "SELECT user_id FROM fnd_user WHERE user_name = $1",
      [userName]
    );
    const userId = result1.rows[0]?.user_id;

    if (userId) {
      const result2 = await pool.query(
        "SELECT menu_id FROM user_menu_assignment WHERE user_id = $1",
        [userId]
      );
      const menuIds = result2.rows.map((row) => row.menu_id);

      if (menuIds.length > 0) {
        const response = [];

        for (const menuId of menuIds) {
          const result3 = await pool.query(
            "SELECT sub_menu_id, sub_menu_description, sub_menu_action FROM sub_menu WHERE menu_id = $1",
            [menuId]
          );

          const subMenus = result3.rows;

          subMenus.forEach((menu) => {
            const assignedMenu = {
              title: menu.sub_menu_description,
              path: menu.sub_menu_action,
            };
            response.push(assignedMenu);
          });
        }

        console.log("response", response);
        res.status(200).send(response);
      } else {
        res.status(200).send([]); // If no menuIds are found, send an empty array
      }
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;

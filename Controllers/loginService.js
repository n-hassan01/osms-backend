const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../dbConnection');

const router = express.Router();

router.post('/', (req, res, next) => {
    pool.query(
        'SELECT * FROM \"user\" as u full join employee as e ON u.id=e.id WHERE u.id=$1',
        [req.body.id],
        async (error, result) => {
            try {
                if (error) throw error;
                
                const status = result.rows[0].status;
                if (result.rowCount > 0 && status === 'approved') {
                    const isValidPassword = await bcrypt.compare(
                        req.body.password,
                        result.rows[0].password,
                    );
                    if (isValidPassword) {
                        const token = jwt.sign(
                            {
                                id: result.rows[0].id,
                                role: result.rows[0].role,
                            },
                            process.env.SECRET_KEY,
                            {
                                expiresIn: '1d',
                            },
                        );

                        res.status(200).json({
                            value: token,
                            message: 'Login successful',
                        });
                    } else {
                        next({ message: 'Authentication failed!'});
                    }
                } else {
                    next({ message: 'Sorry! You are not authorized'});
                }
            } catch (err) {
                console.log(err.message);

                next({ message: 'Authentication failed!'});
            }
        },
    );
});

module.exports = router;

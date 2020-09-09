const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');

router.get('/', (req, res, next) => {

});

router.post('/', (req, res, next) => {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const avatar = 'req.body.avatar';

    mysql.getConnection((error, conn) => {
        if (error) { console.error(error); res.status(500).send({ error: error }) }

        conn.query('SELECT * FROM users WHERE email =  ?',[email],(error, results)=>{
            if (error) { console.error(error); res.status(500).send({ error: error }) }
            if(results.length  >0){
                res.status(409).send({mensagem:"Usuario ja Cadastrado" })
            }else{
                bcrypt.hash(password, 10, (errBcrypt, hash) => {
                    if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
                    conn.query(
                        'INSERT INTO users (email,name,password, avatar) VALUES (?, ?,?,?)',
                        [email, name, hash, avatar],
                        (error, result, field) => {
                            conn.release();
                            if (error) {
                                return res.status(500).send({
                                    error: error,
                                    response: null
                                })
                            }
                            res.status(201).send({
                                mensagem: "usuario criado",
                                usuarioId: result.insertId,
                            });
                        });
                });
            }
        });
       

    });

});


module.exports = router;
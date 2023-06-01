const express = require("express");
const mysql = require("mysql");
const bodyparser = require("body-parser");

//config express server
const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

/**
 * database config
 */
const mysqlConnection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "user_auth",
  multipleStatements: true,
});

/**
 * connection check
 */
mysqlConnection.connect((err) => {
  if (!err) {
    console.log("CONNECTION ESTABLISHED SECCESSFULLY");
  } else {
    console.log("CONNECTION FAILED!" + JSON.stringify(err, undefined, 2));
  }
});

/**
 * to get all user
 */
app.get("/", (req, res) => {
  mysqlConnection.query("SELECT * FROM USER", (err, row, fields) => {
    if (!err) {
      //   console.log(row);
      // console.log(fields)
      res.send(row);
    } else {
      res.send(err);
    }
  });
});

/**
 * to get user by id
 */
app.get("/user/:id", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM USER WHERE ID = ?",
    [req.params.id],
    (row, res, fields) => {
      if (!err) {
        res.send(row);
      } else {
        console.log(err);
      }
    }
  );
});

/**
 * update the data
 *
 */
app.put("/user/update/:id", (req, res) => {
  mysqlConnection.query(
    "UPDATE USER SET NAME=?,EMAIL=?,PHONE=? WHERE ID=?",
    [req.body.name, req.body.email, req.body.phone, req.params.id],
    (err, rs) => {
      if (!err) {
        res.send({
          message: `user with id ${req.params.id} has been updated`,
          result: rs,
        });
      } else {
        res.send({ "error-message": err });
      }
    }
  );
});

/**
 * delete user
 */
app.delete("/user/delete/:id", (req, res) => {
  mysqlConnection.query(
    "DELETE FROM USER WHERE ID = ?",
    [req.params.id],
    (err, rs) => {
      if (!err) {
        res.send({
          message: `user with id ${req.params.id} deleted`,
          result: rs,
        });
      } else {
        console.log(err);
      }
    }
  );
});

/**
 * post request to insert data into table
 */
app.post("/user/insert", (req, res) => {
  //   let id = req.body.id;
  let name = req.body.name;
  let email = req.body.email;
  let phone = req.body.phone;
  mysqlConnection.query(
    "INSERT INTO USER VALUES(null,?,?,?)",
    [name, email, phone],
    (err, rs, fields) => {
      if (!err) {
        res.send({ message: "inserted", row: rs.affectedRows, result: rs });
        console.log(`${rs.affectedRows} row has been insertd.`);
      } else {
        console.log(err);
      }
    }
  );
});

/**
 * server listening
 */
app.listen(3000, () => {
  console.log(`server is serving at port 3000`);
});

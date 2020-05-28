const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!(email && name && password)) {
    return res.status(400).json("Incorrect form submission");
  }
  const hash = bcrypt.hashSync(password);

  db.transaction((trx) => {
    db("login")
      .transacting(trx)
      .insert({
        hash,
        email,
      })
      .returning("email")
      .then((loginEmail) => {
        db("users")
          .insert({
            email: loginEmail[0],
            name,
            joined: new Date(),
          })
          .returning("*")
          .then((user) => res.json(user[0]));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  })
    .then((response) => console.log("Transaction complete"))
    .catch((err) => res.status(400).json("Unable to register"));
};

module.exports = {
  handleRegister: handleRegister,
};

const app = require('express')();

app.get('/', (req, res) => {
    res.json({ message: "DOCKER LERN" })
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`SERVER WAS START on port: ${port}`));
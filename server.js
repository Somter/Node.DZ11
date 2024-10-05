var express = require('express');
var app = express();
var port = 8080;
var mssql = require('mssql');

var config = {
    user: 'admin',
    password: 'admin',
    server: 'LAPTOP-PL7SGEB9\\SQLEXPRESS',
    database: 'Library',
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: true
    },
}

app.get('/authors', function (req, res) {

    var connection = new mssql.ConnectionPool(config);

    connection.connect(function (err) {

        var request = new mssql.Request(connection);
        request.query('SELECT * FROM Authors', function (err, data) {
            if (err) {
                console.log(err);
                return;
            }
            else {

                var html = `
                <html>
                    <head>
                        <style>
                            table {
                                width: 100%;
                                border-collapse: collapse;
                            }
                            table, th, td {
                                border: 1px solid black;
                            }
                            th, td {
                                padding: 8px;
                                text-align: left;
                            }
                            th {
                                background-color: #f2f2f2;
                            }
                        </style>
                    </head>
                    <body>
                        <h2>Authors List</h2>
                        <table>
                            <tr>
                                <th>Id</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                            </tr>
            `;

                var allauthors = data.recordset;

                for (var i = 0; i < allauthors.length; i++) {
                    html += `
                    <tr>
                        <td>${allauthors[i].Id}</td>
                        <td>${allauthors[i].FirstName}</td>
                        <td>${allauthors[i].LastName}</td>
                    </tr>
                `;
                }

                html += `
                        </table>
                    </body>
                </html>`;

                console.log(data.recordset);
                res.send(html);
            }
        });
    })
});

app.get('/books/:FirstName/:LastName', function (req, res) {
    var authorFirstName = req.params.FirstName;
    var authorLastName = req.params.LastName;

    var connection = new mssql.ConnectionPool(config);

    connection.connect(function (err) {
        if (err) {
            console.log(err);
            res.status(500).send("Connection error");
            return;
        }

        var request = new mssql.Request(connection);
        var query = `
            SELECT Books.Name AS Title, Books.YearPress AS PublishedYear
            FROM Books
            JOIN Authors ON Books.Id_Author = Authors.Id
            WHERE Authors.FirstName = @FirstName AND Authors.LastName = @LastName
        `;


        request.input('FirstName', mssql.VarChar, authorFirstName);
        request.input('LastName', mssql.VarChar, authorLastName);

        request.query(query, function (err, data) {
            if (err) {
                console.log(err);
                res.status(500).send("Query error");
                return;
            }

            var html = `
            <html>
                <head>
                    <style>
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        table, th, td {
                            border: 1px solid black;
                        }
                        th, td {
                            padding: 8px;
                            text-align: left;
                        }
                        th {
                            background-color: #f2f2f2;
                        }
                    </style>
                </head>
                <body>
                    <h2>Books by ${authorFirstName} ${authorLastName}</h2>
                    <table>
                        <tr>
                            <th>Title</th>
                            <th>Published Year</th>
                        </tr>
            `;

            var books = data.recordset;

            for (var i = 0; i < books.length; i++) {
                html += `
                    <tr>
                        <td>${books[i].Title}</td>
                        <td>${books[i].PublishedYear}</td>
                    </tr>
                `;
            }

            html += `
                    </table>
                </body>
            </html>`;

            res.send(html);
        });
    });
});

app.get('/books/:Press', function (req, res) {
    var NamePress = req.params.Press;

    var connection = new mssql.ConnectionPool(config);

    connection.connect(function (err) {

        var request = new mssql.Request(connection);
        var query = `
                SELECT Books.Name AS Title, Books.YearPress AS PublishedYear
                FROM Books
                JOIN Press ON Books.Id_Press = Press.Id
                WHERE Press.Name = @Press 
        `;

        request.input('Press', mssql.VarChar, NamePress);

        request.query(query, function (err, data) {
            if (err) {
                console.log(err);
                res.status(500).send("Query error");
                return;
            }

            var html = `
            <html>
                <head>
                    <style>
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        table, th, td {
                            border: 1px solid black;
                        }
                        th, td {
                            padding: 8px;
                            text-align: left;
                        }
                        th {
                            background-color: #f2f2f2;
                        }
                    </style>
                </head>
                <body>
                    <h2>Books by ${NamePress} </h2>
                    <table>
                        <tr>
                            <th>Title</th>
                            <th>Published Year</th>
                        </tr>
            `;

            var books = data.recordset;

            for (var i = 0; i < books.length; i++) {
                html += `
                    <tr>
                        <td>${books[i].Title}</td>
                        <td>${books[i].PublishedYear}</td>
                    </tr>
                `;
            }

            html += `
                    </table>
                </body>
            </html>`;

            res.send(html);
        });
    });

});

app.get('/students', function (req, res) {

    var connection = new mssql.ConnectionPool(config);

    connection.connect(function (err) {

        var request = new mssql.Request(connection);
        request.query('SELECT * FROM Students', function (err, data) {
            if (err) {
                console.log(err);
                return;
            }
            else {

                var html = `
                <html>
                    <head>
                        <style>
                            table {
                                width: 100%;
                                border-collapse: collapse;
                            }
                            table, th, td {
                                border: 1px solid black;
                            }
                            th, td {
                                padding: 8px;
                                text-align: left;
                            }
                            th {
                                background-color: #f2f2f2;
                            }
                        </style>
                    </head>
                    <body>
                        <h2>Teachers List</h2>
                        <table>
                            <tr>
                                <th>Id</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Term</th>
                            </tr>
            `;

                var allstudents = data.recordset;

                for (var i = 0; i < allstudents.length; i++) {
                    html += `
                    <tr>
                        <td>${allstudents[i].Id}</td>
                        <td>${allstudents[i].FirstName}</td>
                        <td>${allstudents[i].LastName}</td>
                        <td>${allstudents[i].Term}</td> 
                    </tr>
                `;
                }

                html += `
                        </table>
                    </body>
                </html>`;

                console.log(data.recordset);
                res.send(html);
            }
        });
    })
});

app.get('/students/:Group', function (req, res) {
    var NameGroup = req.params.Group;

    var connection = new mssql.ConnectionPool(config);

    connection.connect(function (err) {
        if (err) {
            console.log("Connection error: ", err);
            res.status(500).send("Connection error");
            return;
        }
    
        var request = new mssql.Request(connection);
        var query = `
            SELECT Students.FirstName AS [First Name], Students.LastName AS [Last Name]
            FROM Students
            JOIN Groups ON Students.id_Group = Groups.id
            WHERE Groups.Name = @Group
        `;
    
        request.input('Group', mssql.VarChar, NameGroup);
    
        request.query(query, function (err, data) {
            if (err) {
                console.log("Query error: ", err);
                res.status(500).send("Query error");
                return;
            }
    
            var students = data.recordset;
    
            var html = `
            <html>
                <head>
                    <style>
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        table, th, td {
                            border: 1px solid black;
                        }
                        th, td {
                            padding: 8px;
                            text-align: left;
                        }
                        th {
                            background-color: #f2f2f2;
                        }
                    </style>
                </head>
                <body>
                    <h2>Students in Group ${NameGroup}</h2>
                    <table>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                        </tr>
            `;
    
            for (var i = 0; i < students.length; i++) {
                html += `
                <tr>
                    <td>${students[i]["First Name"]}</td>
                    <td>${students[i]["Last Name"]}</td>
                </tr>
            `;
            }
    
            html += `
                    </table>
                </body>
            </html>`;
    
            res.send(html);
        });
    });
});

app.get('/teachers', function (req, res) {

    var connection = new mssql.ConnectionPool(config);

    connection.connect(function (err) {

        var request = new mssql.Request(connection);
        request.query('SELECT * FROM Teachers', function (err, data) {
            if (err) {
                console.log(err);
                return;
            }
            else {

                var html = `
                <html>
                    <head>
                        <style>
                            table {
                                width: 100%;
                                border-collapse: collapse;
                            }
                            table, th, td {
                                border: 1px solid black;
                            }
                            th, td {
                                padding: 8px;
                                text-align: left;
                            }
                            th {
                                background-color: #f2f2f2;
                            }
                        </style>
                    </head>
                    <body>
                        <h2>Faculties List</h2>
                        <table>
                            <tr>
                                <th>Id</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                            </tr>
            `;

                var allteachers = data.recordset;

                for (var i = 0; i < allteachers.length; i++) {
                    html += `
                    <tr>
                        <td>${allteachers[i].Id}</td>
                        <td>${allteachers[i].FirstName}</td>
                        <td>${allteachers[i].LastName}</td>
                    </tr>
                `;
                }

                html += `
                        </table>
                    </body>
                </html>`;

                console.log(data.recordset);
                res.send(html);
            }
        });
    })
});


app.get('/faculties', function (req, res) {

    var connection = new mssql.ConnectionPool(config);

    connection.connect(function (err) {

        var request = new mssql.Request(connection);
        request.query('SELECT * FROM Faculties', function (err, data) {
            if (err) {
                console.log(err);
                return;
            }
            else {

                var html = `
                <html>
                    <head>
                        <style>
                            table {
                                width: 100%;
                                border-collapse: collapse;
                            }
                            table, th, td {
                                border: 1px solid black;
                            }
                            th, td {
                                padding: 8px;
                                text-align: left;
                            }
                            th {
                                background-color: #f2f2f2;
                            }
                        </style>
                    </head>
                    <body>
                        <h2>Students List</h2>
                        <table>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                
                            </tr>
            `;

                var allfaculties = data.recordset;

                for (var i = 0; i < allfaculties.length; i++) {
                    html += `
                    <tr>
                        <td>${allfaculties[i].Id}</td>
                        <td>${allfaculties[i].Name}</td>
                    </tr>
                `;
                }

                html += `
                        </table>
                    </body>
                </html>`;

                console.log(data.recordset);
                res.send(html);
            }
        });
    })
});


app.listen(port, function () {
    console.log('app listening on port ' + port);
});



const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
host: "localhost",
port: 3306,
user: "root",
password: "3471",
database: "bamazon_db"
})

whereToGo();
function whereToGo(){
    inquirer.prompt([
        {
            type: "list",
            name: "goWhere",
            message: "Where you going?",
            choices: ["Bamazon Customer", "Bamazon Manager", "Quit"]
        }
    ]).then(function(where){
        if(where.goWhere === "Bamazon Customer"){
            readProducts()
        } else if (where.goWhere === "Bamazon Manager"){
            manager()
        }
    })
}

function manager(){
    inquirer.prompt([
        {
            type: "list",
            name: "managerWhere",
            message: "What you want to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then(function(where){
        if(where.managerWhere === "View Products for Sale"){
            connection.query("SELECT * FROM products", function(err, res) {
                if (err) throw err;
                for(let i = 0; i < res.length; i++){
                    console.log(`${res[i].id} ${res[i].product_name} || ${res[i].department_name} || ${res[i].price} || ${res[i].stock_quantity}`)
                }
                connection.end();
            })
        } else if(where.managerWhere === "View Low Inventory"){
            lowInventory();
        } else if(where.managerWhere === "Add to Inventory"){
            addInventory();
        } else if(where.managerWhere === "Add New Product"){
            addNewProduct();
        }
    })
}



function readProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for(let i = 0; i < res.length; i++){
            console.log(`${res[i].id} ${res[i].product_name} || ${res[i].department_name} || ${res[i].price} || ${res[i].stock_quantity}`)
        }
        askId();
        function askId(){
            inquirer.prompt([
                {
                type: "input",
                message: "What is the ID of the product you want to buy?",
                name: "id"
                },{
                type: "input",
                message: "How many units you want to buy?",
                name: "units"
                }
            ]).then(function(inquirerResponse){
                let idChosenUnits = res[inquirerResponse.id - 1].stock_quantity
                let idChosen = res[inquirerResponse.id - 1].id
                let buyUnits = inquirerResponse.units
                let costOfProduct = res[inquirerResponse.id - 1].price
                let totalMoneyAmount = costOfProduct * buyUnits; 
                if(buyUnits > idChosenUnits){
                    console.log("Insufficient quantity!")
                    askId();
                    
                } else {
                    console.log(`Total cost: $${totalMoneyAmount}`)
                    let unitsRemain = idChosenUnits - buyUnits;
                    updateQuantity(idChosen, unitsRemain)
                
                }
                
            })
        }
    });
}

function updateQuantity(where, remain) {
    connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          stock_quantity: remain
        },
        {
          id: where 
        }
      ],
      function(err) {
        if (err) throw err;
        connection.end();
      }
    );
}

function lowInventory(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for(let i = 0; i < res.length; i++){
            if(res[i].stock_quantity <= 5){
                console.log(`${res[i].id} ${res[i].product_name} || ${res[i].department_name} || ${res[i].price} || ${res[i].stock_quantity}`)
            }
        }
        connection.end();
    })
}


function addInventory(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for(let i = 0; i < res.length; i++){
            if(res[i].stock_quantity <= 5){
                console.log(`${res[i].id} ${res[i].product_name} || ${res[i].department_name} || ${res[i].price} || ${res[i].stock_quantity}`)
            }
        }
        inquirer.prompt([
            {
                type: "input",
                message: "What product you want to resupply?",
                name: "addToProduct"
            },{
                type: "input",
                message: "How much you want to add?",
                name: "addAmount"
            }
        ]).then(function(inquirerResponse){
            let idChosenUnits = res[inquirerResponse.addToProduct - 1].stock_quantity
            let addToStock = parseInt(inquirerResponse.addAmount)
            let whatToAdd = idChosenUnits + addToStock
            updateAddOfStock(inquirerResponse.addToProduct, whatToAdd);
        })
        
        
    })
}

function updateAddOfStock(where, add){
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: add
          },
          {
            id: where 
          }
        ],
        function(err) {
          if (err) throw err;
          connection.end();
          
        }
    );
}

function addNewProduct(){
    inquirer.prompt([
        {
            type: "input",
            message: "What Product you want to add",
            name: "product"
        },{
            type: "input",
            message: "in which department the product belongs",
            name: "department"
        },{
            type: "input",
            message: "How much it will cost?",
            name: "price"
        },{
            type: "input",
            message: "How many you want",
            name: "stock"
        }
    ]).then(function(inquirerResponse){
        connection.query(
            "INSERT INTO products SET ?",
            [
              {
               product_name: inquirerResponse.product,
               department_name: inquirerResponse.department,
               price: inquirerResponse.price,
               stock_quantity: inquirerResponse.stock
              }
            ],
            function(err) {
              if (err) throw err;
              connection.end();
              
            }
        );
    })
    
}
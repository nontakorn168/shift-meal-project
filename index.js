document.addEventListener("DOMContentLoaded", () => {
    confirmID()
    fetchData()
});

async function confirmID() {
    const validIds = ["12345"]; // ID for using the website -- you have to be an employee to order food
        let userId;
        let isValid = false;

        // loop Prompt for the valid ID -- need to put the right one
        while (!isValid) {
            userId = prompt("Please confirm your ID number (12345)");

            // Check if the entered ID is 12345
            for (let i = 0; i < validIds.length; i++) {
                if (userId === validIds[i]) {
                    isValid = true;
                    break; // Exit the loop
                }
            }

            // If the ID is not valid, show an alert
            if (!isValid) {
                alert("Invalid ID. Please try again.");
            }
        }

        //valid ID, show the content
        document.getElementById("content").style.display = "block";
}

// Store all orders
let orders = [];

function fetchData() {
    fetch('http://localhost:3000/order') // Fetch orders from the JSON server
        .then(response => response.json())
        .then(data => {
            orders = data; // Store fetched orders in the `orders` array that I just made
            console.log(data); // Check data
            data.forEach(order => updateOrderList(order)); // Display each order
        })
        .catch(error => console.error("Error fetching JSON:", error));
}

// work on order form //
document.getElementById("orderForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Get name and selected food
    const name = document.getElementById("employeeName").value.trim();
    const foodElements = document.getElementsByName("food");
    const selectedFood = Array.from(foodElements)
        .filter(food => food.checked) // Filter only checked items
        .map(food => food.value);     // Get their values
    
    // Checking that they already ordered or not -- every one can order only one at the time. if you want more you need to pick up first
    const existingOrder = orders.find(order => order.name === name);
    if (existingOrder) {
        alert("You've ordered your meal already. Please pick up your meal first.");
        return;
    }

    const order = {
        name: name,
        food: selectedFood.join(", "), // Convert array to comma-separated string
    };

    updateOrderList(order);
    addOrder(order);
    
    // Reset the form
    document.getElementById("orderForm").reset();
});

// show order list
function updateOrderList(order) {
    const orderList = document.getElementById("orderList");
    const listItem = document.createElement("li");
    listItem.textContent = `${order.name} - Ordered ${order.food}`; 
    orderList.appendChild(listItem);

    // Add pickup button
    const pickupButton = document.createElement("button");
    pickupButton.textContent = "Picked Up";
    pickupButton.style.marginLeft = "10px";

    // Add event listener to Picked Up
    pickupButton.addEventListener("click", function() {
        removeOrder(order.id, listItem);
    });
    listItem.appendChild(pickupButton);
    orderList.appendChild(listItem);
}

// delete order from JSON
function removeOrder(orderId, listItem) {
    fetch(`http://localhost:3000/order/${orderId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        listItem.remove();
        orders = orders.filter(order => order.id !== orderId); // Update orders array
        console.log(`Order ${orderId} has been picked up and removed.`, data);
    })
    .catch(error => console.error("Error removing order:", error));
}

// Add oder to JSON
function addOrder(order) {
    fetch('http://localhost:3000/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    })
    .then(res => res.json())
    .then(savedOrder => {
        console.log('Order saved:', savedOrder);
        orders.push(savedOrder); // Add new order
    })
    .catch(error => console.error('Error saving order:', error));
}

// Display today's date for today order
const today = new Date();
const options = { year: 'numeric', month: 'long', day: 'numeric' };
const formattedDate = today.toLocaleDateString(undefined, options);
document.getElementById("currentDate").textContent = formattedDate;

document.addEventListener("DOMContentLoaded", () => {
    showPromptOnce()
    fetchData()
});

async function showPromptOnce() {
    const validIds = ["12345", "67890", "11223", "44556"]; // Example of multiple valid IDs
        let userId;
        let isValid = false;

        // Prompt the user for their ID until a valid ID is entered
        while (!isValid) {
            userId = prompt("Please confirm your ID number (12345)");

            // Check if the entered ID is in the array of valid IDs
            for (let i = 0; i < validIds.length; i++) {
                if (userId === validIds[i]) {
                    isValid = true;
                    break; // Exit the loop once a match is found
                }
            }

            // If the ID is not valid, show an alert
            if (!isValid) {
                alert("Invalid ID. Please try again.");
            }
        }

        // Once a valid ID is entered, show the content
        document.getElementById("content").style.display = "block";
}

// Array to store all orders
let orders = [];

function fetchData() {
    fetch('http://localhost:3000/order') // Fetch orders from the JSON server
        .then(response => response.json())
        .then(data => {
            orders = data; // Store fetched orders in the `orders` array
            console.log(data); // Check data in console or pass to a function to display
            data.forEach(order => updateOrderList(order)); // Display each order
        })
        .catch(error => console.error("Error fetching JSON:", error));
}

document.getElementById("orderForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Get name and selected food items
    const name = document.getElementById("employeeName").value.trim();
    const foodElements = document.getElementsByName("food");
    const selectedFood = Array.from(foodElements)
        .filter(food => food.checked) // Filter only checked items
        .map(food => food.value);     // Get their values
    
    // Checking that they already ordered or not
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
    
    // Reset the form (optional)
    document.getElementById("orderForm").reset();
});

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

function removeOrder(orderId, listItem) {
    fetch(`http://localhost:3000/order/${orderId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        listItem.remove();
        orders = orders.filter(order => order.id !== orderId); // Update local orders array
        console.log(`Order ${orderId} has been picked up and removed.`, data);
    })
    .catch(error => console.error("Error removing order:", error));
}

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
        orders.push(savedOrder); // Add new order to local orders array
    })
    .catch(error => console.error('Error saving order:', error));
}

// Display today's date
const today = new Date();
const options = { year: 'numeric', month: 'long', day: 'numeric' };
const formattedDate = today.toLocaleDateString(undefined, options);
document.getElementById("currentDate").textContent = formattedDate;

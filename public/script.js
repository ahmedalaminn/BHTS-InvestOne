// stock portfolio
document.addEventListener("DOMContentLoaded", function() {
    const stockList = document.querySelector('.stock-list');
    const searchButton = document.getElementById('searchButton');
    const tickerInput = document.getElementById('tickerInput');

    searchButton.addEventListener('click', function() {
        const ticker = tickerInput.value.trim().toUpperCase(); 
        if (!document.querySelector(`[data-symbol="${ticker}"]`)) {
            fetchStockData(ticker);
        } else {
            alert('Ticker already exists.'); 
        }
        tickerInput.value = ''; 
    });
    

    function fetchStockData(ticker) {
        const apiKey = 'B8IK3GH4ED5DXHZO';

        fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data['Global Quote'] && data['Global Quote']['01. symbol'] === ticker) {
                    displayStock(ticker, data);
                } 
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function displayStock(ticker, data) {
        const stockInfo = document.createElement('div');
        stockInfo.classList.add('stock-info');
        stockInfo.setAttribute('data-symbol', ticker);
        stockInfo.innerHTML = `
            <h2>${ticker}</h2>
            <p>Price: ${data['Global Quote']['05. price']}</p>
            <p>Open: ${data['Global Quote']['02. open']}</p>
            <p>High: ${data['Global Quote']['03. high']}</p>
            <p>Low: ${data['Global Quote']['04. low']}</p>
            <p>Change: ${data['Global Quote']['09. change']}</p>
            <p>Change Percent: ${data['Global Quote']['10. change percent']}</p>
            <button class="remove-button">Remove</button>
        `;
        stockList.appendChild(stockInfo);
    }

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-button')) {
            const stockInfo = event.target.closest('.stock-info');
            const symbol = stockInfo.getAttribute('data-symbol');
            stockInfo.remove();
        }
    });
});

// real estate portfolio
let properties = [];

function displayProperties() {
    const portfolioDiv = document.getElementById('portfolio');
    portfolioDiv.innerHTML = '';
    properties.forEach((property, index) => {
        const propertyDiv = document.createElement('div');
        propertyDiv.classList.add('property');
        propertyDiv.innerHTML = `
            <h2>${property.address}</h2>
            <p><strong>Purchase Price:</strong> $${property.purchasePrice}</p>
            <p><strong>Current Market Value:</strong> $${property.currentMarketValue}</p>
            <p><strong>Profit/Loss:</strong> $${property.currentMarketValue - property.purchasePrice}</p>
            <button onclick="removeProperty(${index})">Remove</button>
        `;
        portfolioDiv.appendChild(propertyDiv);
    });
}

function addProperty(event) {
    event.preventDefault();
    const address = document.getElementById('address').value;
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
    const currentMarketValue = parseFloat(document.getElementById('currentMarketValue').value);
    properties.push({ address, purchasePrice, currentMarketValue });
    displayProperties();
    document.getElementById('propertyForm').reset();
}

function removeProperty(index) {
    properties.splice(index, 1);
    displayProperties();
}

document.getElementById('propertyForm').addEventListener('submit', addProperty);

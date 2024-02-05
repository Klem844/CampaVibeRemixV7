function calculateTotal() {
    var quantity = document.getElementById('quantity').value;
    var ticketPrice = 5; // Prix par billet en euros
    var totalPrice = quantity * ticketPrice;

    document.getElementById('totalPrice').innerText = 'Total: ' + totalPrice + ' euros';
}

function purchaseTickets() {
    // Ajoutez la logique pour gérer l'achat des billets
    // Utilisez des requêtes AJAX ou d'autres méthodes côté serveur pour le traitement des ventes
    alert('Billets achetés avec succès! Total: ' + document.getElementById('totalPrice').innerText);
}

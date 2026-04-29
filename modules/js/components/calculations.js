function calculateAge(dateOfBirth) {
    const today = new Date();
    const birthData = new Date(dateOfBirth);


    const age = Math.floor((today - birthData) / (1000 * 60 * 60 * 24 * 365.25));

    return age;
}

export { calculateAge };

function formatCurrency(amount) {
    return amount.toLocaleString('En', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    })
}

export { formatCurrency };
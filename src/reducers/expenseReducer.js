const initialExpenseState = { expenses: [] };

export default function expenseReducer(state = initialExpenseState, action) {
    switch (action.type) {
        case 'SET_EXPENSES':
            return { 
                ...state,
                expenses: action.payload 
            };
        case 'SET_INVOICES':
            return {
                ...state,
                invoices: action.payload
            }
        default: return state;
    }
}
import DerivAPI from '../DerivAPI';

let api;
let account;

beforeAll(async () => {
    api = new DerivAPI();
    account = await api.account('AuthorizeToken')
});

afterAll(() => {
    api.disconnect();
});

test.skip('Buy a contract with stop-loss and take-profit', async () => {
    const contract = await api
        .contract({
            type: 'call',
            symbol: 'R_100',
            amount: 1,
        })

    // Wait until payout is more than 2 then buy 
    await contract
        .onUpdate()
        .pipe(filter(c => c.payout > 2), first())
        .toPromise()

    await contract.buy({ maxPrice: 2.00 })

    // If stop-loss or take-profit condition is made sell the contract
    await contract
        .onUpdate()
        .pipe(filter(oc => oc.payout < 1.5 || oc.payout > 2.5), first())
        .toPromise()

    if (!contract.isSold) {
        await contract.sell()
    }
})

test.skip('Subscribe to balance updates and update UI', () => {
    account.balance
        .onUpdate()
        .subscribe(balance => $('#balance').text(balance))
})

// A React component that shows balance updates
function Balance({ balance }) {
    const balanceResponse = useObservable(() => balance.onUpdate())

    return (
        <div className="balance">
            Balance: <span data-testid="balance">{ balanceResponse.display() }</span>
        </div>
    )
}

test.skip('Balance react component with rxjs-hooks', async () => {
    const { getByTestId } = render(<Balance balance={api.contract.balance} />) // react-testing-library

    api.connection.onmessage(newBalance)

    const { balance } = newBalance;

    expect(getByTestId('balance').textContent).toBe(balance.balance)
})

function Purchase({ contract }) {
    return (
        contract.open ?
            <button data-testid="buy" disabled="true" >purchase</button> :
            // The contract knows how to call buy
            <button data-testid="buy" onClick={() => contract.buy()} >purchase</button>
    )
}

test.skip('Balance react component with rxjs-hooks', async () => {
    const contract = await api
        .contract({
            type: 'call',
            symbol: 'R_100',
            amount: 1,
        })

    const { getByTestId } = render(<Purchase contract={contract} />) // react-testing-library

    api.connection.onmessage(newBalance)

    const { balance } = newBalance;

    fireEvent.click(getByTestId('buy'))

    expect(contract.status).toBe('open')
})

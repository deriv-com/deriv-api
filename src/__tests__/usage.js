import DerivAPI from '../DerivAPI';

let api;
let account;
global.WebSocket    = jest.fn();
const { WebSocket } = global;

beforeAll(async () => {
    WebSocket.prototype.close = jest.fn();

    api = new DerivAPI({ appId: 4000, endpoint: 'ws://localhost', lang: 'fr' });

    // Make an open connection
    api.connection.readyState = 1;
    api.connection.onopen();

    account = await api.account('AuthorizeToken')
});

afterAll(() => {
    api.disconnect();
});

test.skip('Buy a contract with stop-loss and take-profit', async () => {
    const contract = await account
        .contract()
        .setType('call')
        .setUnderlying(api.underlying('R_100'))
        .setAmount(1.00)
        .subscribe()

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

    if (!contract.isSold) {
        await contract.sell()
    }
})

test.skip('Subscribe to balance updates and update UI', () => {
    account
        .balance
        .onUpdate()
        .subscribe(balance => $('#balance').text(balance))
})

// A React component that shows balance updates
function Balance() {
    const balance = useObservable(() => account.balance)

    return (
        <div className="balance">
            Balance: <span data-testid="balance">{ balance }</span>
        </div>
    )
}

test.skip('Balance react component with rxjs-hooks', async () => {
    const { getByTestId } = render(<Balance />) // react-testing-library

    api.connection.onmessage(newBalance)

    expect(getByTestId('balance').textContent).toBe(newBalance.balance.balance)
})

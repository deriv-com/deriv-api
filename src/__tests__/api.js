import BinaryAPI from '../BinaryAPI.js'

test('Constructing BinaryAPI', () => {
    const api = new BinaryAPI();
    expect(api).toBeInstanceOf(BinaryAPI)
})

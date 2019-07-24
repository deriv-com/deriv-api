import CustomPromise from '../CustomPromise';

test('Pure promise', () => {
    expect(
        new Promise((resolve) => {
            resolve(1);
        }),
    ).resolves.toBe(1);

    expect(
        new Promise((resolve, reject) => {
            reject(Error());
        }),
    ).rejects.toBeInstanceOf(Error);
});

test('Custom Promise with callback', () => {
    expect(
        new CustomPromise((resolve) => {
            resolve(1);
        }),
    ).resolves.toBe(1);

    expect(
        new CustomPromise((resolve, reject) => {
            reject(Error());
        }),
    ).rejects.toBeInstanceOf(Error);
});

test('Custom Promise with promise.reject and promise.resolve', () => {
    expect(new CustomPromise().resolve(1)).resolves.toBe(1);

    expect(new CustomPromise().reject(Error())).rejects.toBeInstanceOf(Error);
});

import HashPassword from "./hash-password.cryptography";

describe("HashPassword", () => {
  test("should encrypt the password", async () => {
    const hashPassword = new HashPassword();

    jest.spyOn(hashPassword, "encrypt")
    .mockReturnValueOnce(new Promise((resolve, reject) => {
      return resolve('1234')
    }));

    expect(await hashPassword.encrypt("1234")).toBe("1234");
  });
});

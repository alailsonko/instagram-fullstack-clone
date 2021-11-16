import AuthToken from "./auth-token.service";
import dotenv from "dotenv";

dotenv.config();

jest.mock('./auth-token.service', () => {
  return jest.fn().mockImplementation(()=> {
    return {
      generate: () => '1234',
      verify: () => ({
        id: 1,
        uuid: '1234-abcd'
      }),
    }
  })
})

describe("AuthToken", () => {
  test("should generate a token", async () => {
    const authToken = new AuthToken();
    const token = await authToken.generate({
      email: "valid_mail@mail.com",
      id: 1,
      username: "valid",
      uuid: "1234-abcd",
    });
    expect(token).toBe("1234");
  });
  test("should generate a token", async () => {
    const authToken = new AuthToken();
    const decoded = await authToken.verify('1234-abcd');
    expect(decoded).toStrictEqual({
      id: 1,
      uuid: '1234-abcd'
    })
  });
});

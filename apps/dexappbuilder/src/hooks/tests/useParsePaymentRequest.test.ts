import { ChainId, CoinTypes } from "@dexkit/core";
import { renderHook } from "@testing-library/react";
import { useParsePaymentRequest } from "../blockchain";

const mockPayment = 'ethereum:0xaB992a9A66957BDdBe8CF9dcc3D03aCfaeDD84e4@137?value=1e18'

describe("useParsePaymentRequest", () => {
  it("should be undefined if nothing is passed", async () => {
    const { result } = renderHook(() => useParsePaymentRequest({}));
    expect(result.current).toBe(undefined);
  });
  it("should return chainId Polygon, native coin and value 1", async () => {
    const { result } = renderHook(() => useParsePaymentRequest({ paymentURL: mockPayment }));
    expect(result.current.amount).toBe('1');
    expect(result.current.chainId).toBe(ChainId.Polygon);
    expect(result.current.defaultCoin?.coinType).toBe(CoinTypes.EVM_ERC20)
  });
});
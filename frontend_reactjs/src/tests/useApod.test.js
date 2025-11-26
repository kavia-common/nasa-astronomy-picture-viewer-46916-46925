import { renderHook, act } from "@testing-library/react";
import { useApod } from "../hooks/useApod";

const mockApod = {
  date: "2024-02-02",
  title: "Hook APOD",
  explanation: "ok",
  url: "http://x/y.jpg",
  media_type: "image",
};

jest.mock("../services/apiClient", () => ({
  fetchApodToday: jest.fn(async () => mockApod),
  fetchApodByDate: jest.fn(async () => mockApod),
}));

test("loads today and caches", async () => {
  const { result } = renderHook(() => useApod(undefined));
  expect(result.current.loading).toBe(true);
  await act(async () => {
    await result.current.refetch();
  });
  expect(result.current.loading).toBe(false);
  expect(result.current.data?.title).toBe("Hook APOD");
  expect(result.current.error).toBeNull();
});

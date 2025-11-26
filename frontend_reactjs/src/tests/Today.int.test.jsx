import { render, screen } from "@testing-library/react";
import Today from "../pages/Today";

jest.mock("../hooks/useApod", () => ({
  useApod: () => ({
    data: {
      date: "2024-03-01",
      title: "Today Title",
      explanation: "ex",
      url: "http://x",
      media_type: "image",
    },
    loading: false,
    error: null,
    refetch: jest.fn(),
  }),
}));

test("renders Today content and card", () => {
  render(<Today />);
  expect(screen.getByRole("heading", { level: 1, name: /today/i })).toBeInTheDocument();
  expect(screen.getByText("Today Title")).toBeInTheDocument();
});

import { render, screen, fireEvent } from "@testing-library/react";
import Archive from "../pages/Archive";

const refetch = jest.fn();

jest.mock("../hooks/useApod", () => ({
  useApod: (date) => ({
    data: date
      ? {
          date,
          title: `APOD ${date}`,
          explanation: "ex",
          url: "http://x",
          media_type: "image",
        }
      : null,
    loading: false,
    error: null,
    refetch,
  }),
}));

test("archive updates on date change", () => {
  render(<Archive />);
  const input = screen.getByLabelText(/apod date selector/i);
  fireEvent.change(input, { target: { value: "2024-01-15" } });

  // After change, mocked hook returns data for that date
  expect(screen.getByText(/APOD 2024-01-15/)).toBeInTheDocument();
});

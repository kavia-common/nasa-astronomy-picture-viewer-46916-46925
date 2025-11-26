import { render, screen } from "@testing-library/react";
import Loader from "../components/Loader";

test("renders loader with default message", () => {
  render(<Loader />);
  expect(screen.getByRole("status")).toBeInTheDocument();
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

test("renders loader with custom message", () => {
  render(<Loader message="Fetching data..." />);
  expect(screen.getByText(/fetching data/i)).toBeInTheDocument();
});

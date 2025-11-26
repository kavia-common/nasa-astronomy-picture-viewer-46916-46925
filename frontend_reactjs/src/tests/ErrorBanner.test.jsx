import { render, screen, fireEvent } from "@testing-library/react";
import ErrorBanner from "../components/ErrorBanner";

test("hides when no error", () => {
  const { container } = render(<ErrorBanner error={null} />);
  expect(container).toBeEmptyDOMElement();
});

test("shows error and calls onRetry", () => {
  const onRetry = jest.fn();
  render(<ErrorBanner error={new Error("Boom")} onRetry={onRetry} />);
  expect(screen.getByRole("alert")).toBeInTheDocument();
  expect(screen.getByText(/boom/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /retry/i }));
  expect(onRetry).toHaveBeenCalled();
});

test("shows details line when error.toString differs", () => {
  const err = new Error("Msg");
  err.toString = () => "CustomString";
  render(<ErrorBanner error={err} />);
  expect(screen.getByText(/error: msg/i)).toBeInTheDocument();
  expect(screen.getByText(/details: customstring/i)).toBeInTheDocument();
});

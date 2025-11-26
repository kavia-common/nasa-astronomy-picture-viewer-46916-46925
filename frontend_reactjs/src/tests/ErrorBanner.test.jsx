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
  fireEvent.click(screen.getByRole("button", { name: /retry/i }));
  expect(onRetry).toHaveBeenCalled();
});

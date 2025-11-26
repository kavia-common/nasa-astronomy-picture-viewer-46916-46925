import { render, screen, fireEvent } from "@testing-library/react";
import ApodModal from "../components/ApodModal";

const apod = {
  date: "2024-01-01",
  title: "Test APOD",
  explanation: "desc",
  url: "http://example.com/x.jpg",
  media_type: "image",
  hdurl: "http://example.com/hd.jpg",
};

test("does not render when no apod", () => {
  const { container } = render(<ApodModal apod={null} onClose={() => {}} />);
  expect(container).toBeEmptyDOMElement();
});

test("renders and closes on overlay click", () => {
  const onClose = jest.fn();
  render(<ApodModal apod={apod} onClose={onClose} />);
  const dialog = screen.getByRole("dialog");
  fireEvent.click(dialog); // click overlay
  expect(onClose).toHaveBeenCalled();
});

test("renders image and HD link", () => {
  render(<ApodModal apod={apod} onClose={() => {}} />);
  expect(screen.getByRole("img", { name: apod.title })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /open hd image/i })).toHaveAttribute("href", apod.hdurl);
});

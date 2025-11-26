import { render, screen, fireEvent } from "@testing-library/react";
import ApodCard from "../components/ApodCard";

const apod = {
  date: "2024-01-01",
  title: "Test APOD",
  explanation: "desc",
  url: "http://example.com/x.jpg",
  media_type: "image",
  hdurl: "http://example.com/hd.jpg",
};

test("renders APOD card and actions", () => {
  const onOpen = jest.fn();
  render(<ApodCard apod={apod} onOpen={onOpen} />);
  expect(screen.getByRole("img", { name: apod.title })).toBeInTheDocument();
  const viewBtn = screen.getByRole("button", { name: /open details/i });
  fireEvent.click(viewBtn);
  expect(onOpen).toHaveBeenCalledWith(apod);
  expect(screen.getByRole("link", { name: /open hd image/i })).toHaveAttribute("href", apod.hdurl);
});

test("renders video fallback", () => {
  const video = { ...apod, media_type: "video" };
  render(<ApodCard apod={video} />);
  expect(screen.getByText(/video content/i)).toBeInTheDocument();
});

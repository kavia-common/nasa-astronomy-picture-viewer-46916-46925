import { render, screen, fireEvent } from "@testing-library/react";
import DatePicker from "../components/DatePicker";

test("renders date input and emits change", () => {
  const onChange = jest.fn();
  render(<DatePicker value="" onChange={onChange} id="test-date" />);
  const input = screen.getByLabelText(/apod date selector/i);
  fireEvent.change(input, { target: { value: "2024-01-10" } });
  expect(onChange).toHaveBeenCalledWith("2024-01-10");
});

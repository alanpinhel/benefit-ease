import { render } from "@/test-utils";
import HomePage from "./page";

describe("Home", () => {
  it("should render home page", () => {
    render(<HomePage />);
  });
});

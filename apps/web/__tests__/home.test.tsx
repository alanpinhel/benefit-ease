import HomePage from "@/app/page";
import { render } from "@/test-utils";

describe("Home", () => {
  it("should render home page", () => {
    render(<HomePage />);
  });
});

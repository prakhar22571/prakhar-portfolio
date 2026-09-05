import { test, expect, vi } from "vitest";
import { StrictMode, useEffect, useState } from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { PortfolioDataProvider } from "@/context/portfolio-data";
import { usePortfolioData } from "@/context/use-portfolio-data";
import api from "@/lib/api";
vi.mock("@/lib/api", () => ({ default: { get: vi.fn() } }));
function Home() {
  const { load, status } = usePortfolioData();
  useEffect(() => {
    load();
  }, [load]);
  return <p>{status}</p>;
}
function Navigation() {
  const [home, setHome] = useState(true);
  return (
    <>
      <button onClick={() => setHome((value) => !value)}>Navigate</button>
      {home ? <Home /> : <p>Project page</p>}
    </>
  );
}
test("home requests are deduplicated in StrictMode and cached across navigation", async () => {
  api.get.mockResolvedValue({
    data: {
      user: {},
      projects: [],
      timelines: [],
      skills: [],
      softwareApplications: [],
    },
  });
  render(
    <StrictMode>
      <PortfolioDataProvider>
        <Navigation />
      </PortfolioDataProvider>
    </StrictMode>,
  );
  await screen.findByText("ready");
  expect(api.get).toHaveBeenCalledTimes(5);
  fireEvent.click(screen.getByText("Navigate"));
  await screen.findByText("Project page");
  fireEvent.click(screen.getByText("Navigate"));
  await waitFor(() => expect(screen.getByText("ready")).toBeTruthy());
  expect(api.get).toHaveBeenCalledTimes(5);
});

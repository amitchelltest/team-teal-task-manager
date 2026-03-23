import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";

const spies = vi.hoisted(() => ({
  boardProps: vi.fn(),
}));

vi.mock("../../src/components/Board.jsx", () => ({
  default: (props) => {
    spies.boardProps(props);
    const totalTasks = props.columns.reduce((sum, col) => sum + col.tasks.length, 0);
    return <div data-testid="clinician-board">tasks:{totalTasks}</div>;
  },
}));

import ClinicianBoard from "../../src/components/ClinicianBoard.jsx";

describe("ClinicianBoard", () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    global.fetch = vi.fn(async (url) => {
      const urlStr = String(url);
      if (urlStr.includes("/api/columns")) {
        return {
          ok: true,
          json: async () => [
            { id: 1, name: "To Do" },
            { id: 2, name: "Done" },
          ],
        };
      }
      if (urlStr.includes("/api/tasks")) {
        return {
          ok: true,
          json: async () => [
            { id: 1, column_id: 1, position: 0, assignee_id: 10, reporter_id: 20 },
            { id: 2, column_id: 2, position: 0, assignee_id: 11, reporter_id: 21 },
          ],
        };
      }
      return { ok: true, json: async () => [] };
    });
    spies.boardProps.mockClear();
  });

  afterEach(() => {
    cleanup();
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("loads columns and tasks then renders filtered board", async () => {
    render(
      <ClinicianBoard
        selectedAssignee="all"
        selectedReporter="all"
        selectedStatus="all"
      />,
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/columns?project_id=1");
      expect(global.fetch).toHaveBeenCalledWith("/api/tasks?reporter_id=1");
      expect(screen.getByTestId("clinician-board").textContent).toContain("tasks:2");
    });
  });

  it("applies assignee, reporter, and status filters", async () => {
    render(
      <ClinicianBoard
        selectedAssignee="10"
        selectedReporter="20"
        selectedStatus="1"
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId("clinician-board").textContent).toContain("tasks:1");
      expect(spies.boardProps).toHaveBeenCalled();
    });
  });
});

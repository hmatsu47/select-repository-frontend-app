// @vitest-environment jsdom

import { describe, expect, test, vi } from "vitest";
import "vi-fetch/setup";
import { mockFetch, mockGet } from "vi-fetch";
import { fireEvent, render } from "@solidjs/testing-library";
import { formatSnapshot } from "../common/formatSnapshot";
import { ImageItem, RepositoryItem } from "../../src/type";
import { baseUri } from "../../src/api/apiHandler";
import { RepositoryButton } from "../../src/components/RepositoryButton";
import { repository, setService } from "../../src/signal";

describe("<RepositoryButton />", () => {
  beforeEach(() => {
    mockFetch.clearAll();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  test("リポジトリボタン", async () => {
    localStorage.removeItem("selectedService");
    localStorage.removeItem("selectedRepository-service1");
    setService("service1");
    const mockImages = mockGet(
      `${baseUri}/images/service1/repository1`
    ).willResolve([
      {
        digest: "",
        pushed_at: new Date(),
        repository_name: "repository1",
        size: 10000,
        uri: "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/repository1@sha256:4c716d4cf211c7b7d2f3233c941771ad0507ea5bacf93b492766aa41ae9f720d",
      } as ImageItem,
    ]);
    const { container, findByText, unmount } = render(() => (
      <RepositoryButton
        repositoryItem={
          {
            name: "repository1",
            uri: "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/repository1",
          } as RepositoryItem
        }
      />
    ));
    // css の名前が動的に変わるので固定値に置換
    const htmlBefore = formatSnapshot(container.innerHTML);
    expect(htmlBefore).toMatchSnapshot();
    // ボタンクリック
    const button = (await findByText("repository1")) as HTMLInputElement;
    expect(button).toHaveTextContent("repository1");
    fireEvent.click(button);
    // ボタンクリック後の照合
    const htmlAfter = formatSnapshot(container.innerHTML);
    expect(htmlAfter).toMatchSnapshot();
    expect(mockImages).toHaveFetched();
    expect(repository()).toBe("repository1");
    unmount();
    localStorage.removeItem("selectedService");
    localStorage.removeItem("selectedRepository-service1");
  });
});

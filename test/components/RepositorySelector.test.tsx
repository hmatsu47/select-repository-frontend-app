import { describe, expect, test } from "vitest";
import { render } from "solid-testing-library";
import { formatSnapshot } from "../common/formatSnapshot";
import { RepositoryItem } from "../../src/type";
import { RepositorySelector } from "../../src/components/RepositorySelector";
import { setRepositories, setService } from "../../src/signal";

describe("<RepositorySelector />", () => {
  const repositorySelectorList = [
    {
      title: "リポジトリ x1",
      service: "service1",
      repositories: [
        {
          name: "repository1",
          uri: "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/repository1",
        } as RepositoryItem,
      ],
    },
    {
      title: "リポジトリ x2",
      service: "service2",
      repositories: [
        {
          name: "repository1",
          uri: "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/repository1",
        } as RepositoryItem,
        {
          name: "repository2",
          uri: "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/repository2",
        } as RepositoryItem,
      ],
    },
    {
      title: "リポジトリ x3",
      service: "service3",
      repositories: [
        {
          name: "repository1",
          uri: "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/repository1",
        } as RepositoryItem,
        {
          name: "repository2",
          uri: "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/repository2",
        } as RepositoryItem,
        {
          name: "repository3",
          uri: "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/repository3",
        } as RepositoryItem,
      ],
    },
  ];
  repositorySelectorList.forEach((testCase) => {
    test(testCase.title, async () => {
      localStorage.removeItem(`selectedRepository-${testCase.service}`);
      setService(testCase.service);
      setRepositories(testCase.repositories);
      const { container, findByText, unmount } = render(() => (
        <RepositorySelector />
      ));
      // css の名前が動的に変わるので固定値に置換
      const html = formatSnapshot(container.innerHTML);
      expect(html).toMatchSnapshot();
      // 各ボタン
      testCase.repositories.forEach(async (repository) => {
        const button = (await findByText(repository.name)) as HTMLElement;
        expect(button).toHaveTextContent(repository.name);
      });
      unmount();
    });
  });
});
